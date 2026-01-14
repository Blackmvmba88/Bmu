
import React, { useState } from 'react';

export const BMUBiology: React.FC<{ theme?: 'mamba' | 'pao' }> = ({ theme }) => {
  const [nucleotideColor1, setNucleotideColor1] = useState('#a3e635');
  const [nucleotideColor2, setNucleotideColor2] = useState('#10b981');
  const [rotation, setRotation] = useState(0);

  const mambaText = theme === 'mamba' ? 'mamba-text' : 'text-pink-400';

  return (
    <div className="p-10 glass rounded-[3rem] border border-white/10 space-y-12 animate-in slide-in-from-left duration-1000">
      <div className="flex justify-between items-center">
        <div>
          <h3 className="text-4xl font-black font-display text-white italic uppercase tracking-tighter">BMU Biology <span className={mambaText}>Lab</span></h3>
          <p className="text-slate-500 font-bold text-xs uppercase tracking-[0.4em]">Ingeniería Genética y Visualización de ADN</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
        <div className="space-y-8 bg-white/[0.02] p-8 rounded-[2.5rem] border border-white/5">
           <div className="space-y-8">
             <h4 className="text-[10px] font-black text-slate-500 uppercase tracking-widest border-b border-white/5 pb-2">DNA MODDING INTERFACE</h4>
             
             <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-3">
                  <label className="text-[10px] font-black text-slate-400 uppercase block">Base A-T</label>
                  <div className="relative group flex items-center gap-4 bg-white/5 p-3 rounded-xl border border-white/5 hover:border-white/10 transition-all cursor-pointer">
                    <input 
                      type="color" 
                      value={nucleotideColor1} 
                      onChange={(e) => setNucleotideColor1(e.target.value)}
                      className="absolute inset-0 opacity-0 cursor-pointer w-full h-full"
                    />
                    <div className="w-10 h-10 rounded-lg shadow-lg" style={{ backgroundColor: nucleotideColor1 }} />
                    <span className="text-[10px] font-mono font-bold text-white uppercase">{nucleotideColor1}</span>
                  </div>
                </div>
                <div className="space-y-3">
                  <label className="text-[10px] font-black text-slate-400 uppercase block">Base C-G</label>
                  <div className="relative group flex items-center gap-4 bg-white/5 p-3 rounded-xl border border-white/5 hover:border-white/10 transition-all cursor-pointer">
                    <input 
                      type="color" 
                      value={nucleotideColor2} 
                      onChange={(e) => setNucleotideColor2(e.target.value)}
                      className="absolute inset-0 opacity-0 cursor-pointer w-full h-full"
                    />
                    <div className="w-10 h-10 rounded-lg shadow-lg" style={{ backgroundColor: nucleotideColor2 }} />
                    <span className="text-[10px] font-mono font-bold text-white uppercase">{nucleotideColor2}</span>
                  </div>
                </div>
             </div>

             <div className="space-y-2 pt-4 border-t border-white/5">
                <div className="flex justify-between items-center mb-2">
                   <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Rotación de Hélice</label>
                   <span className="text-white font-bold text-xs">{rotation}°</span>
                </div>
                <input 
                  type="range" 
                  min="0" 
                  max="360" 
                  value={rotation} 
                  onChange={(e) => setRotation(parseInt(e.target.value))}
                  className="w-full accent-accent-primary"
                />
             </div>
           </div>

           <div className="p-6 bg-black/40 rounded-2xl border border-white/5">
              <p className="text-xs text-slate-400 font-medium italic leading-relaxed">
                "Diego, el ADN es el código fuente de la vida. Aprender a visualizarlo es el primer paso para la biotecnología."
              </p>
           </div>
        </div>

        <div className="relative aspect-square bg-slate-900/40 rounded-[3rem] border border-white/10 flex items-center justify-center overflow-hidden">
           {/* DNA Visualizer */}
           <svg viewBox="0 0 200 400" className="w-full h-full p-10 transition-transform duration-500" style={{ transform: `rotate(${rotation}deg)` }}>
              {Array.from({length: 12}).map((_, i) => {
                const y = 30 + (i * 30);
                const offset = Math.sin((i + Date.now() / 1000) * 0.8) * 40;
                return (
                  <g key={i}>
                    <line x1={100 - offset} y1={y} x2={100 + offset} y2={y} stroke="white" strokeWidth="1" strokeOpacity="0.2" />
                    <circle cx={100 - offset} cy={y} r="6" fill={i % 2 === 0 ? nucleotideColor1 : nucleotideColor2} />
                    <circle cx={100 + offset} cy={y} r="6" fill={i % 2 === 0 ? nucleotideColor2 : nucleotideColor1} />
                  </g>
                );
              })}
           </svg>

           <div className="absolute bottom-8 left-8 text-[10px] font-black text-white/40 uppercase tracking-[0.5em] rotate-90 origin-left">
              GENOME_SEQUENCER_v1.0
           </div>
        </div>
      </div>
    </div>
  );
};
