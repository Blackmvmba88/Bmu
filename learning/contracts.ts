export type MasteryStatus = 'locked' | 'learning' | 'mastered';

export type ModuleMaturity = 'experimental' | 'candidate' | 'stable';

export type EvidenceType =
  | 'attempt'
  | 'assessment'
  | 'artifact'
  | 'mentor-review';

export interface CompetencyRequirement {
  competencyId: string;
  minimumMastery: number;
}

export interface CompetencyDefinition {
  id: string;
  name: string;
  domainId: string;
  description: string;
  prerequisites: CompetencyRequirement[];
  masteryThreshold: number;
}

export interface ModuleDefinition {
  id: string;
  title: string;
  domainId: string;
  trackId?: string;
  maturity: ModuleMaturity;
  competencyIds: string[];
  prerequisites: CompetencyRequirement[];
  artifactTypes: string[];
}

export interface PracticeProgress {
  attempts: number;
  scoreTotal: number;
  successfulAttempts: number;
  currentStreak: number;
  bestStreak: number;
  lastScore?: number;
}

export interface CompetencyProgress {
  mastery: number;
  evidenceIds: string[];
  practice?: PracticeProgress;
  lastUpdatedAt?: string;
}

export interface PortfolioArtifact {
  id: string;
  moduleId: string;
  type: string;
  title: string;
  uri?: string;
  createdAt: string;
  evidenceIds: string[];
}

export interface LearnerState {
  schemaVersion: 1;
  learnerId: string;
  competencies: Record<string, CompetencyProgress>;
  completedModules: string[];
  artifacts: PortfolioArtifact[];
  processedEventIds: string[];
  updatedAt: string;
}

export interface LearningEvidence {
  id: string;
  type: EvidenceType;
  competencyId?: string;
  moduleId?: string;
  score?: number;
  artifact?: Omit<PortfolioArtifact, 'evidenceIds'>;
  metadata?: Record<string, unknown>;
}

export interface BMULearningEvent {
  schemaVersion: 1;
  eventId: string;
  occurredAt: string;
  learnerId: string;
  moduleId: string;
  type: 'attempt' | 'complete' | 'hint' | 'artifact' | 'assessment';
  evidence: LearningEvidence[];
}

export interface ModuleEligibility {
  moduleId: string;
  eligible: boolean;
  unmetRequirements: CompetencyRequirement[];
}
