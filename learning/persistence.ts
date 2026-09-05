import type { LearnerState } from './contracts';
import { createLearnerState } from './engine';

const STORAGE_PREFIX = 'bmu_learner_state_v1_';

const storageKey = (learnerId: string): string => `${STORAGE_PREFIX}${learnerId}`;

const isRecord = (value: unknown): value is Record<string, unknown> =>
  typeof value === 'object' && value !== null && !Array.isArray(value);

const isStringArray = (value: unknown): value is string[] =>
  Array.isArray(value) && value.every((item) => typeof item === 'string');

const isFiniteNumber = (value: unknown): value is number =>
  typeof value === 'number' && Number.isFinite(value);

const isPracticeProgress = (value: unknown): boolean => {
  if (!isRecord(value)) return false;

  for (const key of [
    'attempts',
    'scoreTotal',
    'successfulAttempts',
    'currentStreak',
    'bestStreak',
  ]) {
    if (!isFiniteNumber(value[key]) || Number(value[key]) < 0) return false;
  }

  if (!isStringArray(value.variantIds)) return false;
  if (value.lastScore !== undefined && !isFiniteNumber(value.lastScore)) return false;

  return true;
};

export const isLearnerState = (
  value: unknown,
  expectedLearnerId?: string,
): value is LearnerState => {
  if (!isRecord(value)) return false;

  if (value.schemaVersion !== 1 || typeof value.learnerId !== 'string') {
    return false;
  }

  if (expectedLearnerId && value.learnerId !== expectedLearnerId) {
    return false;
  }

  if (!isRecord(value.competencies)) return false;
  if (!isStringArray(value.completedModules)) return false;
  if (!Array.isArray(value.artifacts)) return false;
  if (!isStringArray(value.processedEventIds)) return false;
  if (typeof value.updatedAt !== 'string') return false;

  for (const progress of Object.values(value.competencies)) {
    if (!isRecord(progress)) return false;
    if (!isFiniteNumber(progress.mastery)) return false;
    if (progress.mastery < 0 || progress.mastery > 1) return false;
    if (!isStringArray(progress.evidenceIds)) return false;
    if (progress.practice !== undefined && !isPracticeProgress(progress.practice)) {
      return false;
    }
    if (
      progress.lastDemonstratedAt !== undefined &&
      typeof progress.lastDemonstratedAt !== 'string'
    ) {
      return false;
    }
    if (
      progress.lastReviewAt !== undefined &&
      typeof progress.lastReviewAt !== 'string'
    ) {
      return false;
    }
    if (
      progress.lastUpdatedAt !== undefined &&
      typeof progress.lastUpdatedAt !== 'string'
    ) {
      return false;
    }
  }

  return true;
};

export const loadLearnerState = (learnerId: string): LearnerState => {
  if (typeof window === 'undefined') {
    return createLearnerState(learnerId);
  }

  const raw = window.localStorage.getItem(storageKey(learnerId));
  if (!raw) return createLearnerState(learnerId);

  try {
    const parsed: unknown = JSON.parse(raw);
    return isLearnerState(parsed, learnerId)
      ? parsed
      : createLearnerState(learnerId);
  } catch {
    return createLearnerState(learnerId);
  }
};

export const saveLearnerState = (state: LearnerState): void => {
  if (typeof window === 'undefined') return;
  window.localStorage.setItem(storageKey(state.learnerId), JSON.stringify(state));
};

export const resetLearnerState = (learnerId: string): LearnerState => {
  const fresh = createLearnerState(learnerId);
  if (typeof window !== 'undefined') {
    window.localStorage.removeItem(storageKey(learnerId));
  }
  return fresh;
};
