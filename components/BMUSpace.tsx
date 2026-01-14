
import React, { useState, useEffect } from 'react';

export const BMUSpace: React.FC<{ theme?: 'mamba' | 'pao' }> = ({ theme }) => {
  const [orbitSpeed, setOrbitSpeed] = useState(1);
  const [sunColor, setSunColor] = useState('#fbbf24');
  const [planetType, setPlanetType] = useState<'earth' | 'mars' | 'saturn' | 'mamba'>('earth');
  const [customColor, setCustomColor] = useState('#3b82f6');
  const [distance, setDistance] = useState(120);
  
  const mambaText = theme === 'mamba' ? 'mamba-text' : 'text-pink-400';

  const planetData = {
    earth: { name: 'Terra BMU', color: '#3b82f6', atmosphere: 'rgba(59, 130, 246, 0.4)' },
    mars: { name: 'Ares Protocol', color: '#ef4444', atmosphere: 'rgba(239, 68, 68, 0.4)' },
    saturn: { name: 'Cronos Rings', color: '#f59e0b', atmosphere: 'rgba(245, 158, 11, 0.2)' },
    mamba: { name: 'Mamba Prime', color: '#a3e635', atmosphere: 'rgba(163, 230, 53, 0.4)' }
  };

  return (
    <div className="p-10 glass rounded-[3rem] border border-white/10 space-y-12 animate-in fade-in zoom-in duration-1000 relative overflow-hidden">
      {/* Background stars animation */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="stars-container"></div>
      </div>

      <div className="flex flex-col xl:flex-row justify-between items-start gap-10 relative z-10">
        <div className="w-full xl:w-1/3 space-y-8">
          <div>
            <h3 className="text-5xl font-black font-display text-white italic uppercase tracking-tighter leading-tight">
              BMU <span className={mambaText}>Space</span> Engine
            </h3>
            <p className="text-slate-500 font-bold text-xs uppercase tracking-[0.4em] mt-2">Simulación Astrofísica de Alta Fidelidad</p>
          </div>

          <div className="bg-black/60 backdrop-blur-xl p-8 rounded-[2.5rem] border border-white/10 space-y-8 shadow-2xl">
            <h4 className="text-[10px] font-black text-accent-primary uppercase tracking-[0.3em] border-b border-white/5 pb-4">MODIFICADOR DE MATERIA</h4>
            
            <div className="grid grid-cols-2 gap-4">
               {Object.entries(planetData).map(([key, data]) => (
                 <button 
                  key={key}
                  onClick={() => { setPlanetType(key as any); setCustomColor(data.color); }}
                  className={`py-3 rounded-xl text-[9px] font-black uppercase tracking-widest transition-all border ${planetType === key ? 'bg-white text-black border-white' : 'bg-white/5 text-slate-400 border-white/5 hover:border-white/20'}`}
                 >
                   {data.name}
                 </button>
               ))}
            </div>

            <div className="space-y-6">
              <div className="space-y-3">
                <label className="text-[10px] font-black text-slate-400 uppercase block">Firma de Color del Planeta</label>
                <div className="flex items-center gap-4 bg-white/5 p-4 rounded-2xl border border-white/5 hover:border-accent-primary/30 transition-all group relative">
                  <input 
                    type="color" 
                    value={customColor} 
                    onChange={(e) => setCustomColor(e.target.value)}
                    className="absolute inset-0 opacity-0 cursor-pointer w-full h-full"
                  />
                  <div className="w-12 h-12 rounded-xl shadow-inner border border-white/10" style={{ backgroundColor: customColor }} />
                  <div>
                    <span className="text-xs font-mono font-bold text-white uppercase block">{customColor}</span>
                    <span className="text-[9px] font-black text-slate-500 uppercase">Click para editar</span>
                  </div>
                </div>
              </div>

              <div className="space-y-3">
                <label className="text-[10px] font-black text-slate-400 uppercase block">Temperatura Solar</label>
                <div className="flex items-center gap-4 bg-white/5 p-4 rounded-2xl border border-white/5 hover:border-yellow-500/30 transition-all group relative">
                  <input 
                    type="color" 
                    value={sunColor} 
                    onChange={(e) => setSunColor(e.target.value)}
                    className="absolute inset-0 opacity-0 cursor-pointer w-full h-full"
                  />
                  <div className="w-12 h-12 rounded-xl shadow-inner border border-white/10" style={{ backgroundColor: sunColor }} />
                  <div>
                    <span className="text-xs font-mono font-bold text-white uppercase block">{sunColor}</span>
                    <span className="text-[9px] font-black text-slate-500 uppercase">Editar Estrella</span>
                  </div>
                </div>
              </div>
            </div>

            <div className="space-y-4 pt-4 border-t border-white/5">
                <div className="space-y-2">
                  <div className="flex justify-between text-[10px] font-black text-slate-500 uppercase italic">
                    <span>Compresión Temporal</span>
                    <span className="text-white">{orbitSpeed}x</span>
                  </div>
                  <input type="range" min="0" max="10" step="0.1" value={orbitSpeed} onChange={(e) => setOrbitSpeed(parseFloat(e.target.value))} className="w-full accent-accent-primary" />
                </div>
                <div className="space-y-2">
                  <div className="flex justify-between text-[10px] font-black text-slate-500 uppercase italic">
                    <span>Unidad Astronómica (AU)</span>
                    <span className="text-white">{distance}</span>
                  </div>
                  <input type="range" min="60" max="180" value={distance} onChange={(e) => setDistance(parseInt(e.target.value))} className="w-full accent-accent-primary" />
                </div>
            </div>
          </div>
        </div>

        <div className="flex-1 w-full aspect-square xl:aspect-auto xl:h-[700px] bg-slate-950 rounded-[4rem] border border-white/10 relative overflow-hidden flex items-center justify-center perspective-[1500px]">
           {/* Deep Space Gradients */}
           <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_rgba(30,58,138,0.1)_0%,_transparent_70%)]"></div>
           
           {/* SUN - The focal point */}
           <div 
             className="w-32 h-32 rounded-full z-10 transition-all duration-1000 relative"
             style={{ 
               backgroundColor: sunColor,
               boxShadow: `0 0 100px ${sunColor}88, 0 0 200px ${sunColor}44, inset -10px -10px 40px rgba(0,0,0,0.5)`
             }}
           >
              {/* Sun Flare */}
              <div className="absolute inset-[-40%] bg-white/10 rounded-full blur-3xl animate-pulse"></div>
           </div>

           {/* Orbit Ring */}
           <div 
             className="absolute border border-white/5 rounded-full" 
             style={{ width: distance * 2.5, height: distance * 2.5, transform: 'rotateX(75deg)' }}
           ></div>

           {/* PLANET CONTAINER - This handles the orbital rotation */}
           <div 
             className="absolute"
             style={{
               width: distance * 2.5,
               height: distance * 2.5,
               animation: `orbital-spin ${20 / (orbitSpeed || 0.001)}s linear infinite`,
               transformStyle: 'preserve-3d'
             }}
           >
              {/* THE PLANET ITSELF */}
              <div 
                className="absolute left-1/2 -translate-x-1/2 top-0 flex items-center justify-center transition-all duration-700"
                style={{ transform: 'rotateX(-75deg)' }} // Counters the orbit tilt to keep planet upright
              >
                <div 
                  className="w-20 h-20 rounded-full relative shadow-2xl group transition-transform duration-500"
                  style={{ 
                    background: `radial-gradient(circle at 30% 30%, ${customColor} 0%, #000 100%)`,
                    boxShadow: `0 0 40px ${customColor}55, inset -5px -5px 20px rgba(0,0,0,0.8)`
                  }}
                >
                  {/* Atmosphere Layer */}
                  <div 
                    className="absolute inset-[-5%] rounded-full blur-md opacity-40 border border-white/20"
                    style={{ backgroundColor: customColor }}
                  ></div>

                  {/* Planet Specific Visuals */}
                  {planetType === 'earth' && (
                    <div className="absolute inset-0 opacity-30 bg-[url('https://www.transparenttextures.com/patterns/natural-paper.png')] rounded-full mix-blend-overlay animate-pulse"></div>
                  )}

                  {planetType === 'saturn' && (
                    <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-[220%] h-[40%] border-[15px] border-white/20 rounded-[100%] rotate-[15deg] shadow-inner pointer-events-none">
                      <div className="absolute inset-0 border-[2px] border-white/10 rounded-[100%]"></div>
                    </div>
                  )}

                  {planetType === 'mamba' && (
                    <div className="absolute inset-0 flex items-center justify-center opacity-20">
                      <span className="text-2xl">🐍</span>
                    </div>
                  )}
                  
                  {/* Shadow side overlay */}
                  <div className="absolute inset-0 rounded-full bg-gradient-to-r from-transparent via-transparent to-black/80"></div>
                </div>

                <div className="absolute -bottom-10 whitespace-nowrap bg-black/80 px-4 py-1 rounded-full border border-white/10">
                   <span className="text-[9px] font-black text-white uppercase tracking-tighter">{planetData[planetType].name}</span>
                </div>
              </div>
           </div>

           {/* Cockpit HUD Elements */}
           <div className="absolute top-10 right-10 text-right font-mono">
              <p className="text-[10px] font-black text-accent-primary animate-pulse">SCANNING_SPACE_COORDINATES...</p>
              <p className="text-[12px] text-white/40">AU_DIST: {distance.toFixed(2)}</p>
              <p className="text-[12px] text-white/40">ORBIT_VEL: {(orbitSpeed * 107000).toLocaleString()} KM/H</p>
           </div>
           
           <div className="absolute bottom-10 left-10 flex gap-4">
              <div className="w-16 h-1 bg-white/10 rounded-full overflow-hidden">
                <div className="h-full bg-accent-primary animate-loading-bar"></div>
              </div>
              <span className="text-[8px] font-black text-slate-500 uppercase tracking-widest">Quantum Link: Established</span>
           </div>
        </div>
      </div>

      <style>{`
        @keyframes orbital-spin {
          from { transform: rotateX(75deg) rotateZ(0deg); }
          to { transform: rotateX(75deg) rotateZ(360deg); }
        }
        @keyframes loading-bar {
          0% { width: 0%; }
          50% { width: 100%; }
          100% { width: 0%; }
        }
        .stars-container {
          position: absolute;
          width: 100%;
          height: 100%;
          background: radial-gradient(1px 1px at 25px 50px, #fff, transparent),
                      radial-gradient(1px 1px at 50px 100px, #fff, transparent),
                      radial-gradient(1px 1px at 150px 200px, #fff, transparent),
                      radial-gradient(1.5px 1.5px at 300px 400px, #fff, transparent);
          background-size: 550px 550px;
          opacity: 0.1;
        }
      `}</style>
    </div>
  );
};
