import { useState, useEffect, useRef, useCallback } from 'react';
import { GoogleGenAI, LiveServerMessage } from '@google/genai';
import { pcmToGeminiBlob } from '../utils/audioUtils';

interface UseGeminiLiveProps {
  apiKey: string | undefined;
  stream: MediaStream | null;
  isActive: boolean;
}

// Helper type for the session since it's not exported directly
type LiveSession = Awaited<ReturnType<InstanceType<typeof GoogleGenAI>['live']['connect']>>;

export const useGeminiLive = ({ apiKey, stream, isActive }: UseGeminiLiveProps) => {
  const [transcription, setTranscription] = useState<string>('');
  const [status, setStatus] = useState<'idle' | 'connecting' | 'connected' | 'error'>('idle');
  const sessionRef = useRef<LiveSession | null>(null);
  const inputContextRef = useRef<AudioContext | null>(null);
  const scriptProcessorRef = useRef<ScriptProcessorNode | null>(null);
  const sourceRef = useRef<MediaStreamAudioSourceNode | null>(null);

  const cleanup = useCallback(() => {
    if (sessionRef.current) {
      sessionRef.current.close();
      sessionRef.current = null;
    }
    if (sourceRef.current) {
      sourceRef.current.disconnect();
      sourceRef.current = null;
    }
    if (scriptProcessorRef.current) {
      scriptProcessorRef.current.disconnect();
      scriptProcessorRef.current = null;
    }
    if (inputContextRef.current && inputContextRef.current.state !== 'closed') {
      inputContextRef.current.close();
      inputContextRef.current = null;
    }
    setStatus('idle');
  }, []);

  useEffect(() => {
    if (!isActive || !stream || !apiKey) {
      cleanup();
      return;
    }

    const connectToGemini = async () => {
      setStatus('connecting');
      try {
        const ai = new GoogleGenAI({ apiKey });
        
        // Setup Audio Context for 16kHz resampling
        const ctx = new (window.AudioContext || (window as any).webkitAudioContext)({
          sampleRate: 16000,
        });
        inputContextRef.current = ctx;

        const session = await ai.live.connect({
          model: 'gemini-2.5-flash-native-audio-preview-09-2025',
          config: {
             inputAudioTranscription: {
                 model: "google_speech_transcription" // Explicitly requesting generic speech model
             },
             systemInstruction: "You are a helpful transcriber. Simply listen and do not respond with audio.",
          },
          callbacks: {
            onopen: () => {
              setStatus('connected');
              // Start streaming audio
              const source = ctx.createMediaStreamSource(stream);
              const processor = ctx.createScriptProcessor(4096, 1, 1);
              
              processor.onaudioprocess = (e) => {
                const inputData = e.inputBuffer.getChannelData(0);
                const blob = pcmToGeminiBlob(inputData);
                // Ensure session is connected before sending
                session.sendRealtimeInput({ media: blob });
              };

              source.connect(processor);
              processor.connect(ctx.destination); // Required for script processor to run

              sourceRef.current = source;
              scriptProcessorRef.current = processor;
            },
            onmessage: (msg: LiveServerMessage) => {
               // Handle transcription
               if (msg.serverContent?.inputTranscription) {
                 const text = msg.serverContent.inputTranscription.text;
                 if (text) {
                     setTranscription(prev => prev + text);
                 }
               }
            },
            onclose: () => {
              setStatus('idle');
            },
            onerror: (err) => {
              console.error('Gemini Live Error:', err);
              setStatus('error');
            }
          }
        });
        
        sessionRef.current = session;

      } catch (error) {
        console.error("Failed to connect to Gemini Live:", error);
        setStatus('error');
        cleanup();
      }
    };

    connectToGemini();

    return cleanup;
  }, [isActive, stream, apiKey, cleanup]);

  return { transcription, status, setTranscription };
};