
import React, { useState, useEffect, useMemo } from 'react';

type AtomType = 'C' | 'H' | 'O' | 'N';

interface Atom {
  x: number;
  y: number;
  z: number;
  type: AtomType;
}

interface Bond {
  from: number;
  to: number;
}

interface MoleculeData {
  name: string;
  formula: string;
  atoms: Atom[];
  bonds: Bond[];
}

const ATOM_CONFIG = {
  C: { color: '#444444', radius: 18, label: 'C' },
  H: { color: '#ffffff', radius: 10, label: 'H' },
  O: { color: '#ef4444', radius: 15, label: 'O' },
  N: { color: '#3b82f6', radius: 16, label: 'N' },
};

const MOLECULES: Record<string, MoleculeData> = {
  h2o: {
    name: 'Agua',
    formula: 'H₂O',
    atoms: [
      { x: 0, y: 0, z: 0, type: 'O' },
      { x: 40, y: 40, z: 0, type: 'H' },
      { x: -40, y: 40, z: 0, type: 'H' },
    ],
    bonds: [{ from: 0, to: 1 }, { from: 0, to: 2 }]
  },
  co2: {
    name: 'Dióxido de Carbono',
    formula: 'CO₂',
    atoms: [
      { x: 0, y: 0, z: 0, type: 'C' },
      { x: 60, y: 0, z: 0, type: 'O' },
      { x: -60, y: 0, z: 0, type: 'O' },
    ],
    bonds: [{ from: 0, to: 1 }, { from: 0, to: 2 }]
  },
  ch4: {
    name: 'Metano',
    formula: 'CH₄',
    atoms: [
      { x: 0, y: 0, z: 0, type: 'C' },
      { x: 0, y: -60, z: 0, type: 'H' },
      { x: 50, y: 40, z: 40, type: 'H' },
      { x: -50, y: 40, z: 40, type: 'H' },
      { x: 0, y: 40, z: -60, type: 'H' },
    ],
    bonds: [{ from: 0, to: 1 }, { from: 0, to: 2 }, { from: 0, to: 3 }, { from: 0, to: 4 }]
  },
  caffeine: {
    name: 'Cafeína',
    formula: 'C₈H₁₀N₄O₂',
    atoms: [
      { x: 0, y: 0, z: 0, type: 'N' },
      { x: 40, y: 20, z: 0, type: 'C' },
      { x: 40, y: 60, z: 0, type: 'N' },
      { x: 0, y: 80, z: 0, type: 'C' },
      { x: -30, y: 40, z: 0, type: 'C' },
      { x: 70, y: 80, z: 20, type: 'C' },
      { x: -60, y: 80, z: -20, type: 'O' },
      { x: 0, y: -40, z: 30, type: 'H' },
      { x: 20, y: -40, z: -30, type: 'H' },
      { x: -20, y: -40, z: -30, type: 'H' },
    ],
    bonds: [
      { from: 0, to: 1 }, { from: 1, to: 2 }, { from: 2, to: 3 }, 
      { from: 3, to: 4 }, { from: 4, to: 0 }, { from: 2, to: 5 },
      { from: 3, to: 6 }
    ]
  }
};

export const MambaLab: React.FC<{ theme?: 'mamba' | 'pao' }> = ({ theme }) => {
  const [selectedKey, setSelectedKey] = useState('ch4');
  const [rotX, setRotX] = useState(0);
  const [rotY, setRotY] = useState(0);
  const [autoRotate, setAutoRotate] = useState(true);

  // Auto-rotation effect
  useEffect(() => {
    if (!autoRotate) return;
    const interval = setInterval(() => {
      setRotY(prev => (prev + 1) % 360);
      setRotX(prev => (prev + 0.5) % 360);
    }, 30);
    return () => clearInterval(interval);
  }, [autoRotate]);

  const molecule = MOLECULES[selectedKey];

  // Perspective Projection Logic
  const projectedAtoms = useMemo(() => {
    const radX = (rotX * Math.PI) / 180;
    const radY = (rotY * Math.PI) / 180;

    return molecule.atoms.map((atom, index) => {
      // Rotate Y
      let x = atom.x * Math.cos(radY) - atom.z * Math.sin(radY);
      let z = atom.x * Math.sin(radY) + atom.z * Math.cos(radY);
      
      // Rotate X
      let y = atom.y * Math.cos(radX) - z * Math.sin(radX);
      z = atom.y * Math.sin(radX) + z * Math.cos(radX);

      // Perspective Scale
      const perspective = 300 / (300 + z);
      return {
        id: index,
        px: x * perspective + 150,
        py: y * perspective + 150,
        pz: z,
        scale: perspective,
        type: atom.type
      };
    }).sort((a, b) => b.pz - a.pz); // Z-Sorting for correct rendering
  }, [molecule, rotX, rotY]);

  const projectedBonds = useMemo(() => {
    return molecule.bonds.map(bond => {
      const from = projectedAtoms.find(a => a.id === bond.from);
      const to = projectedAtoms.find(a => a.id === bond.to);
      return { from, to };
    });
  }, [projectedAtoms, molecule]);

  const accentColor = 'var(--accent-primary)';

  return (
    <div className="p-10 glass rounded-[3.5rem] border border-white/10 space-y-12 animate-in fade-in duration-1000 relative overflow-hidden">
      <div className="flex flex-col md:flex-row justify-between items-start gap-8 relative z-10">
        <div className="space-y-2">
          <h3 className="text-5xl font-black font-display text-white italic tracking-tighter uppercase">
            BMU <span className="mamba-text">Molecular 3D</span>
          </h3>
          <p className="text-slate-500 font-bold text-xs uppercase tracking-[0.4em]">Laboratorio de Química Nuclear v10.0</p>
        </div>
        
        <div className="flex bg-black/40 p-2 rounded-2xl border border-white/5 gap-2">
           {Object.keys(MOLECULES).map(key => (
             <button 
               key={key}
               onClick={() => setSelectedKey(key)}
               className={`px-4 py-2 rounded-xl text-[9px] font-black transition-all ${selectedKey === key ? 'accent-bg text-black' : 'text-slate-500 hover:text-white'}`}
             >
               {MOLECULES[key].formula}
             </button>
           ))}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
        {/* Controls Panel */}
        <div className="space-y-8 bg-white/[0.02] p-10 rounded-[3rem] border border-white/5 relative">
          <div className="space-y-6">
            <h4 className="text-2xl font-black text-white italic uppercase tracking-tighter">
              {molecule.name} <span className="accent-text opacity-60 ml-2">{molecule.formula}</span>
            </h4>
            
            <div className="grid grid-cols-2 gap-4">
              <div className="bg-black/30 p-4 rounded-2xl border border-white/5">
                 <span className="text-[9px] font-black text-slate-500 uppercase block mb-1">Átomos</span>
                 <span className="text-xl font-black text-white">{molecule.atoms.length} Nuclei</span>
              </div>
              <div className="bg-black/30 p-4 rounded-2xl border border-white/5">
                 <span className="text-[9px] font-black text-slate-500 uppercase block mb-1">Enlaces</span>
                 <span className="text-xl font-black text-white">{molecule.bonds.length} Energy Bonds</span>
              </div>
            </div>

            <div className="space-y-6 pt-6 border-t border-white/5">
               <div className="space-y-3">
                 <div className="flex justify-between text-[10px] font-black uppercase tracking-widest text-slate-400">
                    <span>Rotación Orbital X</span>
                    <span>{Math.round(rotX)}°</span>
                 </div>
                 <input 
                   type="range" min="0" max="360" value={rotX} 
                   onChange={(e) => { setRotX(parseInt(e.target.value)); setAutoRotate(false); }}
                   className="w-full accent-accent-primary"
                 />
               </div>
               <div className="space-y-3">
                 <div className="flex justify-between text-[10px] font-black uppercase tracking-widest text-slate-400">
                    <span>Rotación Orbital Y</span>
                    <span>{Math.round(rotY)}°</span>
                 </div>
                 <input 
                   type="range" min="0" max="360" value={rotY} 
                   onChange={(e) => { setRotY(parseInt(e.target.value)); setAutoRotate(false); }}
                   className="w-full accent-accent-primary"
                 />
               </div>
               
               <button 
                 onClick={() => setAutoRotate(!autoRotate)}
                 className={`w-full py-4 rounded-2xl text-[10px] font-black uppercase tracking-widest transition-all ${autoRotate ? 'bg-accent-primary/20 text-accent-primary border border-accent-primary/40' : 'bg-white/5 text-slate-400 border border-white/10'}`}
               >
                 {autoRotate ? 'DETENER ROTACIÓN AUTO' : 'ACTIVAR ROTACIÓN AUTO'}
               </button>
            </div>
          </div>
        </div>

        {/* 3D Visualizer Canvas */}
        <div className="relative aspect-square bg-slate-950/80 rounded-[4rem] border-2 border-white/5 overflow-hidden flex items-center justify-center group shadow-[0_0_100px_rgba(0,0,0,0.8)]">
           {/* Deep Space Background for the Lab */}
           <div className="absolute inset-0 opacity-10 pointer-events-none">
              <div className="absolute inset-0 grid grid-cols-10 grid-rows-10">
                {Array.from({length: 100}).map((_, i) => <div key={i} className="border-[0.5px] border-white/20" />)}
              </div>
           </div>

           <svg viewBox="0 0 300 300" className="w-full h-full p-10 drop-shadow-[0_0_30px_rgba(0,0,0,0.5)]">
              {/* Render Bonds First (behind atoms) */}
              <g className="bonds-layer">
                {projectedBonds.map((bond, i) => {
                  if (!bond.from || !bond.to) return null;
                  return (
                    <line 
                      key={i}
                      x1={bond.from.px} y1={bond.from.py}
                      x2={bond.to.px} y2={bond.to.py}
                      stroke="white"
                      strokeWidth={4 * ((bond.from.scale + bond.to.scale) / 2)}
                      strokeOpacity={0.15}
                      className="transition-all duration-75"
                    />
                  );
                })}
              </g>

              {/* Render Atoms Sorted by Z */}
              <g className="atoms-layer">
                {projectedAtoms.map((atom) => {
                  const config = ATOM_CONFIG[atom.type];
                  const radius = config.radius * atom.scale;
                  const isCarbon = atom.type === 'C';
                  
                  return (
                    <g key={atom.id} className="transition-all duration-75">
                      <circle 
                        cx={atom.px} cy={atom.py} r={radius} 
                        fill={isCarbon ? 'url(#carbonGrad)' : config.color}
                        filter={atom.pz < 0 ? 'none' : 'blur(1px)'}
                        className="shadow-2xl"
                      />
                      {/* Highlight Shine */}
                      <circle 
                        cx={atom.px - radius*0.3} cy={atom.py - radius*0.3} r={radius*0.2} 
                        fill="white" fillOpacity={0.3} 
                      />
                      <text 
                        x={atom.px} y={atom.py + 4} 
                        textAnchor="middle" 
                        fill={atom.type === 'H' ? 'black' : 'white'} 
                        className="font-black select-none pointer-events-none"
                        style={{ fontSize: `${10 * atom.scale}px` }}
                      >
                        {config.label}
                      </text>
                    </g>
                  );
                })}
              </g>

              {/* Gradient Definitions */}
              <defs>
                <radialGradient id="carbonGrad">
                  <stop offset="0%" stopColor="#666" />
                  <stop offset="100%" stopColor="#111" />
                </radialGradient>
              </defs>
           </svg>

           {/* Perspective HUD Overlay */}
           <div className="absolute top-8 left-8 flex flex-col items-start gap-1">
              <span className="text-[8px] font-black text-accent-primary animate-pulse tracking-[0.4em]">SCANNING_NUCLEUS...</span>
              <span className="text-[10px] text-white/20 font-mono">Z_COORD_LOCK: {selectedKey.toUpperCase()}</span>
           </div>

           <div className="absolute bottom-10 right-10 flex gap-4">
              <div className="flex flex-col items-end">
                <span className="text-[8px] font-black text-slate-600 uppercase">Proporción</span>
                <span className="text-xs font-black text-white italic">ESCALA_REAL_v10</span>
              </div>
              <div className="w-10 h-10 accent-bg rounded-full flex items-center justify-center animate-spin-slow">
                 <span className="text-black text-xl">☢️</span>
              </div>
           </div>
        </div>
      </div>

      <style>{`
        @keyframes spin-slow {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
        .animate-spin-slow {
          animation: spin-slow 8s linear infinite;
        }
      `}</style>
    </div>
  );
};
