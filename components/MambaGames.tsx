
import React, { useState, useEffect, useRef } from 'react';

export const MambaGames: React.FC<{ theme?: 'mamba' | 'pao' }> = ({ theme }) => {
  const [activeGame, setActiveGame] = useState<'typing' | 'pid' | 'cross'>('typing');
  const bgAccent = theme === 'mamba' ? 'bg-lime-500' : 'bg-pink-500';

  return (
    <div className="space-y-8 animate-in zoom-in duration-500">
      <div className="flex flex-wrap justify-center gap-4">
        <button 
          onClick={() => setActiveGame('typing')}
          className={`px-6 py-3 rounded-2xl font-black text-[10px] tracking-widest transition-all ${activeGame === 'typing' ? bgAccent + ' text-black' : 'bg-white/5 text-slate-500 hover:text-white'}`}
        >
          CODE-BREAKER (BOMBS)
        </button>
        <button 
          onClick={() => setActiveGame('pid')}
          className={`px-6 py-3 rounded-2xl font-black text-[10px] tracking-widest transition-all ${activeGame === 'pid' ? bgAccent + ' text-black' : 'bg-white/5 text-slate-500 hover:text-white'}`}
        >
          PID STABILIZER (CONTROL)
        </button>
        <button 
          onClick={() => setActiveGame('cross')}
          className={`px-6 py-3 rounded-2xl font-black text-[10px] tracking-widest transition-all ${activeGame === 'cross' ? bgAccent + ' text-black' : 'bg-white/5 text-slate-500 hover:text-white'}`}
        >
          MAMBA CROSS (COGNITIVO)
        </button>
      </div>

      <div className="min-h-[600px]">
        {activeGame === 'typing' && <TypingGame theme={theme} />}
        {activeGame === 'pid' && <PIDGame theme={theme} />}
        {activeGame === 'cross' && <MambaCross theme={theme} />}
      </div>
    </div>
  );
};

const TypingGame: React.FC<{ theme?: string }> = ({ theme }) => {
  const dictionary = [
    "DERIVADA", "INTEGRAL", "FRACCION", "VECTOR", "MATRIZ", "ALGEBRA", "FISICA", "QUIMICA", "GRAVEDAD", 
    "ENTROPIA", "COVALENTE", "COEFICIENTE", "ALGORITMO", "BINARIO", "CUANTICO", "TERMODINAMICA", 
    "SINAPSIS", "GENOMA", "ORBITA", "ATMOSFERA", "CINETICA", "POTENCIAL", "HIDROGENO", "CARBONO", 
    "PROPOSICION", "GEOMETRIA", "TRIGONOMETRIA", "CALCULO", "DINAMICA", "ESTATICA", "LOGARITMO", 
    "EXPONENCIAL", "DERIVACION", "LIMITES", "FUNCION", "VARIABLE", "CONSTANTE", "MOLARIDAD", 
    "ESTEQUIOMETRIA", "ELECTROMAGNETISMO", "RELATIVIDAD", "NEUTRON", "PROTON", "ELECTRON", 
    "ATOMO", "MOLECULA", "POLIMERO", "SINTESIS", "PARABOLA", "ELIPSE", "ASINTOTA", "HEURISTICA", 
    "TENSION", "FRICCION", "INERCIA", "MOMENTO", "FOTON", "CATALIZADOR", "NUCLEOTIDO", 
    "CITOPLASMA", "MITOCONDRIA", "OSMOSIS", "DIFUSION", "GRADIENTE", "CONVERGENCIA", "DIVERGENCIA",
    "ISOPO", "HIDROSTATICA", "TERMOSTATO", "RADIACION", "QUANTIC", "FUSION", "FISION", "ISOMERO",
    "ESTRUCTURA", "SINTAXIS", "REFRACCION", "REFLEXION", "DIFRACCION", "MODULO", "ANGULO", "RADIAN",
    "HIPOTENUSA", "CATETO", "POLIGONO", "OCTAEDRO", "DODECAEDRO", "PENTAGONO", "HEXAGONO", "ELIPSOIDE",
    "SUPERFICIE", "VOLUMEN", "DENSIDAD", "PRESIÓN", "CAUDAL", "VISCOSIDAD", "FLUJO", "TURBULENCIA",
    "LAMINAR", "PASCAL", "NEWTON", "JOULE", "WATT", "COULOMB", "AMPERIO", "VOLTIO", "OHMIO", "TESLA"
  ];

  const [currentWord, setCurrentWord] = useState("");
  const [charIndex, setCharIndex] = useState(0);
  const [score, setScore] = useState(0);
  const [lives, setLives] = useState(4);
  const [yPos, setYPos] = useState(0);
  const [speed, setSpeed] = useState(0.12);
  const [isExploding, setIsExploding] = useState(false);
  const [gameOver, setGameOver] = useState(false);
  const audioCtx = useRef<AudioContext | null>(null);

  useEffect(() => {
    resetWord(false);
    return () => {
      if (audioCtx.current) audioCtx.current.close();
    };
  }, []);

  const playSound = (freq: number, type: 'sine' | 'square' | 'sawtooth' = 'sine', duration = 0.1) => {
    if (!audioCtx.current) audioCtx.current = new (window.AudioContext || (window as any).webkitAudioContext)();
    const osc = audioCtx.current.createOscillator();
    const gain = audioCtx.current.createGain();
    osc.type = type;
    osc.frequency.setValueAtTime(freq, audioCtx.current.currentTime);
    gain.gain.setValueAtTime(0.1, audioCtx.current.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.01, audioCtx.current.currentTime + duration);
    osc.connect(gain);
    gain.connect(audioCtx.current.destination);
    osc.start();
    osc.stop(audioCtx.current.currentTime + duration);
  };

  useEffect(() => {
    if (gameOver || isExploding || !currentWord) return;
    const timer = setInterval(() => {
      setYPos(prev => {
        if (prev > 85) {
          triggerImpact();
          return 0;
        }
        return prev + speed;
      });
    }, 40);
    return () => clearInterval(timer);
  }, [currentWord, speed, gameOver, isExploding]);

  const triggerImpact = () => {
    setIsExploding(true);
    playSound(100, 'sawtooth', 0.5); // Explosion sound
    setLives(l => {
      const newLives = Math.max(0, l - 1);
      if (newLives === 0) setGameOver(true);
      return newLives;
    });
    setTimeout(() => {
      setIsExploding(false);
      resetWord(false);
    }, 1000);
  };

  const resetWord = (success: boolean) => {
    const next = dictionary[Math.floor(Math.random() * dictionary.length)];
    setCurrentWord(next);
    setCharIndex(0);
    setYPos(0);
    if (success) {
      setSpeed(s => Math.min(s + 0.012, 1.5));
    }
  };

  const handleKeyDown = (e: KeyboardEvent) => {
    if (gameOver || isExploding || !currentWord) return;
    
    const pressedKey = e.key.toUpperCase();
    // Only care about letters
    if (!/^[A-ZÁÉÍÓÚÑ]$/.test(pressedKey)) return;

    if (pressedKey === currentWord[charIndex]) {
      // Correct key
      const nextIdx = charIndex + 1;
      setCharIndex(nextIdx);
      
      // Pitch increases with each correct letter
      const freq = 440 + (nextIdx * 50);
      playSound(freq, 'sine', 0.15);

      if (nextIdx === currentWord.length) {
        setScore(s => s + 200);
        resetWord(true);
      }
    } else {
      // Incorrect key - low buzz
      playSound(150, 'square', 0.1);
    }
  };

  useEffect(() => {
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [currentWord, charIndex, gameOver, isExploding]);

  const restart = () => {
    setLives(4);
    setScore(0);
    setSpeed(0.12);
    setGameOver(false);
    resetWord(false);
  };

  return (
    <div className={`p-10 glass rounded-[3rem] border border-white/10 flex flex-col items-center justify-center space-y-12 relative overflow-hidden h-[650px] transition-all duration-300 ${isExploding ? 'bg-red-900/40 ring-4 ring-red-500 animate-shake' : ''}`}>
      {/* HUD Elements */}
      <div className="absolute top-10 left-10 flex flex-col items-start z-30">
        <span className="text-[10px] font-black text-slate-500 uppercase tracking-widest">BMU Integrity</span>
        <div className="flex gap-2 mt-2">
          {[...Array(4)].map((_, i) => (
            <div key={i} className={`w-10 h-2 rounded-full transition-all duration-500 ${i < lives ? 'bg-accent-primary shadow-[0_0_15px_var(--accent-glow)]' : 'bg-red-950 border border-red-900'}`} />
          ))}
        </div>
      </div>

      <div className="absolute top-10 right-10 flex flex-col items-end z-30">
        <span className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Protocol XP</span>
        <span className="text-4xl font-black text-white font-display tracking-tighter italic">{score}</span>
      </div>

      {gameOver ? (
        <div className="flex flex-col items-center gap-8 animate-in zoom-in duration-500 z-40 bg-black/80 p-12 rounded-[3rem] border border-white/10 backdrop-blur-xl">
          <div className="text-8xl">☢️</div>
          <div className="text-center">
             <h2 className="text-6xl font-black text-white italic font-display mamba-text">MELTDOWN</h2>
             <p className="text-slate-500 font-bold uppercase tracking-[0.3em] mt-2">SISTEMA COMPROMETIDO</p>
          </div>
          <div className="bg-white/5 p-6 rounded-2xl border border-white/5 w-full text-center">
             <span className="text-[10px] text-slate-500 uppercase block mb-1">Carga Final</span>
             <span className="text-4xl font-black text-white">{score} XP</span>
          </div>
          <button 
            onClick={restart}
            className="w-full py-5 mamba-gradient text-black font-black rounded-2xl hover:scale-110 transition-transform shadow-2xl uppercase tracking-widest text-sm"
          >
            REINICIAR NÚCLEO
          </button>
        </div>
      ) : (
        <>
          {/* Falling "Big Boy" Bomb */}
          <div 
            className={`absolute transition-all duration-75 flex flex-col items-center gap-6 z-10 ${isExploding ? 'scale-150 opacity-0' : ''}`}
            style={{ top: `${yPos}%` }}
          >
            <div className="relative group">
               {/* Fuse Sparks */}
               <div className="absolute -top-6 left-1/2 -translate-x-1/2 w-4 h-4 bg-orange-500 rounded-full animate-ping opacity-50"></div>
               <div className="absolute -top-5 left-1/2 -translate-x-1/2 w-2 h-8 bg-amber-900 rounded-full origin-bottom rotate-12"></div>
               
               {/* The Body (Big Boy Type) */}
               <div className="w-24 h-24 bg-black rounded-full border-4 border-white/10 shadow-[0_0_50px_rgba(0,0,0,0.8)] flex items-center justify-center relative">
                  <div className="absolute inset-2 border-2 border-dashed border-white/5 rounded-full animate-spin-slow"></div>
                  <span className="text-[10px] font-black text-white/20 tracking-widest">N-BOMB</span>
               </div>
               
               {/* Fin at bottom */}
               <div className="w-12 h-6 bg-black mx-auto -mt-2 border-x-4 border-b-4 border-white/10 rounded-b-lg"></div>
            </div>

            <div className="flex flex-col items-center">
              <div className="bg-black/95 backdrop-blur-2xl px-10 py-4 rounded-[2rem] border-2 border-white/10 shadow-[0_0_40px_rgba(0,0,0,0.5)] flex gap-1">
                {currentWord.split('').map((char, i) => (
                  <span 
                    key={i} 
                    className={`text-4xl font-black italic font-display transition-all duration-200 ${
                      i < charIndex ? 'text-accent-primary mamba-text' : 'text-slate-700'
                    } ${i === charIndex ? 'scale-125 text-white underline decoration-accent-primary underline-offset-8' : ''}`}
                  >
                    {char}
                  </span>
                ))}
              </div>
              <div className="mt-4 flex gap-2">
                 <span className="text-[8px] font-black text-slate-500 uppercase bg-white/5 px-3 py-1 rounded-full border border-white/5 tracking-[0.2em]">
                   VEL: {(speed * 100).toFixed(0)}%
                 </span>
                 <span className="text-[8px] font-black text-accent-primary uppercase bg-accent-primary/5 px-3 py-1 rounded-full border border-accent-primary/20 tracking-[0.2em]">
                   ACTIVE_TARGET
                 </span>
              </div>
            </div>
          </div>

          {/* Input Prompt Overlay */}
          <div className="absolute bottom-16 w-full flex flex-col items-center gap-4">
             <div className="w-1 h-12 bg-gradient-to-t from-accent-primary to-transparent animate-pulse rounded-full"></div>
             <p className="text-[11px] font-black text-white/40 uppercase tracking-[0.5em] animate-pulse">Teclea para desarmar</p>
          </div>
        </>
      )}

      {/* Explosion Overlays */}
      {isExploding && !gameOver && (
        <div className="absolute inset-0 bg-red-600/30 animate-pulse pointer-events-none z-50 flex items-center justify-center">
           <div className="w-full h-full bg-white opacity-20 animate-ping"></div>
        </div>
      )}

      <style>{`
        @keyframes spin-slow {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
        .animate-spin-slow {
          animation: spin-slow 10s linear infinite;
        }
        @keyframes shake {
          0% { transform: translate(1px, 1px) rotate(0deg); }
          10% { transform: translate(-3px, -2px) rotate(-1deg); }
          20% { transform: translate(-5px, 0px) rotate(1deg); }
          30% { transform: translate(5px, 2px) rotate(0deg); }
          40% { transform: translate(1px, -1px) rotate(1deg); }
          50% { transform: translate(-1px, 2px) rotate(-1deg); }
          60% { transform: translate(-5px, 1px) rotate(0deg); }
          70% { transform: translate(5px, 1px) rotate(-1deg); }
          80% { transform: translate(-1px, -1px) rotate(1deg); }
          90% { transform: translate(1px, 2px) rotate(0deg); }
          100% { transform: translate(1px, -2px) rotate(-1deg); }
        }
        .animate-shake {
          animation: shake 0.5s infinite;
        }
      `}</style>
    </div>
  );
};

const MambaCross: React.FC<{ theme?: string }> = ({ theme }) => {
  const [level, setLevel] = useState(0);
  const [question, setQuestion] = useState({ q: "25 + 75?", a: "100" });
  const [input, setInput] = useState("");

  const nextQuestion = () => {
    const qs = [
      { q: "√144?", a: "12" },
      { q: "3/4 de 100?", a: "75" },
      { q: "2^5?", a: "32" },
      { q: "H2O es...?", a: "AGUA" },
      { q: "m de y=2x+5?", a: "2" }
    ];
    setQuestion(qs[Math.floor(Math.random() * qs.length)]);
    setInput("");
  };

  const handleInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value.toUpperCase();
    setInput(val);
    if (val === question.a) {
      setLevel(l => l + 1);
      nextQuestion();
    }
  };

  return (
    <div className="p-10 glass rounded-[3rem] border border-white/10 flex flex-col items-center justify-center space-y-12 relative overflow-hidden h-[600px] bg-slate-950">
       <div className="absolute inset-0 grid grid-rows-10 opacity-10">
         {Array.from({length: 10}).map((_, i) => (
           <div key={i} className={`border-b border-white/20 flex items-center px-10 ${i % 2 === 0 ? 'bg-white/5' : ''}`}>
             <span className="text-[10px] text-slate-700 font-black uppercase">Street {10-i}</span>
           </div>
         ))}
       </div>

       <div className="relative z-10 flex flex-col items-center gap-8 text-center">
         <div className="text-6xl animate-bounce">🐍</div>
         <div className="space-y-2">
           <h3 className="text-white font-black text-4xl font-display uppercase italic mamba-text">Mamba Cross</h3>
           <p className="text-slate-500 font-black text-[10px] uppercase tracking-widest">Salta a la siguiente calle con lógica</p>
         </div>

         <div className="bg-black/60 backdrop-blur-xl p-10 rounded-[2.5rem] border border-white/10 shadow-2xl space-y-6 min-w-[350px]">
           <span className="text-[10px] font-black text-lime-500 uppercase tracking-[0.4em]">Calle {level}</span>
           <p className="text-5xl font-black text-white">{question.q}</p>
           <input 
             autoFocus
             value={input}
             onChange={handleInput}
             placeholder="RESPUESTA..."
             className="w-full bg-white/5 border border-white/10 rounded-2xl px-6 py-4 text-center text-white font-black text-xl focus:outline-none focus:border-lime-500"
           />
         </div>
       </div>

       <div className="absolute bottom-10 left-10 flex gap-4">
         <div className="bg-white/5 p-4 rounded-2xl border border-white/10">
           <span className="text-[9px] font-black text-slate-500 block">RECORD</span>
           <span className="text-xl font-black text-white">42</span>
         </div>
         <div className="bg-white/5 p-4 rounded-2xl border border-white/10">
           <span className="text-[9px] font-black text-slate-500 block">DIEGO</span>
           <span className="text-xl font-black text-lime-400">LVL {level}</span>
         </div>
       </div>
    </div>
  );
};

const PIDGame: React.FC<{ theme?: string }> = ({ theme }) => {
  const [p, setP] = useState(50);
  const [i, setI] = useState(20);
  const [d, setD] = useState(30);
  const [angle, setAngle] = useState(0);
  const [targetAngle, setTargetAngle] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setTargetAngle(Math.sin(Date.now() / 1200) * 20);
      setAngle(prev => {
        const error = targetAngle - prev;
        const correction = (error * (p/150)) + ((d/200) * 1);
        return prev + correction + (Math.random() - 0.5) * 1.5;
      });
    }, 50);
    return () => clearInterval(interval);
  }, [p, i, d, targetAngle]);

  const accentColor = theme === 'mamba' ? 'accent-lime-500' : 'accent-pink-500';

  return (
    <div className="p-10 glass rounded-[3rem] border border-white/10 grid grid-cols-1 lg:grid-cols-2 gap-12 items-center min-h-[500px]">
      <div className="space-y-8">
        <div>
          <h3 className="text-3xl font-black font-display text-white uppercase italic">PID Stabilizer</h3>
          <p className="text-slate-500 font-bold text-xs uppercase tracking-widest mt-1">Control Fino de Ingeniería para Diego</p>
        </div>

        <div className="space-y-6">
          <div className="space-y-2">
            <div className="flex justify-between text-[10px] font-black text-white uppercase italic">
              <span>Proporcional (P)</span>
              <span>{p}</span>
            </div>
            <input type="range" value={p} onChange={e => setP(parseInt(e.target.value))} className={`w-full ${accentColor}`} />
          </div>
          <div className="space-y-2">
            <div className="flex justify-between text-[10px] font-black text-white uppercase italic">
              <span>Integral (I)</span>
              <span>{i}</span>
            </div>
            <input type="range" value={i} onChange={e => setI(parseInt(e.target.value))} className={`w-full ${accentColor}`} />
          </div>
          <div className="space-y-2">
            <div className="flex justify-between text-[10px] font-black text-white uppercase italic">
              <span>Derivativo (D)</span>
              <span>{d}</span>
            </div>
            <input type="range" value={d} onChange={e => setD(parseInt(e.target.value))} className={`w-full ${accentColor}`} />
          </div>
        </div>
      </div>

      <div className="relative aspect-square flex flex-col items-center justify-center p-8 bg-black/40 rounded-[2.5rem] border border-white/5 overflow-hidden">
        <div className="relative transition-transform duration-75 ease-linear w-full h-1 bg-white/10 flex items-center justify-center" style={{ transform: `rotate(${angle}deg)` }}>
          <div className="w-48 h-2 bg-accent-primary rounded-full shadow-[0_0_30px_rgba(163,230,53,0.5)] flex justify-between px-2">
             <div className="w-6 h-6 bg-slate-700 -mt-2 rounded-full border border-white/20 animate-spin"></div>
             <div className="w-6 h-6 bg-slate-700 -mt-2 rounded-full border border-white/20 animate-spin"></div>
          </div>
        </div>
        <div className="absolute w-40 h-[1px] bg-red-500/30 transition-transform duration-100 ease-linear" style={{ transform: `rotate(${targetAngle}deg)` }}></div>
        <div className="absolute bottom-10 text-center">
          <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest mb-1">Status: {Math.abs(angle - targetAngle) < 5 ? 'STABLE' : 'OSCILLATING'}</p>
        </div>
      </div>
    </div>
  );
};
