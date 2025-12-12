import React, { useEffect, useRef } from 'react';

interface VisualizerProps {
  stream: MediaStream | null;
  isActive: boolean;
}

const Visualizer: React.FC<VisualizerProps> = ({ stream, isActive }) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const audioContextRef = useRef<AudioContext | null>(null);
  const analyserRef = useRef<AnalyserNode | null>(null);
  const requestRef = useRef<number | null>(null);

  useEffect(() => {
    if (!stream || !isActive || !canvasRef.current || !containerRef.current) return;

    // Audio Setup
    const audioCtx = new (window.AudioContext || (window as any).webkitAudioContext)();
    audioContextRef.current = audioCtx;
    const analyser = audioCtx.createAnalyser();
    analyser.fftSize = 512; // Controls bar count
    analyserRef.current = analyser;

    const source = audioCtx.createMediaStreamSource(stream);
    source.connect(analyser);

    const bufferLength = analyser.frequencyBinCount;
    const dataArray = new Uint8Array(bufferLength);
    
    // Canvas Setup
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const render = () => {
      if (!ctx || !analyser) return;

      // Handle Resize
      const { clientWidth, clientHeight } = containerRef.current!;
      if (canvas.width !== clientWidth || canvas.height !== clientHeight) {
        canvas.width = clientWidth;
        canvas.height = clientHeight;
      }

      const width = canvas.width;
      const height = canvas.height;
      const centerX = width / 2;
      const centerY = height / 2;
      const radius = Math.min(width, height) / 3.5;

      analyser.getByteFrequencyData(dataArray);

      // Fade out effect
      ctx.fillStyle = 'rgba(9, 9, 11, 0.2)'; // Tailwind bg-background with opacity
      ctx.fillRect(0, 0, width, height);

      // Draw Circular Bars
      // We only use part of the spectrum usually, as high freqs are often empty
      const barsToDraw = bufferLength * 0.75; 
      const angleStep = (2 * Math.PI) / barsToDraw;

      for (let i = 0; i < barsToDraw; i++) {
        const value = dataArray[i];
        // Scale bar height
        const barHeight = Math.max(4, (value / 255) * (radius * 0.8));
        
        // Calculate angle
        const angle = i * angleStep;
        
        // Colors based on frequency/index
        // Low freq (bass) = Purple/Pink, High freq = Cyan/Blue
        const hue = (i / barsToDraw) * 180 + 240; // 240 (blue) to 420 (purple/pink wrap)
        const color = `hsla(${hue}, 80%, 60%, 0.9)`;

        ctx.save();
        ctx.translate(centerX, centerY);
        ctx.rotate(angle);

        // Draw Bar (extending outwards)
        ctx.fillStyle = color;
        // Rounded caps manually
        ctx.beginPath();
        // Slightly offset x to center the bar on the angle ray
        ctx.roundRect(-2, radius, 4, barHeight, 2); 
        ctx.fill();

        // Reflection (optional inner ring for aesthetics)
        ctx.fillStyle = `hsla(${hue}, 80%, 60%, 0.2)`;
        ctx.fillRect(-1, radius - 10, 2, -barHeight * 0.2);

        ctx.restore();
      }
      
      // Draw center decorative circle
      ctx.beginPath();
      ctx.arc(centerX, centerY, radius * 0.9, 0, 2 * Math.PI);
      ctx.strokeStyle = 'rgba(59, 130, 246, 0.1)'; // Primary low opacity
      ctx.lineWidth = 2;
      ctx.stroke();

      requestRef.current = requestAnimationFrame(render);
    };

    render();

    return () => {
      if (requestRef.current !== null) cancelAnimationFrame(requestRef.current);
      if (audioContextRef.current) audioContextRef.current.close();
    };
  }, [stream, isActive]);

  return (
    <div ref={containerRef} className="relative w-full h-[500px] bg-background flex items-center justify-center overflow-hidden rounded-3xl border border-white/5 shadow-2xl">
      <canvas ref={canvasRef} className="absolute inset-0 z-10" />
      {!isActive && (
         <div className="z-20 text-gray-400 font-mono text-sm animate-pulse">
            Waiting for audio stream...
         </div>
      )}
      <div className="absolute inset-0 bg-gradient-to-tr from-purple-900/10 to-blue-900/10 z-0 pointer-events-none" />
    </div>
  );
};

export default Visualizer;