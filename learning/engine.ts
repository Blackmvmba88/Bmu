import type {
  BMULearningEvent,
  CompetencyDefinition,
  CompetencyProgress,
  CompetencyRequirement,
  LearnerState,
  MasteryStatus,
  ModuleDefinition,
  ModuleEligibility,
  PracticeProgress,
  RetentionStatus,
} from './contracts';

const SUCCESS_SCORE = 0.8;
const TARGET_ATTEMPTS = 8;
const TARGET_VARIANTS = 5;
const TARGET_STREAK = 4;
const DAY_MS = 86_400_000;

const clamp01 = (value: number): number => Math.max(0, Math.min(1, value));

const progressFor = (
  state: LearnerState,
  competencyId: string,
): CompetencyProgress =>
  state.competencies[competencyId] ?? { mastery: 0, evidenceIds: [] };

const practiceFor = (progress: CompetencyProgress): PracticeProgress =>
  progress.practice ?? {
    attempts: 0,
    scoreTotal: 0,
    successfulAttempts: 0,
    currentStreak: 0,
    bestStreak: 0,
    variantIds: [],
  };

const practiceMastery = (practice: PracticeProgress): number => {
  if (practice.attempts === 0) return 0;

  const accuracy = clamp01(practice.scoreTotal / practice.attempts);
  const repetition = clamp01(practice.attempts / TARGET_ATTEMPTS);
  const diversity = clamp01(practice.variantIds.length / TARGET_VARIANTS);
  const consistency = clamp01(practice.bestStreak / TARGET_STREAK);

  return clamp01(
    accuracy * 0.4 +
      repetition * 0.2 +
      diversity * 0.25 +
      consistency * 0.15,
  );
};

const updatePractice = (
  current: CompetencyProgress,
  score: number,
  variantId?: string,
): PracticeProgress => {
  const previous = practiceFor(current);
  const normalized = clamp01(score);
  const successful = normalized >= SUCCESS_SCORE;
  const currentStreak = successful ? previous.currentStreak + 1 : 0;
  const variantIds =
    variantId && !previous.variantIds.includes(variantId)
      ? [...previous.variantIds, variantId]
      : previous.variantIds;

  return {
    attempts: previous.attempts + 1,
    scoreTotal: previous.scoreTotal + normalized,
    successfulAttempts: previous.successfulAttempts + (successful ? 1 : 0),
    currentStreak,
    bestStreak: Math.max(previous.bestStreak, currentStreak),
    variantIds,
    lastScore: normalized,
  };
};

export const createLearnerState = (
  learnerId: string,
  now = new Date().toISOString(),
): LearnerState => ({
  schemaVersion: 1,
  learnerId,
  competencies: {},
  completedModules: [],
  artifacts: [],
  processedEventIds: [],
  updatedAt: now,
});

export const requirementSatisfied = (
  state: LearnerState,
  requirement: CompetencyRequirement,
): boolean =>
  progressFor(state, requirement.competencyId).mastery >=
  requirement.minimumMastery;

export const unmetRequirements = (
  state: LearnerState,
  requirements: CompetencyRequirement[],
): CompetencyRequirement[] =>
  requirements.filter((requirement) => !requirementSatisfied(state, requirement));

export const competencyStatus = (
  state: LearnerState,
  competency: CompetencyDefinition,
): MasteryStatus => {
  if (unmetRequirements(state, competency.prerequisites).length > 0) {
    return 'locked';
  }

  const mastery = progressFor(state, competency.id).mastery;
  return mastery >= competency.masteryThreshold ? 'mastered' : 'learning';
};

export const moduleEligibility = (
  state: LearnerState,
  module: ModuleDefinition,
): ModuleEligibility => {
  const unmet = unmetRequirements(state, module.prerequisites);
  return {
    moduleId: module.id,
    eligible: unmet.length === 0,
    unmetRequirements: unmet,
  };
};

const variantIdFrom = (metadata?: Record<string, unknown>): string | undefined => {
  const variantId = metadata?.variantId;
  if (typeof variantId === 'string' && variantId.length > 0) return variantId;

  const activityId = metadata?.activityId;
  return typeof activityId === 'string' && activityId.length > 0
    ? activityId
    : undefined;
};

const masteryCandidate = (
  current: CompetencyProgress,
  evidenceType: string,
  score?: number,
  metadata?: Record<string, unknown>,
): { mastery: number; practice?: PracticeProgress; lastReviewAt?: string } => {
  if (evidenceType === 'attempt' && typeof score === 'number') {
    const practice = updatePractice(current, score, variantIdFrom(metadata));
    return {
      mastery: Math.max(current.mastery, practiceMastery(practice)),
      practice,
      lastReviewAt: current.lastReviewAt,
    };
  }

  if (typeof score === 'number') {
    return {
      mastery: Math.max(current.mastery, clamp01(score)),
      practice: current.practice,
      lastReviewAt: current.lastReviewAt,
    };
  }

  if (evidenceType === 'artifact') {
    return {
      mastery: Math.max(current.mastery, 0.6),
      practice: current.practice,
      lastReviewAt: current.lastReviewAt,
    };
  }

  return {
    mastery: current.mastery,
    practice: current.practice,
    lastReviewAt: current.lastReviewAt,
  };
};

export const applyLearningEvent = (
  state: LearnerState,
  event: BMULearningEvent,
): LearnerState => {
  if (state.learnerId !== event.learnerId) {
    throw new Error(
      `Learning event learner mismatch: expected ${state.learnerId}, received ${event.learnerId}`,
    );
  }

  if (state.processedEventIds.includes(event.eventId)) {
    return state;
  }

  const competencies = { ...state.competencies };
  const artifacts = [...state.artifacts];

  for (const evidence of event.evidence) {
    if (evidence.competencyId) {
      const current = progressFor({ ...state, competencies }, evidence.competencyId);
      const next = masteryCandidate(
        current,
        evidence.type,
        evidence.score,
        evidence.metadata,
      );

      competencies[evidence.competencyId] = {
        mastery: next.mastery,
        practice: next.practice,
        lastReviewAt: next.lastReviewAt,
        evidenceIds: current.evidenceIds.includes(evidence.id)
          ? current.evidenceIds
          : [...current.evidenceIds, evidence.id],
        lastUpdatedAt: event.occurredAt,
      };
    }

    if (evidence.artifact && !artifacts.some((item) => item.id === evidence.artifact?.id)) {
      artifacts.push({
        ...evidence.artifact,
        evidenceIds: [evidence.id],
      });
    }
  }

  const completedModules =
    event.type === 'complete' && !state.completedModules.includes(event.moduleId)
      ? [...state.completedModules, event.moduleId]
      : state.completedModules;

  return {
    ...state,
    competencies,
    artifacts,
    completedModules,
    processedEventIds: [...state.processedEventIds, event.eventId],
    updatedAt: event.occurredAt,
  };
};

export const retentionStatus = (
  state: LearnerState,
  competency: CompetencyDefinition,
  now = new Date(),
): RetentionStatus => {
  if (!competency.retention) {
    return { competencyId: competency.id, required: false, due: false };
  }

  const progress = progressFor(state, competency.id);
  if (competencyStatus(state, competency) !== 'mastered') {
    return { competencyId: competency.id, required: true, due: false };
  }

  const anchor = progress.lastReviewAt ?? progress.lastUpdatedAt;
  if (!anchor) {
    return { competencyId: competency.id, required: true, due: true };
  }

  const dueAtMs = new Date(anchor).getTime() + competency.retention.reviewEveryDays * DAY_MS;
  const daysRemaining = Math.ceil((dueAtMs - now.getTime()) / DAY_MS);

  return {
    competencyId: competency.id,
    required: true,
    due: dueAtMs <= now.getTime(),
    dueAt: new Date(dueAtMs).toISOString(),
    daysRemaining,
  };
};

export const masteredCompetencyIds = (
  state: LearnerState,
  definitions: CompetencyDefinition[],
): string[] =>
  definitions
    .filter((definition) => competencyStatus(state, definition) === 'mastered')
    .map((definition) => definition.id);

export const recommendNextModules = (
  state: LearnerState,
  modules: ModuleDefinition[],
): ModuleDefinition[] =>
  modules.filter(
    (module) =>
      !state.completedModules.includes(module.id) &&
      moduleEligibility(state, module).eligible,
  );
