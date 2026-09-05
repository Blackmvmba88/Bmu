import registry from '../curriculum/registry.json';
import type { CompetencyDefinition, ModuleDefinition } from './contracts';

interface CurriculumRegistry {
  schemaVersion: number;
  competencies: CompetencyDefinition[];
  modules: ModuleDefinition[];
  journey: {
    adapter: string;
    route: string[];
    mutation: string;
    masteryRequiresEvidence: boolean;
  };
}

const curriculum = registry as CurriculumRegistry;

export const competencies: CompetencyDefinition[] = curriculum.competencies;
export const modules: ModuleDefinition[] = curriculum.modules;
export const journey = curriculum.journey;

export const competencyById = new Map(
  competencies.map((competency) => [competency.id, competency]),
);

export const moduleById = new Map(modules.map((module) => [module.id, module]));
