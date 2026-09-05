# BMU Module Inventory

This inventory is the first consolidation pass over the current `components/` tree.

## Product entrypoint

- `index.tsx` mounts the root `App.tsx`.
- Root `App.tsx` is the canonical application shell.
- The stale duplicate `components/App.tsx` was removed on the consolidation branch because it used invalid relative imports and was not the mounted entrypoint.

## Mounted directly by the canonical App shell

| Component | Current role |
| --- | --- |
| `NeocyberAuth.tsx` | local role/profile entry |
| `MambaSnakeIcon.tsx` | shared visual identity |
| `MasteryMap.tsx` | mastery/progression surface |
| `FractionVisualizer.tsx` | fractions learning module |
| `MambaCircuits.tsx` | circuits/electronics module |
| `BMUPhysics.tsx` | physics module |
| `MambaLab.tsx` | chemistry/lab module |
| `MathTricks.tsx` | math practice/hints |
| `AICoach.tsx` | AI tutoring surface |
| `BlackMambaRoadmap.tsx` | in-app mission/roadmap surface |

`AICoach.tsx` also uses `VisualDisplay.tsx`, so that component is active indirectly.

## Existing components not mounted by root App

These files exist and must be evaluated before either wiring them into the product or marking them legacy:

- `AdvancedMath.tsx`
- `BMUBiology.tsx`
- `BMUSpace.tsx`
- `MambaGames.tsx`
- `SchoolPlanner.tsx`
- `WeightMaster.tsx`

Do not delete these just because they are currently unmounted. Each may contain useful domain work that should become a registered BMU module.

## Normalization target

Each teaching component should eventually map to one canonical module manifest containing:

- module ID;
- curriculum domain ID;
- title and description;
- maturity level;
- required learner role/level;
- emitted telemetry events;
- produced portfolio artifacts;
- optional external adapter/source;
- version.

Navigation and mastery views should consume those manifests rather than maintain independent hard-coded lists.

## Next validation pass

1. Open every unmounted component and classify it as usable, partial, duplicate, or legacy.
2. Match usable components to `curriculum/registry.json`.
3. Add missing curriculum IDs only when the module has a clear educational purpose.
4. Create a registry-driven navigation prototype.
5. Compare behavior before removing any old path.
