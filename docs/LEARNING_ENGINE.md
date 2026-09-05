# BMU Learning Engine v0.2

BlackMamba University treats curriculum, learner state, repetition, retention and mastery as explicit domain data instead of UI-only state.

## Canonical flow

```text
curriculum/registry.json
        ↓
module eligibility
        ↓
practice / lab / assessment
        ↓
normalized BMU learning events
        ↓
learning/engine.ts
        ↓
accuracy × (repetition + variant diversity + consistency)
        ↓
LearnerState + mastery projection
        ↓
mastery map / Kodex journey / retention review
```

## Source-of-truth boundaries

- `curriculum/registry.json` defines domains, competencies, prerequisite edges, mastery thresholds, retention policies and module targets.
- `learning/contracts.ts` owns versioned contracts for learner state, practice state, evidence and learning events.
- `learning/engine.ts` is a deterministic projection layer. It does not call providers or write storage.
- `learning/persistence.ts` owns learner-specific local persistence and rejects malformed or mismatched state.
- `learning/events.ts` creates normalized practice and retention-review events.
- `learning/fractionVariants.ts` owns the first practice and retention variant banks.
- `adapters/kodexJourney.ts` translates BMU state into Kodex journey requests without giving Kodex authority to mutate BMU mastery.
- UI components consume these projections and must not invent mastery independently.

## Core learning principle

Failure is not the opposite of progress. Slow correction is more dangerous than a fast mistake.

BMU optimizes for:

```text
attempt → immediate feedback → correction → repetition → new variant
```

The learner may retry the same problem immediately after a mistake to understand the answer. Solving the exact same item repeatedly does not count as broad mastery because variant diversity is tracked separately.

The objective is not memorizing an answer. It is recognizing and executing the underlying pattern when numbers, wording, context or representation change.

## Repetition-first mastery

Practice mastery combines four signals:

- **accuracy** — cumulative quality across attempts;
- **repetition** — enough attempts to make performance stable;
- **variant diversity** — distinct versions of the same concept;
- **consistency** — sustained successful streaks.

Accuracy gates the other signals. Repetition, diversity and streaks strengthen demonstrated understanding but cannot create mastery from repeated failure alone.

The current stability envelope is:

```text
40% base once accuracy exists
20% repetition volume
25% variant diversity
15% consistency / best streak
```

Final practice mastery is:

```text
mastery = accuracy × stability
```

Reference targets are currently 8 attempts, 5 distinct variants and a best streak of 4 successful attempts. These are tunable projection parameters, not universal pedagogical constants.

A mistake does not erase previously established mastery. It affects cumulative practice statistics and creates another opportunity to correct quickly. Duplicate event IDs remain idempotent and do not double-count evidence.

Assessment, mentor review and artifact evidence remain valid evidence types for competencies that are not naturally represented by repetitive exercises.

## Unlocking

Competencies and modules declare prerequisite competency IDs plus minimum mastery values.

A competency is:

- `locked` when at least one prerequisite is unmet;
- `learning` when prerequisites are satisfied but its mastery threshold is not reached;
- `mastered` when evidence-backed mastery reaches the declared threshold.

A module is eligible only when all module-level prerequisite requirements are satisfied.

## Retention and lightweight monthly reviews

Some knowledge should be revisited even after mastery.

A competency may declare:

```json
{
  "retention": {
    "reviewEveryDays": 30,
    "minReviewScore": 0.7,
    "kind": "micro-quiz",
    "simplerThanInitial": true
  }
}
```

The intent is maintenance, not punishment:

- the review is shorter and simpler than the original learning sequence;
- questions are new variants of the same knowledge rather than copies of earlier items;
- ongoing successful practice naturally refreshes the demonstrated-knowledge timestamp;
- a failed review means repeat and recover quickly, not erase the learner's history;
- a failed review does **not** reset the retention clock.

BMU distinguishes three timestamps:

- `lastUpdatedAt` — any activity affected the competency record;
- `lastDemonstratedAt` — the learner actually demonstrated the knowledge successfully;
- `lastReviewAt` — a scheduled retention review was passed.

Retention uses the strongest valid anchor (`lastReviewAt` or `lastDemonstratedAt`), not mere activity. Therefore an unsuccessful monthly review remains due until the learner recovers.

## First closed learning loop: fractions

`FractionVisualizer` is the first BMU module wired end to end.

It now:

1. presents a target fraction;
2. accepts a learner attempt;
3. gives immediate conceptual feedback on failure;
4. allows instant correction of the same item;
5. emits normalized practice evidence;
6. records the challenge as a specific variant;
7. moves to a different fraction after success;
8. updates `LearnerState` through the reducer;
9. persists the state locally;
10. updates the evidence-driven Mastery Map.

This establishes the reusable pattern for Physics, Circuits, Algebra and later labs.

## First live retention loop: numerical sense

`FractionRetentionReview` is the first scheduled maintenance surface.

When `math-number-sense` is mastered and its 30-day retention window expires, the Mastery Map exposes a short four-question review.

The review intentionally changes representation instead of replaying the training wheel. Current question forms include:

- percentage → fraction;
- words → fraction;
- fraction → percentage;
- equivalent fractions;
- remaining fraction;
- simple comparisons.

The current review threshold is `0.70`, so 3 of 4 correct answers passes. A failed set can immediately be repeated with another subset of variants. A pass emits explicit retention-review evidence and refreshes `lastReviewAt`; a failure is recorded but does not refresh the due date.

## Kodex boundary

The adapter emits a non-mutating request using the canonical route:

```text
guide → lab → course → portfolio → showcase → review-gate
```

The request includes learner context, target competencies, current mastery and required artifact types. Kodex may propose a journey, but BMU remains the authority for evidence ingestion and mastery state.

## Validation gate

`npm run check` begins with:

```bash
npm run validate:curriculum
```

The validator rejects:

- duplicate IDs;
- unknown domain, track or competency references;
- invalid mastery thresholds;
- invalid retention policies;
- self-dependencies;
- prerequisite cycles;
- modules without competencies or artifact types.

Then normal TypeScript and production build validation runs.

## Next integration slice

1. Apply the repetition/variant event pattern to Algebra, Physics and Circuits.
2. Add retention-review generators for those selected core competencies.
3. Add a visible Kodex journey panel for the next eligible module.
4. Generate portfolio entries only from accepted evidence.
5. Add explicit learner-state migration strategy for future schema versions.
6. Move provider credentials behind the BMU gateway before production deployment.
