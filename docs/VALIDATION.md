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
- Compared the consolidation branch to `main`; all changes are additive/documentary except the intentional stale duplicate removal and package metadata normalization.

## Automated validation gate

The repository now defines:

```bash
npm run typecheck
npm run build
npm run check
```

and `.github/workflows/ci.yml` invokes `npm run check`.

### Current GitHub Actions result

The workflow is being created and triggered by the pull request, but the `validate` job currently terminates before a runner executes any steps. GitHub reports the job as failed with no step list/log payload.

That means the present Actions failure does **not** yet prove a TypeScript or Vite build failure; the code commands have not run in the hosted job. Treat this as a CI execution/environment issue until a runner actually starts.

Do not mark the PR ready for merge solely on structural review. The desired merge gate remains a successful `npm run check` run (GitHub Actions or an equivalent trusted environment).

## Next checks

1. Get a runner to execute the workflow or run `npm ci && npm run check` in a trusted development environment.
2. Fix every reported TypeScript/build error.
3. Inspect unmounted components one by one and classify them.
4. Only then begin registry-driven navigation refactoring and external adapter work.
