import React, { useMemo, useState } from 'react';
import { monthlyFractionReviewQuestions } from '../learning/fractionVariants';

interface FractionRetentionReviewProps {
  minimumScore: number;
  onComplete: (score: number, variantIds: string[]) => void;
  onCancel?: () => void;
}

export const FractionRetentionReview: React.FC<FractionRetentionReviewProps> = ({
  minimumScore,
  onComplete,
  onCancel,
}) => {
  const [round, setRound] = useState(0);
  const [questionIndex, setQuestionIndex] = useState(0);
  const [selectedIndex, setSelectedIndex] = useState<number | null>(null);
  const [correctCount, setCorrectCount] = useState(0);
  const [lastScore, setLastScore] = useState<number | null>(null);

  const questions = useMemo(
    () => monthlyFractionReviewQuestions(new Date(), 4, round),
    [round],
  );
  const question = questions[questionIndex];

  const submitAnswer = () => {
    if (selectedIndex === null) return;

    const correct = selectedIndex === question.correctIndex;
    const nextCorrectCount = correctCount + (correct ? 1 : 0);
    const isLast = questionIndex === questions.length - 1;

    if (!isLast) {
      setCorrectCount(nextCorrectCount);
      setQuestionIndex((index) => index + 1);
      setSelectedIndex(null);
      return;
    }

    const score = nextCorrectCount / questions.length;
    setLastScore(score);
    onComplete(score, questions.map((item) => item.id));
  };

  const retryFreshSet = () => {
    setRound((value) => value + 1);
    setQuestionIndex(0);
    setSelectedIndex(null);
    setCorrectCount(0);
    setLastScore(null);
  };

  if (lastScore !== null) {
    const passed = lastScore >= minimumScore;
    return (
      <div className="glass p-10 rounded-[3rem] border border-white/10 max-w-3xl mx-auto space-y-8">
        <div className="space-y-3">
          <span className="text-[9px] font-black uppercase tracking-[0.4em] accent-text">Repaso de retención</span>
          <h3 className="text-4xl font-black text-white italic tracking-tighter">
            {passed ? 'DOMINIO FRESCO' : 'UNA VUELTA MÁS'}
          </h3>
          <p className="text-slate-400 text-sm leading-relaxed">
            Resultado: {Math.round(lastScore * 100)}%. {passed
              ? 'El conocimiento sigue estable. El siguiente repaso se programará desde esta demostración.'
              : 'No pasa nada: corrige rápido y repite con otro conjunto de preguntas. Tu historial no se borra.'}
          </p>
        </div>

        {!passed && (
          <button
            onClick={retryFreshSet}
            className="w-full py-4 rounded-2xl accent-bg text-black text-[10px] font-black uppercase tracking-[0.3em] hover:scale-[1.02] transition-transform"
          >
            Repetir con variantes nuevas
          </button>
        )}

        {passed && onCancel && (
          <button
            onClick={onCancel}
            className="w-full py-4 rounded-2xl border border-white/10 text-white text-[10px] font-black uppercase tracking-[0.3em] hover:bg-white/5 transition-colors"
          >
            Volver al mapa
          </button>
        )}
      </div>
    );
  }

  return (
    <div className="glass p-10 rounded-[3rem] border border-white/10 max-w-3xl mx-auto space-y-8">
      <div className="flex items-start justify-between gap-6">
        <div className="space-y-3">
          <span className="text-[9px] font-black uppercase tracking-[0.4em] accent-text">Microexamen mensual</span>
          <h3 className="text-4xl font-black text-white italic tracking-tighter">SENTIDO NUMÉRICO</h3>
          <p className="text-slate-400 text-sm">
            Cuatro preguntas cortas. No son las mismas de práctica: cambia la representación para comprobar comprensión real.
          </p>
        </div>
        <span className="text-sm font-black text-slate-500">{questionIndex + 1}/{questions.length}</span>
      </div>

      <div className="bg-black/30 p-8 rounded-[2rem] border border-white/5 space-y-6">
        <p className="text-xl font-black text-white leading-relaxed">{question.prompt}</p>
        <div className="grid gap-3">
          {question.options.map((option, index) => (
            <button
              key={option}
              onClick={() => setSelectedIndex(index)}
              className={`text-left p-4 rounded-2xl border transition-all ${selectedIndex === index ? 'border-accent-primary bg-accent-primary/10 text-white' : 'border-white/5 bg-white/[0.02] text-slate-400 hover:text-white hover:border-white/10'}`}
            >
              <span className="font-black">{option}</span>
            </button>
          ))}
        </div>
      </div>

      <div className="flex gap-3">
        {onCancel && (
          <button
            onClick={onCancel}
            className="px-6 py-4 rounded-2xl border border-white/10 text-slate-400 text-[10px] font-black uppercase tracking-widest hover:text-white"
          >
            Salir
          </button>
        )}
        <button
          onClick={submitAnswer}
          disabled={selectedIndex === null}
          className={`flex-1 py-4 rounded-2xl text-[10px] font-black uppercase tracking-[0.3em] transition-all ${selectedIndex !== null ? 'accent-bg text-black hover:scale-[1.01]' : 'bg-white/5 text-slate-700 cursor-not-allowed'}`}
        >
          {questionIndex === questions.length - 1 ? 'Cerrar repaso' : 'Siguiente'}
        </button>
      </div>
    </div>
  );
};
