import type { BMULearningEvent } from './contracts';

export interface PracticeAttemptInput {
  learnerId: string;
  moduleId: string;
  competencyId: string;
  activityId: string;
  score: number;
  metadata?: Record<string, unknown>;
  occurredAt?: string;
}

export interface RetentionReviewInput {
  learnerId: string;
  moduleId: string;
  competencyId: string;
  reviewId: string;
  score: number;
  minimumScore: number;
  variantIds: string[];
  metadata?: Record<string, unknown>;
  occurredAt?: string;
}

const eventNonce = (): string => {
  if (typeof globalThis.crypto?.randomUUID === 'function') {
    return globalThis.crypto.randomUUID();
  }
  return `${Date.now()}-${Math.random().toString(36).slice(2)}`;
};

export const createPracticeAttemptEvent = (
  input: PracticeAttemptInput,
): BMULearningEvent => {
  const occurredAt = input.occurredAt ?? new Date().toISOString();
  const nonce = eventNonce();
  const eventId = `${input.moduleId}:${input.activityId}:${nonce}`;
  const evidenceId = `${eventId}:evidence`;

  return {
    schemaVersion: 1,
    eventId,
    occurredAt,
    learnerId: input.learnerId,
    moduleId: input.moduleId,
    type: 'attempt',
    evidence: [
      {
        id: evidenceId,
        type: 'attempt',
        competencyId: input.competencyId,
        moduleId: input.moduleId,
        score: input.score,
        metadata: {
          activityId: input.activityId,
          ...input.metadata,
        },
      },
    ],
  };
};

export const createRetentionReviewEvent = (
  input: RetentionReviewInput,
): BMULearningEvent => {
  const occurredAt = input.occurredAt ?? new Date().toISOString();
  const nonce = eventNonce();
  const eventId = `${input.moduleId}:retention:${input.reviewId}:${nonce}`;
  const evidenceId = `${eventId}:evidence`;
  const reviewPassed = input.score >= input.minimumScore;

  return {
    schemaVersion: 1,
    eventId,
    occurredAt,
    learnerId: input.learnerId,
    moduleId: input.moduleId,
    type: 'assessment',
    evidence: [
      {
        id: evidenceId,
        type: 'assessment',
        competencyId: input.competencyId,
        moduleId: input.moduleId,
        score: input.score,
        metadata: {
          retentionReview: true,
          reviewId: input.reviewId,
          reviewPassed,
          minimumScore: input.minimumScore,
          variantIds: [...new Set(input.variantIds)],
          ...input.metadata,
        },
      },
    ],
  };
};
