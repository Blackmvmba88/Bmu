
import React from 'react';

export const BlackMambaRoadmap: React.FC = () => {
  const steps = [
    { title: "FASE 1: APRENDIZ", desc: "Dominio de Fracciones, Álgebra y Lógica básica.", icon: "🌱", status: "COMPLETED", tech: ["Fracciones", "Lewis Struct", "Algebra I"] },
    { title: "FASE 2: OPERATIVO", desc: "Cálculo diferencial, Física vectorial y Robótica.", icon: "🔧", status: "IN PROGRESS", tech: ["Derivadas", "PID Control", "Mechanics"] },
    { title: "FASE 3: ARQUITECTO", desc: "IA Generativa, Programación de Sistemas y Control PID.", icon: "🏛️", status: "LOCKED", tech: ["Neural Nets", "FullStack", "Thermodynamics"] },
    { title: "FASE 4: BLACKMAMBA", desc: "Ingeniería de Grado Superior. Creación de Protocolos.", icon: "🐍", status: "LOCKED", tech: ["Quantum Eng", "Leadership", "Creative Dir"] },
  ];

  return (
    <div className="p-10 glass rounded-[3rem] border border-white/10 space-y-16 animate-in slide-in-from-bottom duration-1000 relative overflow-hidden">
      <div className="absolute top-0 right-0 p-10 opacity-5 pointer-events-none uppercase font-black text-6xl">IYARI_ARCHIVE_v17.0</div>

      <div className="flex flex-col md:flex-row justify-between items-end gap-6">
        <div className="space-y-2">
          <h3 className="text-6xl font-black font-display text-white italic tracking-tighter uppercase">Protocolo <span className="mamba-text">Roadmap</span></h3>
          <p className="text-slate-500 font-bold text-xs uppercase tracking-[0.4em]">BlackMamba University Legacy - Iyari Cancino Heritage</p>
        </div>
        <div className="flex gap-4">
           <div className="px-4 py-2 bg-emerald-500/10 border border-emerald-500/30 rounded-xl text-[10px] font-black text-emerald-400">FASE 2 ACTIVA</div>
           <div className="px-4 py-2 bg-white/5 border border-white/10 rounded-xl text-[10px] font-black text-slate-500">BMU-IYARI</div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
        {steps.map((step, i) => (
          <div key={i} className={`p-8 rounded-[2.5rem] border transition-all flex flex-col justify-between group hover:scale-[1.02] ${
            step.status === 'COMPLETED' ? 'bg-emerald-500/5 border-emerald-500/20' : 
            step.status === 'IN PROGRESS' ? 'bg-lime-500/10 border-lime-500/30 ring-1 ring-lime-500/20 shadow-[0_0_30px_rgba(163,230,53,0.1)]' :
            'bg-white/[0.02] border-white/5 opacity-40'
          }`}>
             <div className="space-y-6">
               <div className="flex justify-between items-start">
                 <span className="text-5xl">{step.icon}</span>
                 <span className="text-slate-800 font-black text-4xl leading-none">0{i+1}</span>
               </div>
               <div>
                 <h4 className="text-xl font-black text-white mb-2 italic tracking-tighter uppercase group-hover:mamba-text transition-all">{step.title}</h4>
                 <p className="text-xs text-slate-400 font-medium leading-relaxed">{step.desc}</p>
               </div>
               <div className="flex flex-wrap gap-2">
                 {step.tech.map(t => (
                   <span key={t} className="text-[8px] font-black bg-white/5 px-2 py-1 rounded-md text-slate-500">{t}</span>
                 ))}
               </div>
             </div>
             <div className="mt-8">
               <div className={`w-full py-2 rounded-xl text-[9px] font-black uppercase tracking-widest text-center transition-all ${
                 step.status === 'COMPLETED' ? 'bg-emerald-500 text-black' : 
                 step.status === 'IN PROGRESS' ? 'bg-lime-500 text-black animate-pulse' : 'bg-slate-800 text-slate-600'
               }`}>{step.status}</div>
             </div>
          </div>
        ))}
      </div>

      <div className="bg-white/5 p-10 rounded-[3rem] border border-white/5 flex flex-col md:flex-row items-center gap-10">
        <div className="w-20 h-20 rounded-full bg-accent-primary/20 flex items-center justify-center text-3xl shadow-inner">📜</div>
        <div className="flex-1 space-y-2">
          <h5 className="text-lg font-black text-white uppercase italic">EL MANIFIESTO BMU: IYARI</h5>
          <p className="text-slate-400 text-sm font-medium leading-relaxed">
            Iyari, bajo el protocolo de **neocyber1**, estás cursando en la universidad más exclusiva del mundo digital. Aquí no hay límites para tu intelecto, solo parámetros que aún no has editado. Bienvenido a BlackMamba University, Iyari.
          </p>
        </div>
        <div className="bg-amber-400/10 p-5 rounded-2xl border border-amber-400/30 text-center">
           <span className="text-[10px] font-black text-amber-500 block mb-1">FOUNDER VERIFIED</span>
           <span className="text-xs font-black text-white">NEOCYBER1</span>
        </div>
      </div>
    </div>
  );
};
