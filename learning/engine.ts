import type {
  BMULearningEvent,
  CompetencyDefinition,
  CompetencyProgress,
  CompetencyRequirement,
  LearnerState,
  MasteryStatus,
  ModuleDefinition,
  ModuleEligibility,
} from './contracts';

const ATTEMPT_MASTERY_CAP = 0.65;

const clamp01 = (value: number): number => Math.max(0, Math.min(1, value));

const progressFor = (
  state: LearnerState,
  competencyId: string,
): CompetencyProgress =>
  state.competencies[competencyId] ?? { mastery: 0, evidenceIds: [] };

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

const masteryCandidate = (
  current: number,
  evidenceType: string,
  score?: number,
): number => {
  if (typeof score === 'number') {
    const normalized = clamp01(score);
    if (evidenceType === 'attempt') {
      return Math.max(current, Math.min(normalized * 0.8, ATTEMPT_MASTERY_CAP));
    }
    return Math.max(current, normalized);
  }

  if (evidenceType === 'artifact') {
    return Math.max(current, 0.6);
  }

  return current;
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
      const nextMastery = masteryCandidate(
        current.mastery,
        evidence.type,
        evidence.score,
      );

      competencies[evidence.competencyId] = {
        mastery: nextMastery,
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
