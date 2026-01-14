
import React, { useState } from 'react';

export const WeightMaster: React.FC = () => {
  const [weightGrams, setWeightGrams] = useState(500);
  const MAX_WEIGHT = 2000; 

  const kgValue = (weightGrams / 1000).toFixed(2);
  
  const getFraction = (g: number) => {
    const commonFractions: { [key: number]: string } = {
      125: "1/8",
      250: "1/4",
      375: "3/8",
      500: "1/2",
      625: "5/8",
      750: "3/4",
      875: "7/8",
      1000: "1",
      1250: "1 1/4",
      1500: "1 1/2",
      1750: "1 3/4",
      2000: "2"
    };
    return commonFractions[g] || null;
  };

  const fraction = getFraction(weightGrams);

  return (
    <div className="p-10 glass rounded-[3rem] space-y-12 border border-emerald-500/20 shadow-2xl relative overflow-hidden">
      <div className="absolute top-0 right-0 w-64 h-64 bg-emerald-500/5 blur-[120px] rounded-full pointer-events-none"></div>
      
      <div className="space-y-4">
        <h3 className="text-4xl font-black font-display text-white italic uppercase tracking-tighter">
          Conversión de <span className="mamba-text">Peso y Masa</span>
        </h3>
        <p className="text-slate-500 font-bold text-[10px] uppercase tracking-[0.4em]">Iyari: Domina la báscula con fracciones avanzadas</p>
      </div>

      <div className="flex flex-col items-center gap-12">
        {/* Visual Scale Indicator */}
        <div className="w-full flex justify-between px-2 text-[10px] font-black text-slate-600 uppercase tracking-widest">
           <span>0kg</span>
           <span>0.5kg</span>
           <span>1.0kg</span>
           <span>1.5kg</span>
           <span>2.0kg</span>
        </div>
        <div className="relative w-full bg-slate-900 h-10 rounded-2xl overflow-hidden border border-white/5 shadow-inner p-1">
           <div 
             className="h-full bg-emerald-500 rounded-xl transition-all duration-700 ease-out flex items-center justify-end px-4 shadow-[0_0_30px_rgba(16,185,129,0.3)]"
             style={{ width: `${(weightGrams / MAX_WEIGHT) * 100}%` }}
           >
             <div className="w-1 h-6 bg-white/40 rounded-full"></div>
           </div>
        </div>

        <input 
          type="range" min="0" max={MAX_WEIGHT} step="25" value={weightGrams} 
          onChange={(e) => setWeightGrams(parseInt(e.target.value))}
          className="w-full h-4 bg-slate-800 rounded-full appearance-none cursor-pointer accent-emerald-500 shadow-xl"
        />

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 w-full">
          <div className="bg-white/[0.03] p-10 rounded-[2.5rem] border border-white/5 text-center group hover:scale-105 transition-all">
            <span className="block text-[10px] uppercase tracking-[0.3em] text-emerald-400 mb-4 font-black">GRAMOS (g)</span>
            <span className="text-6xl font-black text-white group-hover:mamba-text transition-all">{weightGrams}</span>
          </div>
          
          <div className="bg-white/[0.03] p-10 rounded-[2.5rem] border border-white/5 text-center group hover:scale-105 transition-all">
            <span className="block text-[10px] uppercase tracking-[0.3em] text-teal-400 mb-4 font-black">KILOS (kg)</span>
            <span className="text-6xl font-black text-white group-hover:mamba-text transition-all">{kgValue}</span>
          </div>

          <div className="bg-white/[0.03] p-10 rounded-[2.5rem] border border-white/5 text-center flex flex-col items-center justify-center group hover:scale-105 transition-all relative overflow-hidden">
            <div className="absolute inset-0 bg-indigo-500/5 opacity-0 group-hover:opacity-100 transition-opacity"></div>
            <span className="block text-[10px] uppercase tracking-[0.3em] text-indigo-400 mb-4 font-black relative z-10">FRACCIÓN DE kg</span>
            {fraction ? (
              <span className="text-6xl font-black text-white relative z-10 mamba-text">{fraction}</span>
            ) : (
              <div className="relative z-10 text-center">
                <span className="text-4xl font-black text-slate-500 leading-none">?</span>
                <p className="text-[10px] text-slate-600 font-bold mt-1">Busca un múltiplo de 125g</p>
              </div>
            )}
          </div>
        </div>

        <div className="w-full p-8 bg-emerald-500/5 rounded-[2rem] border border-emerald-500/10 flex items-center gap-6">
          <div className="text-4xl">🧬</div>
          <p className="text-sm text-emerald-200/80 font-medium leading-relaxed italic">
            <strong>Hack de Iyari:</strong> ¿Sabías que <span className="text-emerald-400 font-black">500g es exactamente 1/2kg</span>? 
            Es la base para entender proporciones en química y física. Si necesitas 250g para un experimento, estás pidiendo un cuarto (1/4) de kilo.
          </p>
        </div>
      </div>
    </div>
  );
};
