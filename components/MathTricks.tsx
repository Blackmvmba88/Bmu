
import React, { useState, useEffect } from 'react';
import { getMathTricks } from '../services/geminiService';
import { MathTrick } from '../types';

export const MathTricks: React.FC = () => {
  const [tricks, setTricks] = useState<MathTrick[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchTricks = async () => {
      const data = await getMathTricks();
      setTricks(data);
      setLoading(false);
    };
    fetchTricks();
  }, []);

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center py-20 space-y-4">
        <div className="w-12 h-12 border-4 border-lime-500/20 border-t-lime-500 rounded-full animate-spin"></div>
        <p className="text-slate-500 font-bold uppercase tracking-widest text-xs">Cargando Tácticas Mamba...</p>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <div className="flex items-center gap-4 mb-8">
         <span className="text-4xl">⚡</span>
         <h3 className="text-3xl font-black font-display text-white italic">TRUCOS DE ÉLITE</h3>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {tricks.map((trick, index) => (
          <div 
            key={index} 
            className="glass p-8 rounded-[2rem] border border-white/5 hover:border-lime-500/30 transition-all group relative overflow-hidden"
          >
            <div className="absolute -right-4 -top-4 text-8xl font-black text-white/[0.02] group-hover:text-lime-500/[0.05] transition-colors pointer-events-none">
              {index + 1}
            </div>
            
            <h4 className="text-xl font-black text-lime-400 mb-3 uppercase tracking-tight group-hover:translate-x-1 transition-transform">
              {trick.title}
            </h4>
            
            <p className="text-slate-400 mb-6 leading-relaxed font-medium">
              {trick.description}
            </p>

            <div className="bg-white/5 p-4 rounded-2xl border border-white/5 space-y-2">
              <span className="text-[10px] font-black text-slate-500 uppercase tracking-widest">En acción:</span>
              <p className="text-lg font-mono text-white font-bold">{trick.example}</p>
            </div>

            <div className="mt-4 pt-4 border-t border-white/5 flex items-center gap-2 text-xs font-bold text-lime-500/60 italic">
               <span className="w-2 h-2 rounded-full bg-lime-500 animate-pulse"></span>
               {trick.visualHint}
            </div>
          </div>
        ))}
      </div>

      <div className="p-8 bg-lime-500 rounded-[2.5rem] flex flex-col md:flex-row items-center justify-between gap-6 shadow-2xl shadow-lime-500/20">
         <div className="space-y-1">
            <h4 className="text-black text-2xl font-black font-display leading-none italic uppercase">¿Quieres más hacks?</h4>
            <p className="text-black/70 font-bold text-sm">Pregúntale directamente a BlackMamba en la pestaña de Tutor.</p>
         </div>
         <button className="px-8 py-4 bg-black text-lime-500 font-black rounded-2xl hover:scale-105 transition-transform uppercase tracking-widest text-xs">
            Ir al Tutor
         </button>
      </div>
    </div>
  );
};
