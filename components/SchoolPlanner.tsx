
import React, { useState, useEffect } from 'react';
import { StudyTask } from '../types';
import { getPlanningAdvice } from '../services/geminiService';

export const SchoolPlanner: React.FC = () => {
  const [tasks, setTasks] = useState<StudyTask[]>([
    { id: '1', subject: 'Cálculo', topic: 'Derivadas e Integrales', status: 'pending', difficulty: 'hard' },
    { id: '2', subject: 'Física II', topic: 'Termodinámica y Entropía', status: 'completed', difficulty: 'hard' },
    { id: '3', subject: 'Química', topic: 'Enlaces de Carbono', status: 'pending', difficulty: 'medium' },
    { id: '4', subject: 'Álgebra', topic: 'Matrices 3x3', status: 'completed', difficulty: 'medium' },
  ]);
  const [advice, setAdvice] = useState<string>("Cargando estrategia de nivel Preparatoria...");

  useEffect(() => {
    getPlanningAdvice("Cálculo y Física Avanzada").then(setAdvice);
  }, []);

  const toggleTask = (id: string) => {
    setTasks(tasks.map(t => t.id === id ? { ...t, status: t.status === 'completed' ? 'pending' : 'completed' } : t));
  };

  return (
    <div className="p-8 glass rounded-[2.5rem] border border-pink-500/20 space-y-8 animate-in fade-in duration-500">
      <div className="flex flex-col md:flex-row justify-between items-start gap-6">
        <div>
          <h3 className="text-3xl font-black font-display text-white italic uppercase tracking-tighter">
            Dashboard <span className="mamba-text">HighSchool Pao</span>
          </h3>
          <p className="text-pink-400 font-bold text-[10px] tracking-[0.3em] uppercase">Control de Ingeniería Educativa - Diego</p>
        </div>
        <div className="bg-white/5 p-5 rounded-2xl border border-white/10 max-w-sm flex gap-4">
          <span className="text-2xl">🧠</span>
          <div>
            <p className="text-[10px] font-black text-pink-300 uppercase mb-1">Estrategia Semanal:</p>
            <p className="text-xs text-slate-300 leading-relaxed italic">"{advice}"</p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div className="space-y-3">
          <div className="flex justify-between items-center mb-4">
             <h4 className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Currículo de Preparatoria</h4>
             <span className="text-[10px] font-black text-pink-500">Fase 3 de 5</span>
          </div>
          {tasks.map(task => (
            <div 
              key={task.id}
              onClick={() => toggleTask(task.id)}
              className={`p-5 rounded-3xl border cursor-pointer transition-all flex items-center justify-between group ${
                task.status === 'completed' ? 'bg-emerald-500/5 border-emerald-500/20' : 'bg-white/[0.02] border-white/5 hover:border-pink-500/40'
              }`}
            >
              <div className="flex items-center gap-5">
                <div className={`w-8 h-8 rounded-xl border-2 flex items-center justify-center transition-all ${task.status === 'completed' ? 'bg-emerald-500 border-emerald-500' : 'border-white/10 group-hover:border-pink-500/50'}`}>
                  {task.status === 'completed' && <span className="text-black text-xs font-black">✓</span>}
                </div>
                <div>
                  <p className={`font-black text-sm uppercase tracking-tight ${task.status === 'completed' ? 'text-slate-500 line-through' : 'text-white'}`}>{task.topic}</p>
                  <p className="text-[9px] text-slate-600 font-black uppercase tracking-widest">{task.subject}</p>
                </div>
              </div>
              <div className={`px-3 py-1 rounded-full text-[8px] font-black uppercase ${
                task.difficulty === 'hard' ? 'bg-red-500/10 text-red-400' : 'bg-blue-500/10 text-blue-400'
              }`}>
                {task.difficulty}
              </div>
            </div>
          ))}
        </div>

        <div className="bg-black/40 rounded-[3rem] border border-white/10 p-10 flex flex-col justify-center items-center text-center group">
           <div className="relative w-48 h-48 mb-6">
             <svg className="w-full h-full rotate-[-90deg]">
               <circle cx="96" cy="96" r="80" className="fill-none stroke-white/5 stroke-[12]" />
               <circle 
                 cx="96" cy="96" r="80" 
                 className="fill-none stroke-pink-500 stroke-[12] transition-all duration-1000"
                 strokeDasharray={502}
                 strokeDashoffset={502 - (502 * tasks.filter(t => t.status === 'completed').length / tasks.length)}
                 strokeLinecap="round"
               />
             </svg>
             <div className="absolute inset-0 flex flex-col items-center justify-center">
               <span className="text-5xl font-black text-white">{Math.round((tasks.filter(t => t.status === 'completed').length / tasks.length) * 100)}%</span>
               <span className="text-[9px] font-black text-pink-500 uppercase tracking-widest">Mastery</span>
             </div>
           </div>
           <div className="space-y-2">
             <h5 className="text-white font-black uppercase text-base tracking-tighter italic">Nivel de Retención</h5>
             <p className="text-slate-500 text-xs font-medium px-4">Diego está operando en el percentil superior. Su enfoque en Cálculo es notable.</p>
           </div>
        </div>
      </div>
    </div>
  );
};
