
import React, { useState } from 'react';
import { MasteryNode } from '../types';

const INITIAL_NODES: MasteryNode[] = [
  { id: '1', label: 'FRACCIONES', category: 'Matemáticas', level: 85, status: 'learning', icon: '🍰', coordinates: { x: 150, y: 100 } },
  { id: '2', label: 'PESO Y MASA', category: 'Matemáticas', level: 100, status: 'mastered', icon: '⚖️', coordinates: { x: 250, y: 150 } },
  { id: '3', label: '3D MOLECULAR', category: 'Química', level: 45, status: 'learning', icon: '☢️', coordinates: { x: 150, y: 250 } },
  { id: '4', label: 'GRAVEDAD', category: 'Física', level: 20, status: 'learning', icon: '🌍', coordinates: { x: 50, y: 150 } },
  { id: '5', label: 'ÁLGEBRA I', category: 'Matemáticas', level: 0, status: 'locked', icon: '📉', coordinates: { x: 250, y: 250 } },
  { id: '6', label: 'ESTEQUIOMETRÍA', category: 'Química', level: 0, status: 'locked', icon: '🧪', coordinates: { x: 50, y: 250 } },
];

export const MasteryMap: React.FC = () => {
  const [selectedNode, setSelectedNode] = useState<MasteryNode | null>(INITIAL_NODES[0]);

  const renderHex = (node: MasteryNode) => {
    const isMaster = node.status === 'mastered';
    const isLocked = node.status === 'locked';
    const color = isLocked ? '#1e293b' : isMaster ? 'var(--accent-highlight)' : 'var(--accent-primary)';
    
    return (
      <g 
        key={node.id} 
        className="cursor-pointer group transition-all duration-500"
        onClick={() => setSelectedNode(node)}
        style={{ transform: `translate(${node.coordinates.x}px, ${node.coordinates.y}px)` }}
      >
        {/* Hexagon Shadow/Glow */}
        <path 
          d="M0,-30 L26,-15 L26,15 L0,30 L-26,15 L-26,-15 Z" 
          fill={color} 
          fillOpacity={selectedNode?.id === node.id ? 0.3 : 0.1}
          className="group-hover:fill-opacity-40 transition-all"
        />
        {/* Hexagon Border */}
        <path 
          d="M0,-30 L26,-15 L26,15 L0,30 L-26,15 L-26,-15 Z" 
          fill="none" 
          stroke={color} 
          strokeWidth="2" 
          strokeDasharray={isLocked ? "4 2" : "0"}
          className={`${!isLocked ? 'animate-pulse' : ''}`}
        />
        {/* Icon & Level */}
        <text y="-5" textAnchor="middle" className="text-xl select-none">{node.icon}</text>
        {!isLocked && (
          <text y="15" textAnchor="middle" className="text-[7px] font-black fill-white opacity-60 uppercase tracking-widest">
            {node.level}%
          </text>
        )}
      </g>
    );
  };

  return (
    <div className="p-10 glass rounded-[3.5rem] border border-white/10 space-y-12 animate-in fade-in duration-1000 relative overflow-hidden">
      <div className="flex flex-col md:flex-row justify-between items-start gap-8 relative z-10">
        <div className="space-y-2">
          <h3 className="text-5xl font-black font-display text-white italic tracking-tighter uppercase">
            MAPA DE <span className="mamba-text">MAESTRÍA</span>
          </h3>
          <p className="text-slate-500 font-bold text-xs uppercase tracking-[0.4em]">Visualizando Dominio Cognitivo v12.0</p>
        </div>

        <div className="flex gap-4">
           <div className="bg-black/40 px-6 py-3 rounded-2xl border border-white/5 flex flex-col items-center">
              <span className="text-[8px] font-black text-slate-500 uppercase mb-1">Puntos de Dominio</span>
              <span className="text-xl font-black text-white">4,820 DP</span>
           </div>
           <div className="accent-bg px-6 py-3 rounded-2xl flex flex-col items-center shadow-[0_0_20px_var(--accent-glow)]">
              <span className="text-[8px] font-black text-black/60 uppercase mb-1">Rango Global</span>
              <span className="text-xl font-black text-black">TOP 3%</span>
           </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-12 items-center">
        {/* Map Visualizer */}
        <div className="lg:col-span-2 relative aspect-[4/3] bg-black/40 rounded-[3rem] border border-white/5 overflow-hidden flex items-center justify-center group shadow-inner">
           {/* Neural Background Grid */}
           <div className="absolute inset-0 opacity-5 pointer-events-none">
              <div className="absolute inset-0 grid grid-cols-6 grid-rows-6">
                 {Array.from({length: 36}).map((_, i) => <div key={i} className="border border-white/20" />)}
              </div>
           </div>

           <svg viewBox="0 0 350 350" className="w-full h-full p-10 drop-shadow-[0_0_30px_rgba(0,0,0,0.5)]">
              {/* Connections (Synapses) */}
              <g opacity="0.2">
                 <line x1="150" y1="100" x2="250" y2="150" stroke="var(--accent-primary)" strokeWidth="1" strokeDasharray="5 5" />
                 <line x1="150" y1="100" x2="50" y2="150" stroke="var(--accent-primary)" strokeWidth="1" />
                 <line x1="150" y1="250" x2="150" y2="100" stroke="var(--accent-primary)" strokeWidth="1" />
              </g>

              {/* Nodes */}
              {INITIAL_NODES.map(node => renderHex(node))}
           </svg>

           <div className="absolute top-8 left-8 flex items-center gap-2">
              <div className="w-2 h-2 rounded-full bg-accent-primary animate-ping"></div>
              <span className="text-[8px] font-black text-white/40 tracking-[0.5em] uppercase">Mamba_Brain_Link: ACTIVE</span>
           </div>
        </div>

        {/* Node Details Panel */}
        <div className="space-y-8 h-full">
           {selectedNode ? (
             <div className="glass p-10 rounded-[2.5rem] border-white/10 h-full flex flex-col justify-between animate-in slide-in-from-right duration-500">
                <div className="space-y-6">
                   <div className="flex items-center gap-4">
                      <div className="text-4xl p-4 bg-white/5 rounded-2xl border border-white/10">{selectedNode.icon}</div>
                      <div>
                         <h4 className="text-2xl font-black text-white italic uppercase tracking-tighter">{selectedNode.label}</h4>
                         <p className="text-xs font-bold accent-text uppercase tracking-widest">{selectedNode.category}</p>
                      </div>
                   </div>

                   <div className="space-y-4">
                      <div className="flex justify-between items-end">
                         <span className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Nivel de Dominio</span>
                         <span className="text-2xl font-black text-white">{selectedNode.level}%</span>
                      </div>
                      <div className="h-2 w-full bg-white/5 rounded-full overflow-hidden border border-white/5">
                         <div 
                           className="h-full accent-bg transition-all duration-1000" 
                           style={{ width: `${selectedNode.level}%` }}
                         />
                      </div>
                   </div>

                   <div className="bg-black/30 p-6 rounded-2xl border border-white/5 space-y-4">
                      <h5 className="text-[9px] font-black text-slate-500 uppercase tracking-widest">Feedback del Sentinel AI</h5>
                      <p className="text-xs text-slate-300 italic leading-relaxed">
                         {selectedNode.status === 'mastered' 
                           ? "Dominio total detectado. Diego ha operado con precisión del 100% en las últimas 5 sesiones. Desbloqueando retos avanzados."
                           : selectedNode.status === 'learning' 
                           ? "Progreso constante. Se recomienda practicar la visualización 3D para consolidar la retención a largo plazo."
                           : "Nodo bloqueado. Completa la Misión de Fracciones para acceder a esta unidad."}
                      </p>
                   </div>
                </div>

                <button 
                  disabled={selectedNode.status === 'locked'}
                  className={`w-full py-4 rounded-2xl text-[10px] font-black uppercase tracking-widest mt-8 transition-all ${selectedNode.status !== 'locked' ? 'accent-bg text-black hover:scale-105' : 'bg-white/5 text-slate-600 border border-white/5'}`}
                >
                  {selectedNode.status === 'locked' ? 'NODO BLOQUEADO' : 'LANZAR MÓDULO'}
                </button>
             </div>
           ) : (
             <div className="flex items-center justify-center h-full text-slate-600 italic text-sm">
                Selecciona un nodo para ver telemetría
             </div>
           )}
        </div>
      </div>

      {/* Mastery Stats HUD */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
         {[
           { label: 'Tiempo Total', val: '24.5 hrs', icon: '⏱️' },
           { label: 'Precisión', val: '92.8%', icon: '🎯' },
           { label: 'Nodos Master', val: '2/6', icon: '💎' },
           { label: 'Racha Actual', val: '12 Días', icon: '🔥' },
         ].map((stat, i) => (
           <div key={i} className="bg-white/[0.03] p-6 rounded-3xl border border-white/5 flex items-center gap-4 group hover:border-accent-primary/20 transition-all">
              <span className="text-2xl living-symbol">{stat.icon}</span>
              <div>
                 <span className="text-[8px] font-black text-slate-500 uppercase block tracking-widest">{stat.label}</span>
                 <span className="text-lg font-black text-white">{stat.val}</span>
              </div>
           </div>
         ))}
      </div>
    </div>
  );
};
