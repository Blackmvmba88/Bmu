# BMU Consolidation Validation Log

## Protocol

```text
READ → PLAN → WRITE → READ BACK → COMPARE → VALIDATE
```

## Structural checks completed

- Confirmed repository default entrypoint is `index.tsx` → root `App.tsx`.
- Confirmed the former `components/App.tsx` was not the mounted entrypoint and contained invalid relative imports (`./types`, `./components/...`) from inside `components/`.
- Removed that stale duplicate from the consolidation branch.
- Confirmed root `App.tsx` imports the active shell modules directly.
- Confirmed `AICoach.tsx` consumes `VisualDisplay.tsx`, so `VisualDisplay` is indirectly active.
- Added a canonical curriculum registry and ecosystem ownership map.
- Added versioned learner/mastery contracts under `learning/contracts.ts`.
- Added the pure deterministic mastery projection in `learning/engine.ts`.
- Added the non-mutating Kodex journey boundary in `adapters/kodexJourney.ts`.
- Upgraded `curriculum/registry.json` to schema v2 with competencies, prerequisite edges, mastery thresholds and executable module targets.
- Added a curriculum graph validator covering duplicate IDs, broken references, invalid thresholds and prerequisite cycles.
- Compared the consolidation branch to `main`; changes remain additive/documentary except the intentional stale duplicate removal and package metadata normalization.

## Automated validation gate

The repository now defines:

```bash
npm run validate:curriculum
npm run typecheck
npm run build
npm run check
```

`npm run check` executes the curriculum validator first, then TypeScript type checking and the production Vite build. `.github/workflows/ci.yml` invokes that combined gate.

## Independent local validation evidence

Because the hosted GitHub runner is not currently executing jobs, the new learning core was also reconstructed in an isolated local validation directory and compiled with:

- Node.js `v22.16.0`
- TypeScript `5.8.3`
- `strict: true`
- `noEmit: true`

The following new modules compiled successfully in that isolated check:

- `learning/contracts.ts`
- `learning/engine.ts`
- `adapters/kodexJourney.ts`

This confirms the new domain contracts and journey adapter are internally type-consistent. It is not a substitute for the repository-wide `npm run check`, which remains the merge gate.

### Current GitHub Actions result

The latest workflow run for head `8b8eaa280720c98a4e02b548236ff0ad3653d93b` created the `validate` job but terminated before runner assignment. GitHub reports:

```text
runner_id: 0
runner_name: ""
steps: []
```

Therefore the red Actions result is still an execution/environment failure and does **not** indicate a TypeScript, curriculum-validator or Vite failure because none of those steps actually ran.

Do not mark the PR ready for merge solely on structural review. The desired merge gate remains a successful repository-wide `npm run check` run in GitHub Actions or an equivalent trusted environment.

## Next checks

1. Get a runner to execute `npm ci && npm run check` in the full repository.
2. Fix any repository-wide TypeScript/build error surfaced by a real run.
3. Replace `components/MasteryMap.tsx` hard-coded mastery state with `LearnerState` projections.
4. Add local persistence for versioned learner state and event history.
5. Wire the first UI journey request through the Kodex adapter.
6. Normalize lab/assessment outputs into `BMULearningEvent` before any mastery claim is certified.
