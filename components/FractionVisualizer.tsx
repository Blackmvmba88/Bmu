import React, { useMemo, useState } from 'react';

export interface FractionAttempt {
  challengeId: string;
  selectedNumerator: number;
  selectedDenominator: number;
  targetNumerator: number;
  targetDenominator: number;
  correct: boolean;
}

interface FractionVisualizerProps {
  theme?: 'mamba' | 'pao';
  onAttempt?: (attempt: FractionAttempt) => void;
}

interface FractionChallenge {
  id: string;
  numerator: number;
  denominator: number;
}

const CHALLENGES: FractionChallenge[] = [
  { id: 'fraction-ratio-3-of-8', numerator: 3, denominator: 8 },
  { id: 'fraction-ratio-2-of-5', numerator: 2, denominator: 5 },
  { id: 'fraction-ratio-4-of-7', numerator: 4, denominator: 7 },
  { id: 'fraction-ratio-5-of-9', numerator: 5, denominator: 9 },
  { id: 'fraction-ratio-3-of-4', numerator: 3, denominator: 4 },
  { id: 'fraction-ratio-5-of-8', numerator: 5, denominator: 8 },
];

export const FractionVisualizer: React.FC<FractionVisualizerProps> = ({
  theme = 'mamba',
  onAttempt,
}) => {
  const [challengeIndex, setChallengeIndex] = useState(0);
  const [slicesSelected, setSlicesSelected] = useState(2);
  const [totalSlices, setTotalSlices] = useState(8);
  const [totalWeight] = useState(1000);
  const [challengeResult, setChallengeResult] = useState<'correct' | 'incorrect' | null>(null);

  const challenge = CHALLENGES[challengeIndex];
  const percentage = ((slicesSelected / totalSlices) * 100).toFixed(0);
  const weightPerSlice = totalWeight / totalSlices;
  const currentWeight = (slicesSelected * weightPerSlice).toFixed(0);
  const accentColor = 'var(--accent-primary)';

  const slicePaths = useMemo(() => {
    const paths = [];
    const centerX = 150;
    const centerY = 150;
    const radius = 135;
    const angleStep = (2 * Math.PI) / totalSlices;

    for (let i = 0; i < totalSlices; i++) {
      const startAngle = i * angleStep - Math.PI / 2;
      const endAngle = (i + 1) * angleStep - Math.PI / 2;
      const x1 = centerX + radius * Math.cos(startAngle);
      const y1 = centerY + radius * Math.sin(startAngle);
      const x2 = centerX + radius * Math.cos(endAngle);
      const y2 = centerY + radius * Math.sin(endAngle);
      const largeArcFlag = angleStep > Math.PI ? 1 : 0;

      paths.push({
        id: i,
        d: [
          `M ${centerX} ${centerY}`,
          `L ${x1} ${y1}`,
          `A ${radius} ${radius} 0 ${largeArcFlag} 1 ${x2} ${y2}`,
          'Z',
        ].join(' '),
        isSelected: i < slicesSelected,
      });
    }
    return paths;
  }, [totalSlices, slicesSelected]);

  const validateChallenge = () => {
    const correct =
      slicesSelected === challenge.numerator &&
      totalSlices === challenge.denominator;

    setChallengeResult(correct ? 'correct' : 'incorrect');
    onAttempt?.({
      challengeId: challenge.id,
      selectedNumerator: slicesSelected,
      selectedDenominator: totalSlices,
      targetNumerator: challenge.numerator,
      targetDenominator: challenge.denominator,
      correct,
    });
  };

  const retryChallenge = () => {
    setChallengeResult(null);
  };

  const nextChallenge = () => {
    const nextIndex = (challengeIndex + 1) % CHALLENGES.length;
    const next = CHALLENGES[nextIndex];
    const starterDenominator = Math.max(2, next.numerator, next.denominator - 1);
    const starterNumerator = Math.max(1, Math.min(next.numerator - 1, starterDenominator));

    setChallengeIndex(nextIndex);
    setTotalSlices(starterDenominator);
    setSlicesSelected(starterNumerator);
    setChallengeResult(null);
  };

  return (
    <div className="p-10 glass rounded-[3rem] space-y-12 border shadow-2xl relative overflow-hidden transition-all duration-500 accent-border border-opacity-20">
      <div className="absolute -top-32 -left-32 w-80 h-80 blur-[120px] rounded-full opacity-10 accent-bg transition-colors duration-1000" />

      <div className="flex flex-col xl:flex-row gap-16 items-center">
        <div className="flex-1 space-y-10 w-full relative z-10">
          <div className="space-y-2">
            <h3 className="text-4xl md:text-5xl font-black font-display text-main italic uppercase tracking-tighter leading-none">
              Rueda de <span className="mamba-text block md:inline">Fracciones</span>
            </h3>
            <p className="text-slate-500 font-bold text-xs uppercase tracking-[0.4em] flex items-center gap-2">
              <span className="w-2 h-2 rounded-full accent-bg animate-ping" />
              Repite rápido • comprende • cambia de variante
            </p>
          </div>

          <div className="bg-black/30 p-6 rounded-[2rem] border border-white/5 space-y-4">
            <span className="text-[9px] font-black accent-text uppercase tracking-[0.35em]">Misión verificable</span>
            <p className="text-white font-black text-xl">
              Representa exactamente <span className="mamba-text">{challenge.numerator}/{challenge.denominator}</span> en la rueda.
            </p>
            <p className="text-slate-500 text-xs">
              Si fallas, corriges de inmediato. Cuando lo resuelves, la siguiente misión cambia para comprobar que entendiste el concepto y no una respuesta concreta.
            </p>
          </div>

          <div className="space-y-8 bg-white/[0.02] p-8 rounded-[2rem] border border-white/5 shadow-inner">
            <div className="space-y-4">
              <div className="flex justify-between items-end">
                <label className="text-[11px] font-black uppercase tracking-widest accent-text italic">Slices (Numerador)</label>
                <span className="text-4xl font-black text-main leading-none">{slicesSelected}</span>
              </div>
              <input
                type="range"
                min="1"
                max={totalSlices}
                value={slicesSelected}
                onChange={(e) => {
                  setSlicesSelected(parseInt(e.target.value));
                  setChallengeResult(null);
                }}
                className="w-full h-4 bg-slate-800 rounded-full appearance-none cursor-pointer border border-white/5"
              />
            </div>

            <div className="space-y-4">
              <div className="flex justify-between items-end">
                <label className="text-[11px] font-black uppercase tracking-widest opacity-60 italic">Cortes (Denominador)</label>
                <span className="text-3xl font-black text-slate-400 leading-none">{totalSlices}</span>
              </div>
              <input
                type="range"
                min="2"
                max="16"
                step="1"
                value={totalSlices}
                onChange={(e) => {
                  const val = parseInt(e.target.value);
                  setTotalSlices(val);
                  if (slicesSelected > val) setSlicesSelected(val);
                  setChallengeResult(null);
                }}
                className="w-full h-4 bg-slate-800 rounded-full appearance-none cursor-pointer border border-white/5"
              />
            </div>

            {!challengeResult && (
              <button
                onClick={validateChallenge}
                className="w-full py-4 rounded-2xl accent-bg text-black text-[10px] font-black uppercase tracking-[0.3em] hover:scale-[1.02] transition-transform"
              >
                Validar misión {challenge.numerator}/{challenge.denominator}
              </button>
            )}

            {challengeResult === 'incorrect' && (
              <div className="space-y-4">
                <div className="p-4 rounded-2xl border border-red-500/20 text-red-300 bg-red-500/5 space-y-2">
                  <p className="text-xs font-black uppercase tracking-widest">
                    Todavía no: tienes {slicesSelected}/{totalSlices}.
                  </p>
                  <p className="text-xs text-slate-400">
                    Piensa así: el denominador dice cuántas partes iguales existen; el numerador cuántas seleccionas. Aquí necesitas {challenge.denominator} partes y seleccionar {challenge.numerator}.
                  </p>
                </div>
                <button
                  onClick={retryChallenge}
                  className="w-full py-4 rounded-2xl border border-accent-primary/30 text-accent-primary text-[10px] font-black uppercase tracking-[0.3em] hover:bg-accent-primary/5 transition-colors"
                >
                  Corregir y repetir
                </button>
              </div>
            )}

            {challengeResult === 'correct' && (
              <div className="space-y-4">
                <div className="p-4 rounded-2xl border border-accent-primary/30 text-accent-primary bg-accent-primary/5 text-xs font-black uppercase tracking-widest">
                  Evidencia aceptada. Ahora demuestra la misma idea con otra fracción.
                </div>
                <button
                  onClick={nextChallenge}
                  className="w-full py-4 rounded-2xl accent-bg text-black text-[10px] font-black uppercase tracking-[0.3em] hover:scale-[1.02] transition-transform"
                >
                  Siguiente variante
                </button>
              </div>
            )}
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
            {[
              { label: 'PROPORCIÓN', val: `${percentage}%`, color: 'accent-text' },
              { label: 'PESO ESTIMADO', val: `${currentWeight}g`, color: 'accent-text' },
              { label: 'VALOR FRACCIÓN', val: `${slicesSelected}/${totalSlices}`, color: 'text-main' },
            ].map((box) => (
              <div key={box.label} className="bg-black/30 p-6 rounded-3xl border border-white/5 text-center transition-all hover:scale-105 hover:border-white/10 group">
                <span className="block text-[9px] uppercase tracking-widest text-slate-500 font-black mb-3">{box.label}</span>
                <span className={`text-3xl font-black ${box.color} group-hover:scale-110 transition-transform block`}>{box.val}</span>
              </div>
            ))}
          </div>
        </div>

        <div className="w-full max-w-[450px] aspect-square relative flex items-center justify-center p-6 group">
          <div className="absolute inset-0 rounded-full blur-[60px] opacity-20 transition-colors duration-1000 accent-bg" />

          <svg viewBox="0 0 300 300" className="w-full h-full drop-shadow-[0_0_50px_rgba(0,0,0,0.8)] relative z-10 transition-transform duration-500 group-hover:rotate-6">
            <circle cx="150" cy="150" r="148" fill="none" stroke="currentColor" strokeWidth="4" className="text-white/5" />
            {slicePaths.map((slice, i) => (
              <path
                key={slice.id}
                d={slice.d}
                onClick={() => {
                  setSlicesSelected(i + 1);
                  setChallengeResult(null);
                }}
                fill={slice.isSelected ? accentColor : '#111'}
                className="cursor-pointer transition-all duration-300 stroke-[#000]/60 stroke-[2] hover:opacity-90"
                style={{
                  filter: slice.isSelected ? 'drop-shadow(0 0 15px var(--accent-primary))' : 'none',
                  transformOrigin: '150px 150px',
                  transform: slice.isSelected ? 'scale(1.03)' : 'scale(1)',
                }}
              />
            ))}
            <circle cx="150" cy="150" r="35" className="fill-black stroke-white/20 stroke-2" />
            <text x="150" y="157" textAnchor="middle" fill="currentColor" className="text-[12px] font-black pointer-events-none uppercase tracking-tighter accent-text">
              {theme === 'mamba' ? 'Mamba' : 'Pao'}
            </text>
          </svg>

          <div className="absolute -top-4 -right-4 accent-bg px-6 py-3 rounded-2xl shadow-2xl transform rotate-3">
            <p className="text-[10px] font-black text-contrast uppercase tracking-widest whitespace-nowrap">
              {slicesSelected} de {totalSlices} rebanadas
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
