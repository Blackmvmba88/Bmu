
import React, { useState } from 'react';
import { generateCircuitVisual } from '../services/geminiService';

export const MambaCircuits: React.FC = () => {
  const [prompt, setPrompt] = useState("");
  const [imageUrl, setImageUrl] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const handleGenerate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!prompt.trim()) return;
    setLoading(true);
    const result = await generateCircuitVisual(prompt);
    setImageUrl(result);
    setLoading(false);
  };

  return (
    <div className="p-10 glass rounded-[3.5rem] border border-white/10 space-y-12 animate-in fade-in duration-1000 relative overflow-hidden">
      <div className="flex flex-col md:flex-row justify-between items-start gap-8 relative z-10">
        <div className="space-y-2">
          <h3 className="text-5xl font-black font-display text-white italic tracking-tighter uppercase">
            MAMBA <span className="mamba-text">CIRCUITS</span>
          </h3>
          <p className="text-slate-500 font-bold text-xs uppercase tracking-[0.4em]">Laboratorio de Mecatrónica v13.0</p>
        </div>
        
        <div className="flex bg-black/40 p-4 rounded-2xl border border-white/5 gap-6">
           <div className="flex flex-col items-center">
              <span className="text-[8px] font-black text-slate-500 uppercase mb-1">Voltaje_Core</span>
              <span className="text-xl font-black text-accent-primary">5.0V</span>
           </div>
           <div className="flex flex-col items-center">
              <span className="text-[8px] font-black text-slate-500 uppercase mb-1">Amperaje</span>
              <span className="text-xl font-black text-white">250mA</span>
           </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
        {/* Prompt Section */}
        <div className="space-y-8 h-full flex flex-col justify-center">
          <div className="space-y-6 bg-white/[0.02] p-10 rounded-[3rem] border border-white/5 relative">
            <div className="flex items-center gap-3 mb-4">
               <span className="w-2 h-2 rounded-full bg-yellow-500 animate-pulse"></span>
               <span className="text-[10px] font-black text-yellow-500 uppercase tracking-widest">Neural Circuit Architect</span>
            </div>
            
            <h4 className="text-2xl font-black text-white italic uppercase tracking-tighter leading-tight">
              Diseña tu <span className="mamba-text">arquitectura</span> de control
            </h4>
            
            <form onSubmit={handleGenerate} className="space-y-6">
               <textarea 
                 value={prompt}
                 onChange={(e) => setPrompt(e.target.value)}
                 placeholder="Ej: Circuito con Arduino Uno, sensor de temperatura y pantalla LCD..."
                 className="w-full h-32 bg-black/40 border border-white/10 rounded-2xl px-6 py-4 text-white placeholder:text-slate-600 focus:outline-none focus:border-accent-primary/50 transition-all text-sm resize-none"
               />
               <button 
                 disabled={loading}
                 className="w-full py-5 mamba-gradient text-black font-black rounded-2xl hover:scale-[1.02] transition-all disabled:opacity-50 flex items-center justify-center gap-4 shadow-xl"
               >
                 {loading ? (
                   <>
                     <div className="w-5 h-5 border-2 border-black/20 border-t-black rounded-full animate-spin"></div>
                     <span>COMPILANDO HARDWARE...</span>
                   </>
                 ) : (
                   <>
                     <span>GENERAR ESQUEMÁTICO</span>
                     <span className="text-xl">⚡</span>
                   </>
                 )}
               </button>
            </form>
          </div>

          {/* Logic Analyzer Visualization */}
          <div className="bg-black/40 p-8 rounded-[2.5rem] border border-white/5 space-y-4">
             <div className="flex justify-between items-center">
                <span className="text-[9px] font-black text-slate-500 uppercase tracking-widest">Logic Analyzer Stream</span>
                <span className="text-[9px] font-black text-accent-primary uppercase tracking-widest animate-pulse">Live_Signal</span>
             </div>
             <div className="h-16 flex items-center gap-1">
                {Array.from({length: 40}).map((_, i) => (
                  <div 
                    key={i} 
                    className="flex-1 bg-accent-primary/20 rounded-full transition-all duration-300"
                    style={{ 
                      height: `${Math.random() * 100}%`,
                      opacity: Math.random() > 0.5 ? 0.8 : 0.2
                    }}
                  />
                ))}
             </div>
          </div>
        </div>

        {/* Visualizer Display */}
        <div className="relative aspect-square bg-slate-950/80 rounded-[4rem] border-2 border-white/5 overflow-hidden flex items-center justify-center group shadow-2xl">
           {loading ? (
             <div className="flex flex-col items-center gap-6 animate-pulse">
                <div className="w-20 h-20 rounded-full border-4 border-dashed border-accent-primary animate-spin"></div>
                <p className="text-[10px] font-black text-accent-primary tracking-[0.5em] uppercase">Transferencia de Datos Biométricos...</p>
             </div>
           ) : imageUrl ? (
             <img 
               src={imageUrl} 
               alt="Circuit Schematic" 
               className="w-full h-full object-cover animate-in fade-in zoom-in duration-1000"
             />
           ) : (
             <div className="text-center space-y-4 opacity-20">
                <div className="text-8xl">⚙️</div>
                <p className="text-[10px] font-black uppercase tracking-widest">Esperando Parámetros de Diseño</p>
             </div>
           )}

           {/* HUD Overlays */}
           <div className="absolute top-8 left-8 p-4 bg-black/60 backdrop-blur-md rounded-2xl border border-white/10 flex flex-col gap-1 pointer-events-none">
              <span className="text-[8px] font-black text-accent-primary uppercase tracking-widest">Layer: PHYSICAL_GRID</span>
              <span className="text-[10px] font-bold text-white/40">RES_LOCK: 1024px</span>
           </div>

           {imageUrl && (
             <div className="absolute bottom-8 right-8 flex gap-3">
               <button className="p-3 bg-white/5 hover:bg-white/10 rounded-xl border border-white/10 transition-all text-xl">🔍</button>
               <button className="p-3 bg-white/5 hover:bg-white/10 rounded-xl border border-white/10 transition-all text-xl">📥</button>
             </div>
           )}
        </div>
      </div>
    </div>
  );
};
