import fs from 'node:fs';
import path from 'node:path';
import process from 'node:process';

const registryPath = path.resolve(process.cwd(), 'curriculum/registry.json');
const registry = JSON.parse(fs.readFileSync(registryPath, 'utf8'));
const errors = [];

const fail = (message) => errors.push(message);
const isObject = (value) => value !== null && typeof value === 'object' && !Array.isArray(value);

if (registry.schemaVersion !== 2) {
  fail(`schemaVersion must be 2, received ${registry.schemaVersion}`);
}

for (const key of ['coreDomains', 'advancedTracks', 'competencies', 'modules']) {
  if (!Array.isArray(registry[key])) {
    fail(`${key} must be an array`);
  }
}

const uniqueIds = (items, label) => {
  const seen = new Set();
  for (const item of items ?? []) {
    if (!isObject(item) || typeof item.id !== 'string' || item.id.length === 0) {
      fail(`${label} contains an item without a non-empty id`);
      continue;
    }
    if (seen.has(item.id)) {
      fail(`${label} contains duplicate id ${item.id}`);
    }
    seen.add(item.id);
  }
  return seen;
};

const domainIds = uniqueIds(registry.coreDomains, 'coreDomains');
const trackIds = uniqueIds(registry.advancedTracks, 'advancedTracks');
const competencyIds = uniqueIds(registry.competencies, 'competencies');
uniqueIds(registry.modules, 'modules');

const validateRequirement = (requirement, owner) => {
  if (!isObject(requirement)) {
    fail(`${owner} has a non-object prerequisite`);
    return;
  }
  if (!competencyIds.has(requirement.competencyId)) {
    fail(`${owner} references unknown competency ${requirement.competencyId}`);
  }
  if (
    typeof requirement.minimumMastery !== 'number' ||
    requirement.minimumMastery < 0 ||
    requirement.minimumMastery > 1
  ) {
    fail(`${owner} has invalid minimumMastery for ${requirement.competencyId}`);
  }
};

for (const competency of registry.competencies ?? []) {
  const owner = `competency:${competency.id}`;
  if (!domainIds.has(competency.domainId)) {
    fail(`${owner} references unknown domain ${competency.domainId}`);
  }
  if (
    typeof competency.masteryThreshold !== 'number' ||
    competency.masteryThreshold <= 0 ||
    competency.masteryThreshold > 1
  ) {
    fail(`${owner} must define masteryThreshold in (0, 1]`);
  }
  if (!Array.isArray(competency.prerequisites)) {
    fail(`${owner} prerequisites must be an array`);
  } else {
    for (const requirement of competency.prerequisites) {
      validateRequirement(requirement, owner);
      if (requirement.competencyId === competency.id) {
        fail(`${owner} cannot depend on itself`);
      }
    }
  }
}

for (const module of registry.modules ?? []) {
  const owner = `module:${module.id}`;
  if (!domainIds.has(module.domainId)) {
    fail(`${owner} references unknown domain ${module.domainId}`);
  }
  if (module.trackId && !trackIds.has(module.trackId)) {
    fail(`${owner} references unknown track ${module.trackId}`);
  }
  if (!['experimental', 'candidate', 'stable'].includes(module.maturity)) {
    fail(`${owner} has invalid maturity ${module.maturity}`);
  }
  if (!Array.isArray(module.competencyIds) || module.competencyIds.length === 0) {
    fail(`${owner} must target at least one competency`);
  } else {
    for (const competencyId of module.competencyIds) {
      if (!competencyIds.has(competencyId)) {
        fail(`${owner} targets unknown competency ${competencyId}`);
      }
    }
  }
  if (!Array.isArray(module.prerequisites)) {
    fail(`${owner} prerequisites must be an array`);
  } else {
    for (const requirement of module.prerequisites) {
      validateRequirement(requirement, owner);
    }
  }
  if (!Array.isArray(module.artifactTypes) || module.artifactTypes.length === 0) {
    fail(`${owner} must declare at least one artifact type`);
  }
}

const graph = new Map(
  (registry.competencies ?? []).map((competency) => [
    competency.id,
    (competency.prerequisites ?? []).map((item) => item.competencyId),
  ]),
);
const visiting = new Set();
const visited = new Set();

const visit = (id, trail = []) => {
  if (visiting.has(id)) {
    fail(`competency prerequisite cycle detected: ${[...trail, id].join(' -> ')}`);
    return;
  }
  if (visited.has(id)) return;

  visiting.add(id);
  for (const dependency of graph.get(id) ?? []) {
    visit(dependency, [...trail, id]);
  }
  visiting.delete(id);
  visited.add(id);
};

for (const id of graph.keys()) visit(id);

if (errors.length > 0) {
  console.error('BMU curriculum validation failed:');
  for (const error of errors) console.error(`- ${error}`);
  process.exit(1);
}

console.log(
  `BMU curriculum valid: ${domainIds.size} domains, ${trackIds.size} tracks, ${competencyIds.size} competencies, ${registry.modules.length} modules.`,
);
