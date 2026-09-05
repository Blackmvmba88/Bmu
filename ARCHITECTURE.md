# 🏛️ BlackMamba University — Canonical Architecture

BMU is a modular academic platform. The frontend is only one layer of the system; curriculum, learning state, telemetry, AI, labs and external BlackMamba capabilities communicate through explicit contracts.

## 1. Product shell

Current implementation:

- React + TypeScript + Vite.
- Role-aware navigation for Alumno, Mentor, Maestro and Creador.
- Interactive domain components under `components/`.
- Local-first profile persistence through `localStorage`.
- Visual theming through CSS custom properties.

The shell should remain thin: navigation, layout, session state and composition. Domain logic belongs in modules/services rather than accumulating in `App.tsx`.

## 2. Canonical curriculum layer

`curriculum/registry.json` is the machine-readable source of truth for BMU domains, advanced tracks, competencies, prerequisite edges, mastery thresholds and module targets.

The registry is currently schema v2.

Canonical module contract:

```ts
interface ModuleDefinition {
  id: string;
  title: string;
  domainId: string;
  trackId?: string;
  maturity: 'experimental' | 'candidate' | 'stable';
  competencyIds: string[];
  prerequisites: CompetencyRequirement[];
  artifactTypes: string[];
}
```

Navigation, mastery maps and future module manifests should converge on registry IDs instead of duplicating domain names or progression rules.

## 3. Learning and mastery layer

The first executable learning-domain slice now lives under `learning/`.

```text
module interaction
  → BMULearningEvent
  → learning/engine.ts
  → LearnerState
  → mastery / eligibility projection
  → learner + mentor views
  → portfolio evidence
```

Implemented contracts include:

- versioned learner state;
- competency progress with evidence references;
- completed modules;
- portfolio artifacts;
- processed event IDs for idempotent replay;
- explicit prerequisite requirements;
- deterministic `locked / learning / mastered` projection.

Mastery claims must remain explainable from stored evidence: attempts, assessments, artifacts or mentor review.

The v0.1 projection is intentionally conservative: attempts alone cannot certify full mastery and unscored artifacts can establish progress but not final mastery.

See `docs/LEARNING_ENGINE.md`.

## 4. Journey layer

BMU uses Kodex as an upstream journey capability through `adapters/kodexJourney.ts`.

Canonical route:

```text
guide → lab → course → portfolio → showcase → review-gate
```

The adapter receives BMU-owned learner state, target module and target competencies, then produces a non-mutating journey request.

```text
BMU LearnerState
      ↓
Kodex adapter
      ↓
Kodex journey proposal
      ↓
normalized BMUJourneyPlan
```

Kodex does not own mastery state. Its adapter boundary declares `mutation: none`; evidence must return through BMU learning events before it can change a learner projection.

## 5. Telemetry layer

Current telemetry concepts include response time, attempts, errors, navigation and active/idle behavior.

Production requirements:

- versioned event schema;
- minimum necessary data;
- explicit retention policy;
- separation of identity and event streams where practical;
- no medical, neurological or biometric diagnosis from ordinary interaction data;
- role-based access to learner analytics.

Canonical learning-event shape now exists in `learning/contracts.ts`.

## 6. AI layer

The current prototype calls Google GenAI from browser-oriented code and uses structured responses for some tutoring flows.

That remains useful for experimentation, but production architecture must be:

```text
Browser / BMU client
      ↓
BMU AI gateway
      ↓
policy + auth + rate limits + logging
      ↓
model provider(s)
```

Provider credentials must not be treated as secrets when injected into a browser bundle. See `SECURITY.md`.

The AI contract boundary should remain provider-agnostic so model providers can change without rewriting academic modules.

## 7. Persistence layer

Current state:

- profiles/preferences: `localStorage`;
- prototype is offline-first and serverless;
- learning engine is currently pure and storage-agnostic.

Target split:

- session/profile store;
- curriculum registry;
- learning-event store;
- mastery projection;
- artifact/portfolio store;
- optional synchronization service.

The next persistence slice should version serialized `LearnerState` and preserve event history so projections can be rebuilt and audited.

## 8. External capability adapters

BMU does not absorb every BlackMamba repository physically.

External systems integrate through adapters:

```text
XarvisCore ─┐
Kodex ──────┼─→ adapter contract → BMU modules / labs / artifacts
AR system ──┘
```

Each adapter should declare:

- source repository and version;
- capabilities;
- input/output schema;
- emitted telemetry;
- generated artifacts;
- safety/permission boundary;
- maturity status.

See `docs/ECOSYSTEM_MAP.md`.

## 9. Validation and release gates

Minimum repository gate:

```bash
npm run check
```

which executes:

```text
curriculum graph validation
→ TypeScript type checking
→ production Vite build
```

The curriculum validator rejects duplicate IDs, broken references, invalid mastery thresholds, self-dependencies, prerequisite cycles and incomplete module contracts.

Broader migration gate:

```text
READ → PLAN → WRITE → READ BACK → COMPARE → VALIDATE
```

Large integrations should not delete or overwrite source implementations until the BMU replacement passes its own tests and comparison checks.

## 10. Immediate architecture debt

Known areas to normalize next:

1. `App.tsx` still owns too much session, theme, idle-AI and navigation behavior.
2. `components/MasteryMap.tsx` still uses hard-coded mastery nodes instead of the new learner projection.
3. Several interactive components are not yet represented consistently in the curriculum/module taxonomy.
4. AI provider access is still coupled directly to frontend code.
5. Learner-state persistence and event-history storage are not implemented yet.
6. Shared production persistence and authorization are not implemented yet.
7. The hosted GitHub Actions runner currently fails before assigning a runner, so full repository CI has not executed successfully on this branch.

The former duplicate `components/App.tsx` has already been compared and removed from the consolidation branch; it is no longer an open architecture item.
