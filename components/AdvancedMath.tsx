
import React, { useState } from 'react';

export const AdvancedMath: React.FC<{ theme?: 'mamba' | 'pao' }> = ({ theme }) => {
  const [xValue, setXValue] = useState(50);
  const [coefficient, setCoefficient] = useState(1);
  const [lineColor, setLineColor] = useState(theme === 'mamba' ? '#a3e635' : '#ec4899');

  // Ajuste de escala para el SVG de 200x200
  // La base es el centro (100, 100)
  const result = (coefficient * (xValue - 50) / 2) + 50; 
  
  const accent = theme === 'mamba' ? 'text-lime-400' : 'text-pink-400';
  const accentBg = theme === 'mamba' ? 'bg-lime-500' : 'bg-pink-500';

  // Cálculo de puntos para la línea: y = mx + b
  // Queremos que pase por el centro si x=50, b=100
  const y1 = 100 - (coefficient * 50);
  const y2 = 100 + (coefficient * 50);

  return (
    <div className="p-8 glass rounded-[2.5rem] border border-white/10 space-y-12 animate-in slide-in-from-right duration-700">
      <div className="text-center space-y-2">
        <h3 className="text-4xl font-black font-display text-white italic uppercase tracking-tighter">
          Explorador <span className="mamba-text">Funcional</span>
        </h3>
        <p className="text-slate-500 font-bold text-[10px] uppercase tracking-[0.3em]">Geometría Analítica de Precisión</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
        <div className="space-y-8">
          <div className="p-8 bg-black/40 border border-white/5 rounded-3xl text-center space-y-4 shadow-inner relative overflow-hidden group">
             <div className="absolute inset-0 bg-white/[0.02] opacity-0 group-hover:opacity-100 transition-opacity"></div>
             <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest relative z-10">Ecuación en Tiempo Real</p>
             <div className="text-5xl font-black text-white flex items-center justify-center gap-2 relative z-10">
                <span className="opacity-40 italic">f(x) = </span>
                <span style={{ color: lineColor }} className="transition-colors duration-500">{coefficient}</span>
                <span className="italic">x</span>
             </div>
          </div>

          <div className="space-y-8 bg-white/[0.02] p-8 rounded-[2rem] border border-white/5">
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Pendiente (m = {coefficient})</label>
                <div className={`w-2 h-2 rounded-full animate-pulse ${accentBg}`}></div>
              </div>
              <input 
                type="range" min="-5" max="5" step="0.1" value={coefficient}
                onChange={(e) => setCoefficient(parseFloat(e.target.value))}
                className={`w-full h-2 rounded-full appearance-none cursor-pointer accent-current ${accent} transition-all`}
              />
            </div>
            
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Input de Iyari (x = {xValue})</label>
                <span className="text-white font-mono text-xs">{xValue}u</span>
              </div>
              <input 
                type="range" min="0" max="100" value={xValue}
                onChange={(e) => setXValue(parseInt(e.target.value))}
                className={`w-full h-2 rounded-full appearance-none cursor-pointer accent-current ${accent} transition-all`}
              />
            </div>

            <div className="flex items-center gap-6 pt-4 border-t border-white/5">
               <div className="flex-1 space-y-2">
                 <label className="text-[9px] font-black text-slate-500 uppercase tracking-[0.2em]">Cromatismo de Función</label>
                 <input 
                   type="color" 
                   value={lineColor} 
                   onChange={(e) => setLineColor(e.target.value)}
                   className="w-full h-8 bg-transparent cursor-pointer rounded-lg border border-white/10"
                 />
               </div>
               <div className={`p-4 rounded-2xl border border-white/5 text-center flex-1 transition-all ${accentBg} text-black font-black shadow-lg`}>
                  <span className="text-[8px] uppercase opacity-60 block">Output y</span>
                  <p className="text-2xl leading-none">{result.toFixed(1)}</p>
               </div>
            </div>
          </div>
        </div>

        <div className="relative aspect-square bg-slate-950 rounded-[4rem] border-2 border-white/5 overflow-hidden flex items-center justify-center group shadow-[0_0_80px_rgba(0,0,0,0.5)]">
           {/* Grid de Coordenadas Cyberpunk */}
           <div className="absolute inset-0 opacity-[0.03] pointer-events-none">
             <div className="absolute inset-0 grid grid-cols-20 grid-rows-20">
               {Array.from({length: 400}).map((_, i) => <div key={i} className="border-[0.5px] border-white" />)}
             </div>
           </div>
           
           {/* Ejes Principales */}
           <div className="absolute w-full h-[1px] bg-white/10" />
           <div className="absolute h-full w-[1px] bg-white/10" />
           
           {/* SVG de la Función */}
           <svg viewBox="0 0 200 200" className="w-full h-full transform scale-y-[-1] overflow-visible">
              <defs>
                <filter id="glow">
                  <feGaussianBlur stdDeviation="2.5" result="coloredBlur"/>
                  <feMerge>
                    <feMergeNode in="coloredBlur"/>
                    <feMergeNode in="SourceGraphic"/>
                  </feMerge>
                </filter>
              </defs>

              {/* Línea de la Función con transición suave */}
              <line 
                x1="0" y1={y1} 
                x2="200" y2={y2} 
                stroke={lineColor} 
                strokeWidth="3"
                strokeLinecap="round"
                filter="url(#glow)"
                style={{ 
                  transition: 'y1 0.7s cubic-bezier(0.34, 1.56, 0.64, 1), y2 0.7s cubic-bezier(0.34, 1.56, 0.64, 1), stroke 0.5s ease' 
                }}
              />

              {/* Punto de Evaluación con efecto de resplandor */}
              <circle 
                cx={xValue * 2} 
                cy={y1 + (coefficient * xValue * 2)} 
                r="6" 
                fill="white" 
                filter="url(#glow)"
                style={{ 
                  transition: 'cx 0.6s cubic-bezier(0.25, 1, 0.5, 1), cy 0.6s cubic-bezier(0.25, 1, 0.5, 1)' 
                }}
              />
              
              {/* Resplandor del punto */}
              <circle 
                cx={xValue * 2} 
                cy={y1 + (coefficient * xValue * 2)} 
                r="12" 
                fill={lineColor}
                fillOpacity="0.2"
                style={{ 
                  transition: 'cx 0.6s cubic-bezier(0.25, 1, 0.5, 1), cy 0.6s cubic-bezier(0.25, 1, 0.5, 1), fill 0.5s ease' 
                }}
              />
           </svg>
           
           {/* HUD de Coordenadas */}
           <div className="absolute top-8 left-8 flex flex-col items-start gap-1 p-4 bg-black/40 backdrop-blur-xl rounded-2xl border border-white/5 pointer-events-none">
              <span className="text-[8px] font-black text-accent-primary uppercase tracking-[0.4em] animate-pulse">Analizador_Activo</span>
              <div className="flex gap-4 mt-1">
                <div className="flex flex-col">
                  <span className="text-[7px] text-slate-500 font-bold uppercase">X_VAL</span>
                  <span className="text-xs font-black text-white">{xValue.toFixed(1)}</span>
                </div>
                <div className="flex flex-col">
                  <span className="text-[7px] text-slate-500 font-bold uppercase">Y_VAL</span>
                  <span className="text-xs font-black text-white">{result.toFixed(1)}</span>
                </div>
              </div>
           </div>

           <div className="absolute bottom-8 right-8 flex items-center gap-3 p-4 bg-black/40 backdrop-blur-xl rounded-2xl border border-white/5">
              <div className="text-right">
                <p className="text-[8px] font-black text-slate-500 uppercase tracking-widest">Pendiente</p>
                <p className="text-xs font-black text-white italic">m = {coefficient.toFixed(2)}</p>
              </div>
              <div className="w-8 h-8 rounded-full border border-white/10 flex items-center justify-center text-[10px] animate-spin-slow">
                 ⚙️
              </div>
           </div>
        </div>
      </div>
    </div>
  );
};
