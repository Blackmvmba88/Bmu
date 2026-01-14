
import React, { useState } from 'react';
import { MambaSnakeIcon } from './MambaSnakeIcon';
import { UserProfile, UserRole } from '../types';

interface NeocyberAuthProps {
  onLogin: (profile: UserProfile) => void;
}

export const NeocyberAuth: React.FC<NeocyberAuthProps> = ({ onLogin }) => {
  const [loading, setLoading] = useState(false);

  const simulateGoogleLogin = () => {
    setLoading(true);
    // Simulación de flujo OAuth de Google
    setTimeout(() => {
      const mockEmail = "iyari.neocyber@gmail.com";
      const savedProfile = localStorage.getItem(`bmu_profile_${mockEmail}`);
      
      let profile: UserProfile;
      
      if (savedProfile) {
        profile = JSON.parse(savedProfile);
      } else {
        profile = {
          uid: Math.random().toString(36).substr(2, 9),
          email: mockEmail,
          displayName: "Iyari Cancino Gomez",
          role: 'Alumno',
          domainPoints: 2450,
          masteryLevels: { '1': 95, '2': 100 },
          lastLogin: Date.now(),
          rank: 'NEOCYBER_ELITE_NODE',
          preferences: {
            rotationDuration: 45,
            themeIdx: 0
          }
        };
      }
      
      localStorage.setItem(`bmu_profile_${mockEmail}`, JSON.stringify(profile));
      localStorage.setItem('bmu_active_session', mockEmail);
      onLogin(profile);
      setLoading(false);
    }, 1200);
  };

  return (
    <div className="fixed inset-0 z-[1000] bg-black flex items-center justify-center p-6">
      <div className="absolute inset-0 opacity-20">
         <div className="absolute inset-0 grid grid-cols-12 grid-rows-12">
           {Array.from({length: 144}).map((_, i) => <div key={i} className="border-[0.5px] border-white/10" />)}
         </div>
      </div>

      <div className="glass p-16 rounded-[4rem] border-2 border-white/10 max-w-xl w-full text-center space-y-12 relative overflow-hidden shadow-[0_0_100px_rgba(0,0,0,0.8)]">
        <div className="absolute -top-32 -left-32 w-64 h-64 accent-bg blur-[100px] opacity-10"></div>
        
        <div className="flex flex-col items-center gap-6 relative z-10">
           <div className="w-24 h-24 accent-bg rounded-[2rem] flex items-center justify-center shadow-2xl animate-pulse">
              <MambaSnakeIcon size={56} className="text-black" />
           </div>
           <div className="space-y-2">
              <h1 className="text-5xl font-black font-display italic tracking-tighter text-white uppercase">
                 BlackMamba <span className="mamba-text">University</span>
              </h1>
              <p className="text-slate-500 font-bold text-xs uppercase tracking-[0.5em]">Central de Nodos Educativos</p>
           </div>
        </div>

        <div className="space-y-8 relative z-10">
           <div className="bg-white/5 p-8 rounded-[2.5rem] border border-white/10 space-y-4">
              <p className="text-slate-300 text-sm font-medium leading-relaxed italic">
                 "El conocimiento es poder. Sincroniza tu cuenta de Google para validar tus credenciales y acceder a la red neuronal."
              </p>
           </div>

           <button 
             onClick={simulateGoogleLogin}
             disabled={loading}
             className="w-full flex items-center justify-center gap-4 bg-white text-black py-6 rounded-3xl font-black text-sm uppercase tracking-widest hover:scale-[1.02] transition-all shadow-