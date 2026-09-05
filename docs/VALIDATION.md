# BMU Consolidation Validation Log

## Protocol

```text
READ → PLAN → WRITE → READ BACK → COMPARE → VALIDATE
```

## Structural checks completed

- Confirmed repository default entrypoint is `index.tsx` → root `App.tsx`.
- Confirmed the former `components/App.tsx` was not the mounted entrypoint and contained invalid relative imports from inside `components/`; removed that stale duplicate.
- Confirmed root `App.tsx` imports the active shell modules directly.
- Added a canonical curriculum registry and ecosystem ownership map.
- Added versioned learner/mastery/practice/retention contracts under `learning/contracts.ts`.
- Added deterministic mastery projection in `learning/engine.ts`.
- Added normalized practice and retention-review event factories in `learning/events.ts`.
- Added learner-specific local persistence with structural read-back validation in `learning/persistence.ts`.
- Added the non-mutating Kodex journey boundary in `adapters/kodexJourney.ts`.
- Upgraded `curriculum/registry.json` to schema v2 with competencies, prerequisite edges, mastery thresholds, executable module targets and selected retention policies.
- Added curriculum validation covering duplicate IDs, broken references, invalid thresholds, prerequisite cycles and invalid retention policies.
- Replaced the hard-coded Mastery Map with runtime projections from the canonical curriculum and `LearnerState`.
- Closed the first real learning loop in Fracciones: interaction → normalized event → reducer → persistence → mastery UI.
- Added a lightweight monthly retention review for `math-number-sense` using questions that change representation rather than repeating original practice items.

## Automated validation gate

The repository defines:

```bash
npm run validate:curriculum
npm run typecheck
npm run build
npm run check
```

`npm run check` executes curriculum validation first, then TypeScript type checking and the production Vite build. `.github/workflows/ci.yml` invokes that combined gate.

## Independent validation evidence

Because the hosted GitHub runner is still not executing job steps, the learning core has also been validated independently with:

- Node.js `v22.16.0`
- TypeScript `5.8.3`
- `strict: true`
- `noEmit: true`

Core contracts/engine/event code compiled successfully in isolated validation. This is useful evidence but does not replace the repository-wide `npm run check` merge gate.

### Repetition-first behavior checks

The mastery model was exercised specifically against failure/repetition edge cases.

Observed behavior:

```text
8 distinct failed attempts → mastery 0.000
```

Repeated failure therefore cannot manufacture mastery merely by accumulating volume or variant IDs.

A sample sequence consisting of an initial failure, correction and then successful fresh variants produced progressive mastery approximately as follows:

```text
0.269 → 0.433 → 0.572 → 0.700 → 0.792 → 0.836
```

The example competency crossed its `0.8` mastery threshold only after repeated successful performance across changed variants. Failure did not erase previously earned mastery.

### Retention-review behavior checks

The retention clock distinguishes ordinary activity from a valid demonstration of retained knowledge.

Test scenario:

1. A mastered competency had `lastDemonstratedAt = 2026-09-01` and a 30-day retention policy.
2. On `2026-10-02` it was correctly reported as due.
3. A failed retention review (`0.50`, minimum `0.70`) was applied.
4. `lastUpdatedAt` changed because an event occurred, but `lastDemonstratedAt` and `lastReviewAt` did not change.
5. The competency therefore remained due; a failed review did **not** buy another 30 days.
6. A later passing review (`0.75`) updated both the valid-demonstration time and `lastReviewAt`.
7. The next due date moved approximately 30 days from that successful review.

This is intentional: BMU records every attempt, but only demonstrated knowledge refreshes retention.

## Current GitHub Actions state

Hosted `BMU CI` continues to terminate before executing workflow steps. Recent `validate` jobs return no executed steps, matching the earlier runner-provisioning pattern (`runner_id: 0` / empty runner / `steps: []` where full metadata was available).

Therefore the red Actions result is still an execution/environment signal rather than evidence that curriculum validation, TypeScript or Vite failed.

Keep PR #2 as **draft** until a trusted environment successfully executes the full repository gate:

```bash
npm ci && npm run check
```

## Next checks

1. Get a runner or equivalent trusted environment to execute the full repository gate.
2. Fix any repository-wide error surfaced by a real execution.
3. Apply the repetition/variant event pattern to Algebra, Physics and Circuits.
4. Add retention-review generators for the next selected core competencies.
5. Add a visible Kodex journey panel for the next eligible module.
6. Generate portfolio entries only from accepted evidence.
7. Move provider credentials behind the planned BMU gateway before production deployment.
