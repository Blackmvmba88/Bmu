export interface FractionVariant {
  id: string;
  numerator: number;
  denominator: number;
}

export interface FractionRetentionQuestion {
  id: string;
  prompt: string;
  options: string[];
  correctIndex: number;
}

export const FRACTION_PRACTICE_VARIANTS: FractionVariant[] = [
  { id: 'fraction-ratio-3-of-8', numerator: 3, denominator: 8 },
  { id: 'fraction-ratio-2-of-5', numerator: 2, denominator: 5 },
  { id: 'fraction-ratio-4-of-7', numerator: 4, denominator: 7 },
  { id: 'fraction-ratio-5-of-9', numerator: 5, denominator: 9 },
  { id: 'fraction-ratio-3-of-4', numerator: 3, denominator: 4 },
  { id: 'fraction-ratio-5-of-8', numerator: 5, denominator: 8 },
];

export const FRACTION_RETENTION_QUESTION_BANK: FractionRetentionQuestion[] = [
  {
    id: 'fraction-review-percent-50',
    prompt: '¿Qué fracción representa exactamente 50%?',
    options: ['1/2', '1/3', '2/5'],
    correctIndex: 0,
  },
  {
    id: 'fraction-review-words-3-of-4',
    prompt: 'Si eliges 3 de 4 partes iguales, ¿qué fracción tienes?',
    options: ['3/4', '4/3', '2/4'],
    correctIndex: 0,
  },
  {
    id: 'fraction-review-percent-2-of-5',
    prompt: 'Dos de cinco partes iguales equivalen a…',
    options: ['20%', '40%', '50%'],
    correctIndex: 1,
  },
  {
    id: 'fraction-review-equivalent-half',
    prompt: '¿Cuál de estas fracciones es equivalente a 1/2?',
    options: ['2/4', '2/3', '3/5'],
    correctIndex: 0,
  },
  {
    id: 'fraction-review-words-1-of-4',
    prompt: 'Una de cuatro partes iguales representa…',
    options: ['25%', '40%', '75%'],
    correctIndex: 0,
  },
  {
    id: 'fraction-review-percent-75',
    prompt: '¿Qué fracción representa 75%?',
    options: ['3/4', '2/5', '4/5'],
    correctIndex: 0,
  },
  {
    id: 'fraction-review-remaining',
    prompt: 'Si usaste 2 de 8 partes, ¿qué fracción queda sin usar?',
    options: ['6/8', '2/6', '4/8'],
    correctIndex: 0,
  },
  {
    id: 'fraction-review-compare',
    prompt: '¿Cuál es mayor?',
    options: ['1/4', '1/2', 'Son iguales'],
    correctIndex: 1,
  },
];

export const monthlyFractionReviewQuestions = (
  date = new Date(),
  count = 4,
  round = 0,
): FractionRetentionQuestion[] => {
  const bank = FRACTION_RETENTION_QUESTION_BANK;
  const monthSeed = date.getUTCFullYear() * 12 + date.getUTCMonth();
  const offset = (monthSeed + round * count) % bank.length;

  return Array.from({ length: Math.min(count, bank.length) }, (_, index) =>
    bank[(offset + index) % bank.length],
  );
};
