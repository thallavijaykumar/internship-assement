import React, { useState, useEffect } from 'react';
import { Mic, MicOff, Activity, FileText, LayoutDashboard, KeyRound } from 'lucide-react';
import Visualizer from './components/Visualizer';
import AuditReport from './components/AuditReport';
import { useGeminiLive } from './hooks/useGeminiLive';
import { AppTab } from './types';

function App() {
  const [activeTab, setActiveTab] = useState<AppTab>(AppTab.VISUALIZER);
  const [isRecording, setIsRecording] = useState(false);
  const [stream, setStream] = useState<MediaStream | null>(null);
  const [apiKey, setApiKey] = useState<string>('');
  
  // Try to load API key from env if available (for demo purposes if env is set)
  useEffect(() => {
    if (process.env.API_KEY) {
       setApiKey(process.env.API_KEY);
    }
  }, []);

  const toggleRecording = async () => {
    if (isRecording) {
      if (stream) {
        stream.getTracks().forEach(track => track.stop());
        setStream(null);
      }
      setIsRecording(false);
    } else {
      if (!apiKey) {
        alert("Please enter a valid Gemini API Key first.");
        return;
      }
      try {
        const newStream = await navigator.mediaDevices.getUserMedia({ audio: true });
        setStream(newStream);
        setIsRecording(true);
      } catch (err) {
        console.error("Error accessing microphone:", err);
        alert("Microphone access denied or not available.");
      }
    }
  };

  const { transcription, status } = useGeminiLive({
    apiKey,
    stream,
    isActive: isRecording
  });

  return (
    <div className="min-h-screen bg-background text-gray-100 font-sans selection:bg-blue-500/30">
      
      {/* Navbar */}
      <nav className="fixed top-0 left-0 right-0 h-16 bg-surface/80 backdrop-blur-md border-b border-white/5 z-50 flex items-center justify-between px-6">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center shadow-lg shadow-purple-900/20">
             <Activity size={18} className="text-white" />
          </div>
          <span className="font-bold text-lg tracking-tight">PrepXL <span className="text-gray-500 font-normal text-sm ml-1">Intern Demo</span></span>
        </div>
        
        <div className="flex gap-1 bg-black/20 p-1 rounded-xl border border-white/5">
          <button 
            onClick={() => setActiveTab(AppTab.VISUALIZER)}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${activeTab === AppTab.VISUALIZER ? 'bg-surface shadow-sm text-white' : 'text-gray-500 hover:text-gray-300'}`}
          >
            Visualizer & Live
          </button>
          <button 
            onClick={() => setActiveTab(AppTab.AUDIT)}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${activeTab === AppTab.AUDIT ? 'bg-surface shadow-sm text-white' : 'text-gray-500 hover:text-gray-300'}`}
          >
            UX Audit
          </button>
        </div>

        <div className="flex items-center gap-4">
             {/* Simple API Key Input for Demo purposes since we can't rely on env vars in all preview environments */}
             {!process.env.API_KEY && (
               <div className="hidden md:flex items-center gap-2 bg-black/20 px-3 py-1.5 rounded-lg border border-white/5 focus-within:border-blue-500/50 transition-colors">
                  <KeyRound size={14} className="text-gray-500" />
                  <input 
                    type="password" 
                    placeholder="Enter Gemini API Key" 
                    value={apiKey}
                    onChange={(e) => setApiKey(e.target.value)}
                    className="bg-transparent border-none outline-none text-xs w-32 text-gray-300 placeholder-gray-600"
                  />
               </div>
             )}
             <a href="https://github.com" target="_blank" rel="noreferrer" className="w-8 h-8 rounded-full bg-white/5 flex items-center justify-center hover:bg-white/10 transition">
                <div className="w-4 h-4 bg-gray-400 rounded-full" />
             </a>
        </div>
      </nav>

      {/* Main Content */}
      <main className="pt-24 pb-12 px-4 md:px-8 max-w-7xl mx-auto">
        
        {activeTab === AppTab.VISUALIZER && (
          <div className="grid lg:grid-cols-3 gap-8 h-[calc(100vh-140px)]">
            
            {/* Left: Visualizer Area */}
            <div className="lg:col-span-2 flex flex-col gap-6">
              <div className="flex items-center justify-between">
                 <h2 className="text-2xl font-semibold flex items-center gap-2">
                    <Activity className="text-blue-400" />
                    Circular Equalizer
                 </h2>
                 <div className="flex items-center gap-2">
                   <span className={`h-2 w-2 rounded-full ${status === 'connected' ? 'bg-green-500 animate-pulse' : 'bg-gray-600'}`} />
                   <span className="text-xs uppercase font-mono text-gray-500">{status === 'connected' ? 'Live Connected' : 'Gemini Idle'}</span>
                 </div>
              </div>
              
              <Visualizer stream={stream} isActive={isRecording} />

              {/* Controls */}
              <div className="flex justify-center">
                <button
                  onClick={toggleRecording}
                  disabled={!apiKey}
                  className={`
                    group relative flex items-center gap-3 px-8 py-4 rounded-full font-bold text-lg transition-all duration-300 shadow-xl
                    ${!apiKey ? 'bg-gray-800 text-gray-500 cursor-not-allowed' : 
                      isRecording 
                        ? 'bg-red-500/10 text-red-500 hover:bg-red-500/20 border border-red-500/50' 
                        : 'bg-blue-600 text-white hover:bg-blue-500 hover:scale-105'
                    }
                  `}
                >
                  {isRecording ? <MicOff size={24} /> : <Mic size={24} />}
                  {isRecording ? 'Stop Stream' : 'Start Stream'}
                  
                  {isRecording && (
                    <span className="absolute -top-1 -right-1 flex h-3 w-3">
                      <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
                      <span className="relative inline-flex rounded-full h-3 w-3 bg-red-500"></span>
                    </span>
                  )}
                </button>
              </div>
            </div>

            {/* Right: Transcription */}
            <div className="lg:col-span-1 bg-surface rounded-3xl border border-white/5 flex flex-col overflow-hidden shadow-2xl">
              <div className="p-6 border-b border-white/5 flex items-center justify-between bg-black/20">
                <h3 className="font-semibold flex items-center gap-2">
                  <FileText size={18} className="text-purple-400" />
                  Live Transcript
                </h3>
                <span className="text-xs text-gray-500 bg-white/5 px-2 py-1 rounded">Gemini 2.5 Flash</span>
              </div>
              
              <div className="flex-1 p-6 overflow-y-auto font-mono text-sm leading-relaxed text-gray-300 space-y-4 scroll-smooth">
                {transcription ? (
                   <p className="whitespace-pre-wrap animate-in fade-in slide-in-from-bottom-2 duration-500">
                     {transcription}
                     {isRecording && <span className="inline-block w-2 h-4 ml-1 bg-blue-500 animate-pulse align-middle" />}
                   </p>
                ) : (
                  <div className="h-full flex flex-col items-center justify-center text-gray-600 space-y-4">
                     <div className="w-16 h-16 rounded-full bg-white/5 flex items-center justify-center">
                        <Mic size={24} className="opacity-20" />
                     </div>
                     <p className="text-center text-xs max-w-[200px]">
                       Start the stream to see real-time transcription powered by Gemini Live API.
                     </p>
                  </div>
                )}
              </div>
              
              <div className="p-4 border-t border-white/5 bg-black/20 text-xs text-gray-500 text-center">
                Transcription latency depends on network connection.
              </div>
            </div>

          </div>
        )}

        {activeTab === AppTab.AUDIT && <AuditReport />}

      </main>
    </div>
  );
}

export default App;
