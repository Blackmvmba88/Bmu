import type {
  CompetencyDefinition,
  LearnerState,
  ModuleDefinition,
} from '../learning/contracts';

export interface KodexJourneyRequest {
  schemaVersion: 1;
  learnerId: string;
  objective: string;
  route: ['guide', 'lab', 'course', 'portfolio', 'showcase', 'review-gate'];
  targetModule: {
    id: string;
    title: string;
    domainId: string;
    trackId?: string;
    artifactTypes: string[];
  };
  targetCompetencies: Array<{
    id: string;
    name: string;
    currentMastery: number;
    masteryThreshold: number;
  }>;
  completedModules: string[];
  constraints: {
    mutation: 'none';
    evidenceRequired: true;
    masteryMustBeExplainable: true;
  };
}

export interface KodexJourneyStep {
  id: string;
  kind: 'guide' | 'lab' | 'course' | 'portfolio' | 'showcase' | 'review-gate';
  title: string;
  status: 'pending' | 'ready' | 'complete' | 'blocked';
}

export interface BMUJourneyPlan {
  schemaVersion: 1;
  source: 'Blackmvmba88/Kodex';
  learnerId: string;
  moduleId: string;
  steps: KodexJourneyStep[];
  decision: 'ready' | 'blocked' | 'review';
  readinessScore?: number;
  artifacts: Array<{
    type: string;
    title: string;
    uri?: string;
  }>;
  mutation: 'none';
}

const masteryFor = (state: LearnerState, competencyId: string): number =>
  state.competencies[competencyId]?.mastery ?? 0;

export const buildKodexJourneyRequest = (
  state: LearnerState,
  module: ModuleDefinition,
  competencies: CompetencyDefinition[],
): KodexJourneyRequest => {
  const definitions = new Map(
    competencies.map((competency) => [competency.id, competency]),
  );

  const targetCompetencies = module.competencyIds.map((competencyId) => {
    const definition = definitions.get(competencyId);
    if (!definition) {
      throw new Error(
        `Module ${module.id} references unknown competency ${competencyId}`,
      );
    }

    return {
      id: definition.id,
      name: definition.name,
      currentMastery: masteryFor(state, definition.id),
      masteryThreshold: definition.masteryThreshold,
    };
  });

  return {
    schemaVersion: 1,
    learnerId: state.learnerId,
    objective: `Complete ${module.title} and produce verifiable evidence of mastery.`,
    route: ['guide', 'lab', 'course', 'portfolio', 'showcase', 'review-gate'],
    targetModule: {
      id: module.id,
      title: module.title,
      domainId: module.domainId,
      ...(module.trackId ? { trackId: module.trackId } : {}),
      artifactTypes: module.artifactTypes,
    },
    targetCompetencies,
    completedModules: [...state.completedModules],
    constraints: {
      mutation: 'none',
      evidenceRequired: true,
      masteryMustBeExplainable: true,
    },
  };
};

export const normalizeKodexJourneyPlan = (
  request: KodexJourneyRequest,
  payload: {
    steps?: KodexJourneyStep[];
    decision?: 'ready' | 'blocked' | 'review';
    readinessScore?: number;
    artifacts?: Array<{ type: string; title: string; uri?: string }>;
  },
): BMUJourneyPlan => ({
  schemaVersion: 1,
  source: 'Blackmvmba88/Kodex',
  learnerId: request.learnerId,
  moduleId: request.targetModule.id,
  steps: payload.steps ?? [],
  decision: payload.decision ?? 'review',
  ...(typeof payload.readinessScore === 'number'
    ? { readinessScore: Math.max(0, Math.min(1, payload.readinessScore)) }
    : {}),
  artifacts: payload.artifacts ?? [],
  mutation: 'none',
});
