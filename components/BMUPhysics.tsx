
import React, { useState, useEffect } from 'react';

export const BMUPhysics: React.FC<{ theme?: 'mamba' | 'pao' }> = ({ theme }) => {
  const [mass, setMass] = useState(10); // kg
  const [gravity, setGravity] = useState(9.8); // m/s^2
  const [height, setHeight] = useState(100); // m
  const [objectColor, setObjectColor] = useState('#ffffff');
  const [isSimulating, setIsSimulating] = useState(false);
  const [currentY, setCurrentY] = useState(100);
  const [velocity, setVelocity] = useState(0);

  const potentialEnergy = (mass * gravity * height).toFixed(0);
  const kineticEnergy = (0.5 * mass * Math.pow(velocity, 2)).toFixed(0);

  useEffect(() => {
    let timer: any;
    if (isSimulating && currentY > 0) {
      timer = setInterval(() => {
        setCurrentY(prev => {
          const nextY = prev - (velocity / 10);
          if (nextY <= 0) {
            setIsSimulating(false);
            return 0;
          }
          return nextY;
        });
        setVelocity(v => v + (gravity / 10));
      }, 50);
    } else if (!isSimulating) {
      setCurrentY(height);
      setVelocity(0);
    }
    return () => clearInterval(timer);
  }, [isSimulating, gravity, velocity, height, currentY]);

  const accentColor = theme === 'mamba' ? 'accent-lime-500' : 'accent-pink-500';
  const mambaText = theme === 'mamba' ? 'mamba-text' : 'text-pink-400';

  return (
    <div className="p-10 glass rounded-[3rem] border border-white/10 space-y-12 animate-in fade-in duration-1000">
      <div className="flex justify-between items-center">
        <div>
          <h3 className="text-4xl font-black font-display text-white italic uppercase tracking-tighter">BMU Physics <span className={mambaText}>Lab</span></h3>
          <p className="text-slate-500 font-bold text-xs uppercase tracking-[0.4em]">Cinemática y Dinámica de Partículas</p>
        </div>
        <button 
          onClick={() => setIsSimulating(!isSimulating)}
          className={`px-10 py-4 rounded-2xl font-black text-xs tracking-widest transition-all ${isSimulating ? 'bg-red-500 text-white' : 'bg-white text-black hover:scale-105'}`}
        >
          {isSimulating ? 'DETENER SCAN' : 'INICIAR SIMULACIÓN'}
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
        <div className="space-y-8 bg-white/[0.02] p-8 rounded-[2.5rem] border border-white/5">
           <div className="space-y-6">
             <div className="space-y-2">
               <div className="flex justify-between text-[10px] font-black text-slate-400 uppercase italic">
                 <span>Masa del Objeto (kg)</span>
                 <span className="text-white">{mass} kg</span>
               </div>
               <input type="range" min="1" max="100" value={mass} onChange={e => setMass(parseInt(e.target.value))} className={`w-full ${accentColor}`} />
             </div>
             
             <div className="space-y-2">
               <div className="flex justify-between text-[10px] font-black text-slate-400 uppercase italic">
                 <span>Gravedad Planetaria (m/s²)</span>
                 <span className="text-white">{gravity} m/s²</span>
               </div>
               <input type="range" min="1" max="30" step="0.1" value={gravity} onChange={e => setGravity(parseFloat(e.target.value))} className={`w-full ${accentColor}`} />
               <div className="flex gap-2 mt-2">
                 <button onClick={() => setGravity(9.8)} className="text-[8px] bg-white/5 px-2 py-1 rounded-md text-slate-500 hover:text-white">TIERRA</button>
                 <button onClick={() => setGravity(1.6)} className="text-[8px] bg-white/5 px-2 py-1 rounded-md text-slate-500 hover:text-white">LUNA</button>
                 <button onClick={() => setGravity(24.8)} className="text-[8px] bg-white/5 px-2 py-1 rounded-md text-slate-500 hover:text-white">JÚPITER</button>
               </div>
             </div>

             <div className="space-y-2">
               <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Mod: Color del Objeto</label>
               <input 
                 type="color" 
                 value={objectColor} 
                 onChange={(e) => setObjectColor(e.target.value)}
                 className="w-full h-10 bg-transparent cursor-pointer rounded-lg border border-white/10"
               />
             </div>
           </div>

           <div className="grid grid-cols-2 gap-4 pt-6 border-t border-white/5">
              <div className="text-center">
                <p className="text-[9px] font-black text-slate-500 uppercase mb-1">E. Potencial (J)</p>
                <p className={`text-3xl font-black ${mambaText}`}>{potentialEnergy}</p>
              </div>
              <div className="text-center">
                <p className="text-[9px] font-black text-slate-500 uppercase mb-1">E. Cinética (J)</p>
                <p className="text-3xl font-black text-white">{kineticEnergy}</p>
              </div>
           </div>
        </div>

        <div className="relative aspect-square bg-slate-900/40 rounded-[3rem] border border-white/10 flex items-center justify-center overflow-hidden">
           {/* Visualizer Grid */}
           <div className="absolute inset-0 grid grid-cols-10 opacity-5">
             {Array.from({length: 10}).map((_, i) => <div key={i} className="border-r border-white" />)}
           </div>

           {/* Falling Object */}
           <div 
             className="absolute w-16 h-16 rounded-2xl flex items-center justify-center shadow-[0_0_40px_rgba(255,255,255,0.3)] transition-all duration-75"
             style={{ 
               bottom: `${(currentY / 200) * 100}%`,
               transform: `rotate(${velocity * 2}deg)`,
               backgroundColor: objectColor
             }}
           >
             <span className="text-2xl font-black text-black">M</span>
             {/* Vector Arrow */}
             <div className="absolute top-full left-1/2 -translate-x-1/2 w-[2px] bg-red-500" style={{ height: `${velocity * 2}px` }}>
                <div className="absolute bottom-0 left-1/2 -translate-x-1/2 border-l-4 border-r-4 border-t-8 border-l-transparent border-r-transparent border-t-red-500"></div>
             </div>
           </div>

           {/* Floor */}
           <div className="absolute bottom-0 w-full h-4 mamba-gradient opacity-30"></div>

           <div className="absolute top-8 right-8 text-right space-y-1">
              <p className="text-[10px] font-black text-white uppercase tracking-widest italic">Live Data</p>
              <p className="text-xs font-bold text-slate-500">H: {currentY.toFixed(1)}m</p>
              <p className="text-xs font-bold text-slate-500">V: {velocity.toFixed(1)}m/s</p>
           </div>
        </div>
      </div>
    </div>
  );
};
