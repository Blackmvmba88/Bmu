
import React, { useState } from 'react';
import { askBlackMamba } from '../services/geminiService';
import { VisualDisplay } from './VisualDisplay';
import { MathResponse } from '../types';
import { MambaSnakeIcon } from './MambaSnakeIcon';

interface AICoachProps {
  theme?: 'mamba' | 'pao';
  userName?: string;
}

export const AICoach: React.FC<AICoachProps> = ({ theme = 'mamba', userName = "Iyari" }) => {
  const [query, setQuery] = useState("");
  const [response, setResponse] = useState<MathResponse | null>(null);
  const [loading, setLoading] = useState(false);

  const handleAsk = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!query.trim()) return;
    setLoading(true);
    const result = await askBlackMamba(`Hola, soy ${userName}. ${query}`, theme === 'pao' ? 'parent' : 'student');
    setResponse(result);
    setLoading(false);
  };

  const roleLabel = theme === 'mamba' ? userName.split(' ')[0].toUpperCase() : 'PAO';
  const roleDesc = theme === 'mamba' ? 'MODO COMBATE MATEMÁTICO' : 'CONSEJERO EDUCATIVO';

  return (
    <div className={`p-8 glass rounded-[2.5rem] border transition-colors duration-500 relative overflow-hidden shadow-2xl ${theme === 'mamba' ? 'border-lime-500/20' : 'border-pink-500/20'}`}>
      <div className={`absolute -top-24 -right-24 w-64 h-64 blur-[100px] rounded-full opacity-10 ${theme === 'mamba' ? 'bg-lime-500' : 'bg-pink-500'}`}></div>
      
      <div className="space-y-8 relative z-10">
        <header className="flex items-center gap-4">
          <div className={`w-14 h-14 accent-bg rounded-2xl flex items-center justify-center shadow-lg shadow-accent-primary/20 rotate-3 transition-transform hover:rotate-0`}>
             {theme === 'mamba' ? <MambaSnakeIcon size={32} className="text-black" /> : <span className="text-2xl">💖</span>}
          </div>
          <div>
            <h3 className="text-3xl font-black font-display tracking-tight text-white italic uppercase">
              {theme === 'mamba' ? 'Black Mamba AI' : 'Pao Assistant'}
            </h3>
            <p className="accent-text text-[10px] font-black uppercase tracking-[0.2em]">{roleDesc}</p>
          </div>
        </header>

        <form onSubmit={handleAsk} className="relative group">
          <input 
            type="text" 
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder={theme === 'mamba' ? `Hola ${userName}, ¿en qué te puedo ayudar hoy?` : "Ej: ¿Cómo explico fracciones equivalentes de forma fácil?"}
            className="w-full bg-white/5 border border-white/10 rounded-2xl px-8 py-6 text-white placeholder:text-slate-600 focus:outline-none focus:border-accent-primary/50 transition-all text-lg pr-40 shadow-inner"
          />
          <button 
            type="submit"
            disabled={loading}
            className={`absolute right-3 top-3 bottom-3 px-8 accent-bg hover:opacity-90 text-black font-black rounded-xl transition-all disabled:opacity-50 flex items-center gap-2`}
          >
            {loading ? (
              <div className="w-5 h-5 border-2 border-black/20 border-t-black rounded-full animate-spin"></div>
            ) : "PREGUNTAR"}
          </button>
        </form>

        {response && (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 animate-in fade-in slide-in-from-bottom-8 duration-700">
            <div className="space-y-6">
              <div className="p-8 bg-white/[0.03] border border-white/5 rounded-[2rem] shadow-xl">
                <span className="accent-text text-[10px] font-black uppercase tracking-widest block mb-4 italic">Análisis para {roleLabel}</span>
                <p className="text-2xl font-black text-white leading-tight mb-4">{response.answer}</p>
                <div className="h-1 w-12 accent-bg rounded-full mb-6"></div>
                <p className="text-slate-300 leading-relaxed font-medium text-lg italic">"{response.explanation}"</p>
              </div>
            </div>
            
            <div className="flex flex-col justify-center items-center p-8 glass rounded-[2rem] border border-white/5 min-h-[300px] relative group overflow-hidden">
              <div className="absolute inset-0 bg-accent-primary/5 opacity-0 group-hover:opacity-100 transition-opacity"></div>
              <span className="absolute top-6 left-6 text-[10px] font-black text-slate-500 uppercase tracking-widest">Visualización de Concepto</span>
              <div className="relative z-10 w-full flex justify-center">
                <VisualDisplay data={response.visualData} />
              </div>
            </div>
          </div>
        )}

        {!response && !loading && (
          <div className="flex flex-wrap gap-3 opacity-50 justify-center">
            {(theme === 'mamba' 
              ? [`${userName}, ¿cuánto es el 20% de 80?`, "1/2 de 1.5kg", "¿Cómo multiplico 1/4 por 2?"]
              : ["Consejos para motivar a Iyari", "Repaso de Algebra básico", "Plan para estudiar hoy"]
            ).map(q => (
              <button key={q} onClick={() => {setQuery(q)}} className="px-5 py-3 border border-white/10 rounded-2xl text-[10px] font-black hover:bg-white/10 transition-all uppercase tracking-wider hover:border-accent-primary/50">
                {q}
              </button>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};
