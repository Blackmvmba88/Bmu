
import React, { useState, useEffect, useRef } from 'react';
import { MathTab, UserRole, UserProfile, BMU_Theme } from './types';
import { FractionVisualizer } from './components/FractionVisualizer';
import { AICoach } from './components/AICoach';
import { BlackMambaRoadmap } from './components/BlackMambaRoadmap';
import { MambaLab } from './components/MambaLab';
import { BMUPhysics } from './components/BMUPhysics';
import { MathTricks } from './components/MathTricks';
import { MasteryMap } from './components/MasteryMap';
import { MambaCircuits } from './components/MambaCircuits';
import { MambaSnakeIcon } from './components/MambaSnakeIcon';
import { NeocyberAuth } from './components/NeocyberAuth';
import { GoogleGenAI } from "@google/genai";

const BMU_THEMES: BMU_Theme[] = [
  { name: 'Mamba Green', accent: '#a3e635', secondary: '#10b981', highlight: '#fbbf24' },
  { name: 'Cyber Pink', accent: '#f472b6', secondary: '#db2777', highlight: '#fbcfe8' },
  { name: 'Electric Blue', accent: '#60a5fa', secondary: '#3b82f6', highlight: '#93c5fd' },
  { name: 'Solar Gold', accent: '#fbbf24', secondary: '#f59e0b', highlight: '#fde68a' },
  { name: 'Plasma Purple', accent: '#a78bfa', secondary: '#8b5cf6', highlight: '#ddd6fe' },
  { name: 'Acid Orange', accent: '#f97316', secondary: '#ea580c', highlight: '#fdba74' },
];

const App: React.FC = () => {
  const [currentUser, setCurrentUser] = useState<UserProfile | null>(null);
  const [activeTab, setActiveTab] = useState<MathTab>(MathTab.FRACTIONS);
  const [currentThemeIdx, setCurrentThemeIdx] = useState(0);
  const [rotationDuration, setRotationDuration] = useState(120);
  const [timeLeftForChange, setTimeLeftForChange] = useState(rotationDuration);

  // --- Idle Detection System ---
  const [isIdle, setIsIdle] = useState(false);
  const [idleMessage, setIdleMessage] = useState<string | null>(null);
  const idleTimerRef = useRef<number | null>(null);
  const IDLE_THRESHOLD = 30000; 

  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

  // Persistence Check on Load
  useEffect(() => {
    const activeEmail = localStorage.getItem('bmu_active_session');
    if (activeEmail) {
      const profile = localStorage.getItem(`bmu_profile_${activeEmail}`);
      if (profile) {
        const parsed = JSON.parse(profile) as UserProfile;
        setCurrentUser(parsed);
        setCurrentThemeIdx(parsed.preferences?.themeIdx || 0);
        setRotationDuration(parsed.preferences?.rotationDuration || 120);
        setTimeLeftForChange(parsed.preferences?.rotationDuration || 120);
      }
    }
  }, []);

  // Update Theme CSS Variables
  useEffect(() => {
    const theme = BMU_THEMES[currentThemeIdx];
    document.documentElement.style.setProperty('--accent-primary', theme.accent);
    document.documentElement.style.setProperty('--accent-secondary', theme.secondary);
    document.documentElement.style.setProperty('--accent-highlight', theme.highlight);
    document.documentElement.style.setProperty('--accent-glow', `${theme.accent}66`); 
    
    // Auto-save preference if user logged in
    if (currentUser) {
      const updated = { ...currentUser, preferences: { ...currentUser.preferences, themeIdx: currentThemeIdx } };
      localStorage.setItem(`bmu_profile_${currentUser.email}`, JSON.stringify(updated));
    }
  }, [currentThemeIdx, currentUser]);

  // Logic for color rotation
  useEffect(() => {
    const rotationInterval = setInterval(() => {
      setCurrentThemeIdx(prev => (prev + 1) % BMU_THEMES.length);
      setTimeLeftForChange(rotationDuration);
    }, rotationDuration * 1000);

    return () => clearInterval(rotationInterval);
  }, [rotationDuration]);

  // Logic for the countdown timer
  useEffect(() => {
    const countdownInterval = setInterval(() => {
      setTimeLeftForChange(prev => Math.max(0, prev - 1));
    }, 1000);

    return () => clearInterval(countdownInterval);
  }, [rotationDuration, currentThemeIdx]);

  const resetIdleTimer = () => {
    if (isIdle) {
      setIsIdle(false);
      setIdleMessage(null);
    }
    if (idleTimerRef.current) window.clearTimeout(idleTimerRef.current);
    idleTimerRef.current = window.setTimeout(triggerIdleState, IDLE_THRESHOLD);
  };

  const triggerIdleState = async () => {
    if (!currentUser) return;
    setIsIdle(true);
    try {
      const response = await ai.models.generateContent({
        model: 'gemini-3-flash-preview',
        contents: `${currentUser.displayName} está inactivo. Dale un consejo breve (max 15 palabras) sobre explorar la pestaña "${activeTab}" o menciónale que hay trucos nuevos en la sección de TRUCOS. Sé cool y directo.`,
      });
      setIdleMessage(response.text || "La inactividad es el enemigo del progreso. Reanuda el protocolo.");
    } catch (e) {
      setIdleMessage("Iyari, el sistema espera tu siguiente comando.");
    }
  };

  useEffect(() => {
    window.addEventListener('mousemove', resetIdleTimer);
    window.addEventListener('keydown', resetIdleTimer);
    resetIdleTimer();
    return () => {
      window.removeEventListener('mousemove', resetIdleTimer);
      window.removeEventListener('keydown', resetIdleTimer);
      if (idleTimerRef.current) window.clearTimeout(idleTimerRef.current);
    };
  }, [activeTab, currentUser]);

  const logout = () => {
    localStorage.removeItem('bmu_active_session');
    setCurrentUser(null);
  };

  if (!currentUser) {
    return <NeocyberAuth onLogin={setCurrentUser} />;
  }

  const navItems = {
    Alumno: [
      { id: MathTab.MASTERY_MAP, label: 'MAPA' },
      { id: MathTab.FRACTIONS, label: 'FRACCIONES' },
      { id: MathTab.CIRCUITS, label: 'CIRCUITOS' },
      { id: MathTab.PHYSICS_BMU, label: 'FÍSICA' },
      { id: MathTab.CHEMISTRY_BMU, label: 'QUÍMICA' },
      { id: MathTab.TRICKS, label: 'TRUCOS' },
      { id: MathTab.AI_TUTOR, label: 'SENTINEL AI' },
      { id: MathTab.ROADMAP, label: 'MISIÓN' },
    ],
    Mentor: [
      { id: MathTab.TELEMETRIA, label: 'MÉTRICAS' },
      { id: MathTab.AI_TUTOR, label: 'ASESORÍA' },
      { id: MathTab.ROADMAP, label: 'PLANEACIÓN' },
    ],
    Maestro: [
      { id: MathTab.FRACTIONS, label: 'MODULOS' },
      { id: MathTab.TELEMETRIA, label: 'ROOT_METRICS' },
    ],
    Creador: [
      { id: MathTab.FRACTIONS, label: 'EDITOR' },
      { id: MathTab.TELEMETRIA, label: 'GLOBAL_FLOW' },
    ]
  };

  return (
    <div className="min-h-screen pb-10">
      <div className="w-full mamba-gradient py-2 px-6 flex justify-between items-center sticky top-0 z-[100] shadow-2xl overflow-hidden">
        <div className="flex gap-4 items-center">
           <MambaSnakeIcon size={18} className="text-contrast" />
           <span className="text-contrast text-[9px] font-black uppercase tracking-[0.4em]">BLACKMAMBA UNIVERSITY • {currentUser.rank}</span>
           <div className="h-1.5 w-32 bg-black/20 rounded-full relative overflow-hidden hidden md:block">
              <div 
                className="h-full bg-black/60 transition-all duration-1000" 
                style={{ width: `${(timeLeftForChange / rotationDuration) * 100}%` }}
              ></div>
           </div>
        </div>

        <div className="flex items-center gap-6">
          <div className="flex items-center gap-3 bg-black/20 px-4 py-1 rounded-full border border-black/10">
             <span className="text-contrast text-[9px] font-black opacity-60">SYNC_FREQ:</span>
             <input 
               type="range" 
               min="5" 
               max="300" 
               step="5"
               value={rotationDuration}
               onChange={(e) => {
                 const val = parseInt(e.target.value);
                 setRotationDuration(val);
                 setTimeLeftForChange(val);
                 if (currentUser) {
                    const updated = { ...currentUser, preferences: { ...currentUser.preferences, rotationDuration: val } };
                    localStorage.setItem(`bmu_profile_${currentUser.email}`, JSON.stringify(updated));
                 }
               }}
               className="w-20 h-1 accent-black cursor-pointer opacity-40 hover:opacity-100 transition-opacity"
             />
             <span className="text-contrast text-[11px] font-black font-mono w-10">{rotationDuration}s</span>
          </div>
          
          <div className="flex items-center gap-3">
            <span className="text-contrast text-[11px] font-black font-mono bg-black/20 px-3 py-0.5 rounded-full">{BMU_THEMES[currentThemeIdx].name.toUpperCase()}</span>
            <span className="text-contrast text-[11px] font-black font-mono w-8 text-right">{timeLeftForChange}s</span>
          </div>
        </div>
      </div>

      <header className="glass px-6 py-6 flex flex-col xl:flex-row justify-between items-center gap-6 sticky top-10 z-50 mx-4 rounded-b-[2rem] mt-2 shadow-[0_20px_50px_rgba(0,0,0,0.5)]">
        <div className="flex items-center gap-6">
          <div className="bg-white/5 p-1.5 rounded-2xl border border-white/10 flex items-center gap-2">
             <div className="w-10 h-10 accent-bg rounded-xl flex items-center justify-center font-black text-black">
                {currentUser.displayName[0]}
             </div>
             <div className="pr-4">
                <span className="text-[10px] font-black text-white block leading-none">{currentUser.displayName.toUpperCase()}</span>
                <span className="text-[8px] font-bold text-slate-500 uppercase tracking-widest">{currentUser.role}</span>
             </div>
          </div>
          <button 
            onClick={logout}
            className="text-[9px] font-black text-red-500 hover:text-red-400 uppercase tracking-widest bg-red-500/5 px-3 py-2 rounded-lg border border-red-500/10 transition-all"
          >
            Cerrar Nodo
          </button>
        </div>

        <nav className="flex flex-wrap justify-center gap-2 bg-black/40 p-2 rounded-3xl border border-white/5 backdrop-blur-xl">
          {navItems[currentUser.role as UserRole].map((item) => (
            <button 
              key={item.id}
              onClick={() => setActiveTab(item.id as MathTab)}
              className={`px-6 py-3 rounded-2xl text-[10px] font-black tracking-widest transition-all ${activeTab === item.id ? 'accent-bg text-contrast scale-105 shadow-xl' : 'text-slate-500 hover:text-white hover:bg-white/5'}`}
            >
              {item.label}
            </button>
          ))}
        </nav>

        <div className="text-right flex items-center gap-3">
           <MambaSnakeIcon size={32} className="accent-text" />
           <div className="flex flex-col items-end">
              <span className="text-lg font-black font-display italic mamba-text tracking-tighter leading-none">
                {currentUser.domainPoints} DP
              </span>
              <span className="text-[8px] font-black text-slate-600 uppercase tracking-widest">Iyari_Mastery</span>
           </div>
        </div>
      </header>

      {/* SENTINEL IDLE OVERLAY */}
      {isIdle && (
        <div className="fixed bottom-12 left-1/2 -translate-x-1/2 z-[200] w-full max-w-xl animate-in slide-in-from-bottom-12 duration-1000 px-4">
           <div className="glass p-10 rounded-[3.5rem] border-2 border-accent-primary relative group overflow-hidden bg-black/95 shadow-[0_0_100px_var(--accent-glow)]">
              <div className="absolute inset-0 bg-accent-primary/5 animate-pulse"></div>
              <div className="relative z-10 flex flex-col md:flex-row items-center gap-8">
                 <div className="w-20 h-20 accent-bg rounded-full flex items-center justify-center shadow-2xl shrink-0">
                    <MambaSnakeIcon size={48} className="text-black" />
                 </div>
                 <div className="space-y-3">
                    <div className="flex items-center gap-3">
                       <span className="w-2 h-2 rounded-full bg-red-500 animate-ping"></span>
                       <span className="text-[10px] font-black uppercase tracking-[0.5em] accent-text">Iyari's Biological Scanner</span>
                    </div>
                    <p className="text-white font-black italic text-2xl leading-tight">
                      {idleMessage || `Iyari Cancino, el sistema espera órdenes.`}
                    </p>
                    <p className="text-slate-500 text-[9px] uppercase font-bold tracking-widest">Interacción detectada para reactivar</p>
                 </div>
              </div>
           </div>
        </div>
      )}

      <main className="max-w-7xl mx-auto p-6 lg:p-12 min-h-[70vh]">
        <div className="animate-in fade-in slide-in-from-bottom-8 duration-1000">
          {activeTab === MathTab.MASTERY_MAP && <MasteryMap />}
          {activeTab === MathTab.FRACTIONS && <FractionVisualizer theme={currentUser.role === 'Alumno' ? 'mamba' : 'pao'} />}
          {activeTab === MathTab.CIRCUITS && <MambaCircuits />}
          {activeTab === MathTab.PHYSICS_BMU && <BMUPhysics theme={currentUser.role === 'Alumno' ? 'mamba' : 'pao'} />}
          {activeTab === MathTab.CHEMISTRY_BMU && <MambaLab theme={currentUser.role === 'Alumno' ? 'mamba' : 'pao'} />}
          {activeTab === MathTab.TRICKS && <MathTricks />}
          {activeTab === MathTab.ROADMAP && <BlackMambaRoadmap />}
          {activeTab === MathTab.AI_TUTOR && <AICoach theme={currentUser.role === 'Alumno' ? 'mamba' : 'pao'} userName={currentUser.displayName} />}
          
          {activeTab === MathTab.TELEMETRIA && (
            <div className="glass p-12 rounded-[3rem] text-center space-y-12 border-dashed border-2 border-white/10 relative overflow-hidden">
               <h3 className="text-5xl font-black mamba-text italic tracking-tighter">ESTADO BIOMÉTRICO: IYARI</h3>
               <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                  <div className="bg-white/5 p-10 rounded-[2.5rem] border border-white/5">
                    <span className="living-symbol text-2xl mb-4">🌀</span>
                    <span className="text-[10px] text-slate-500 font-black block mb-4 uppercase tracking-widest">Frecuencia Sync</span>
                    <span className="text-5xl font-black text-white">{rotationDuration}s</span>
                  </div>
                  <div className="bg-white/5 p-10 rounded-[2.5rem] border border-white/5 group">
                    <span className="living-symbol text-2xl mb-4">🔋</span>
                    <span className="text-[10px] text-slate-500 font-black block mb-4 uppercase tracking-widest">Iyari's Resonance</span>
                    <span className="text-5xl font-black text-accent-primary group-hover:scale-110 transition-transform block">OPTIMAL</span>
                  </div>
                  <div className="bg-white/5 p-10 rounded-[2.5rem] border border-white/5">
                    <span className="living-symbol text-2xl mb-4">⛓️</span>
                    <span className="text-[10px] text-slate-500 font-black block mb-4 uppercase tracking-widest">Network Latency</span>
                    <span className="text-5xl font-black text-white">1ms</span>
                  </div>
               </div>
            </div>
          )}
        </div>
      </main>

      <footer className="mt-32 border-t border-white/5 p-12 text-center space-y-8">
        <div className="flex justify-center gap-12 opacity-30 text-[9px] font-black uppercase tracking-[0.4em]">
           <span>Iyari Cancino Gomez Interface v17</span>
           <span>Google Node Sync Active</span>
           <span>BlackMamba University</span>
        </div>
        <p className="text-[11px] font-black mamba-text uppercase tracking-[1em]">The Future is Iyari 👑</p>
      </footer>
    </div>
  );
};

export default App;
