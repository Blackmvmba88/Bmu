# BMU Learning Engine v0.1

BlackMamba University now treats curriculum, learner state and mastery as explicit domain data instead of UI-only state.

## Canonical flow

```text
curriculum/registry.json
        ↓
module eligibility
        ↓
Kodex journey request
        ↓
guide → lab → course → portfolio → showcase → review-gate
        ↓
normalized BMU learning events
        ↓
learning/engine.ts
        ↓
LearnerState + mastery projection + portfolio evidence
        ↓
learner / mentor / creator views
```

## Source-of-truth boundaries

- `curriculum/registry.json` defines domains, competencies, prerequisite edges, mastery thresholds and module targets.
- `learning/contracts.ts` owns the versioned TypeScript contracts for learner state, evidence and learning events.
- `learning/engine.ts` is a pure deterministic projection layer. It does not call providers, mutate remote systems or write storage.
- `adapters/kodexJourney.ts` translates BMU state into the existing Kodex journey route without giving Kodex authority to mutate BMU state.
- UI components consume projections later; they must not invent mastery independently.

## Mastery rule

A mastery claim must be explainable from stored evidence.

Current v0.1 projection policy:

- assessment or mentor-review evidence may raise mastery to its normalized score;
- attempt evidence is capped to 80% of its score so practice alone cannot certify full mastery;
- an artifact without a score can establish up to 60% progress, but cannot certify mastery by itself;
- mastery never decreases in this initial projection;
- duplicate event IDs are ignored, making replay idempotent.

This policy is intentionally conservative and deterministic. Later versions can replace it with richer scoring while preserving the event contract.

## Unlocking

Competencies and modules declare prerequisite competency IDs plus minimum mastery values.

A competency is:

- `locked` when at least one prerequisite is unmet;
- `learning` when prerequisites are satisfied but its mastery threshold is not reached;
- `mastered` when its evidence-backed mastery reaches the declared threshold.

A module is eligible only when all module-level prerequisite requirements are satisfied.

## Kodex boundary

The adapter emits a non-mutating request using the canonical route:

```text
guide → lab → course → portfolio → showcase → review-gate
```

The request includes learner context, target competencies, current mastery and required artifact types. Kodex may propose a journey, but BMU remains the authority for evidence ingestion and mastery state.

## Validation gate

`npm run check` now begins with:

```bash
npm run validate:curriculum
```

The validator rejects:

- duplicate IDs;
- unknown domain, track or competency references;
- invalid mastery thresholds;
- self-dependencies;
- prerequisite cycles;
- modules without competencies or artifact types.

Then normal TypeScript and production build validation runs.

## Next integration slice

1. Replace `components/MasteryMap.tsx` hard-coded statuses with projections from `LearnerState`.
2. Add a local persistence adapter for versioned learner state and event history.
3. Add a small BMU journey panel that requests a Kodex plan for the next eligible module.
4. Normalize lab/assessment UI outputs into `BMULearningEvent`.
5. Generate portfolio entries only from accepted evidence.
6. Keep provider credentials behind the planned BMU gateway before production deployment.
