# BlackMamba University — Canonical Ecosystem Map

BMU is the canonical academic product. Other BlackMamba repositories contribute engines, labs, domain modules, or experimental research, but should not redefine the university independently.

## Canonical rule

- `Blackmvmba88/Bmu` owns the product shell, academic UX, user roles, mastery model, telemetry contract, curriculum registry, and release roadmap.
- `Blackmvmba88/XarvisCore` is an upstream source for curriculum research, sovereign-university concepts, GeoMaster, and knowledge-system experiments.
- `Blackmvmba88/Kodex` is an upstream source for labs, profession routing, portfolio artifacts, and simulation workflows.
- `Blackmvmba88/REALIDADAUMENTADA` is an upstream source for AR-guided training and classroom overlays.
- Other repositories may become faculties or labs only after their interface and ownership are documented here.

## Product domains

| Domain | Canonical owner | Current source(s) | Integration mode |
| --- | --- | --- | --- |
| Academic shell | BMU | `Bmu` | Native |
| Roles and identity | BMU | `Bmu` | Native |
| Mastery map | BMU | `Bmu` | Native |
| Cognitive telemetry | BMU | `Bmu` | Native |
| AI tutor | BMU | `Bmu` | Native service boundary |
| Math / fractions | BMU | `Bmu` | Native |
| Physics | BMU | `Bmu`, `Kodex` | Native + lab adapter |
| Chemistry | BMU | `Bmu` | Native |
| Electronics / circuits | BMU | `Bmu`, `Kodex` | Native + lab adapter |
| Biology | BMU | `Bmu` | Native module |
| Space / astronomy | BMU | `Bmu` | Native module |
| Geography | BMU | `XarvisCore/GeoMaster` | Adapter planned |
| Profession routing | BMU | `Kodex` | Adapter planned |
| Portfolio artifacts | BMU | `Kodex` | Adapter planned |
| AR training | BMU | `REALIDADAUMENTADA` | Adapter planned |
| Curriculum research | BMU | `XarvisCore` | Imported into registry |

## Integration principle

BMU should integrate capabilities through explicit contracts instead of copying whole repositories into the frontend.

Each external capability should eventually expose four things:

1. `manifest` — identity, version, maturity, owner.
2. `capabilities` — what the module can teach or simulate.
3. `telemetry` — events emitted to BMU.
4. `artifacts` — outputs that can be stored in the learner portfolio.

This keeps BMU modular while allowing the ecosystem to grow without turning the main application into a monolith.

## Migration states

- **native**: code already lives in BMU and is part of the product shell.
- **candidate**: useful code exists elsewhere but has not been normalized.
- **adapter planned**: ownership is decided; a stable interface is still needed.
- **experimental**: research remains in its source repository until validated.

## Near-term consolidation order

1. Establish BMU as canonical source of truth.
2. Normalize package metadata and CI validation.
3. Create machine-readable curriculum registry.
4. Reconcile existing BMU components with navigation and mastery taxonomy.
5. Import curriculum concepts from XarvisCore as data, not duplicated application logic.
6. Define adapters for Kodex labs and GeoMaster.
7. Define AR training adapter.
8. Move production AI calls behind a server-side gateway before public deployment.
