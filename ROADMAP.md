# 🗺️ BlackMamba University — Consolidation Roadmap

This roadmap replaces the old phase numbering with a validation-first path toward one canonical BMU platform.

## Phase A — Canonicalize and validate

- [x] Declare `Blackmvmba88/Bmu` the canonical academic product.
- [x] Add ecosystem map for XarvisCore, Kodex and REALIDADAUMENTADA.
- [x] Normalize package identity and add `typecheck` / `check` scripts.
- [x] Add GitHub Actions validation for typecheck + production build.
- [x] Add machine-readable curriculum registry.
- [x] Document production security boundary for AI credentials and learner telemetry.
- [ ] Resolve all CI/type errors discovered by the new validation gate.
- [ ] Inventory duplicate or unmounted BMU components and classify them as active, candidate or legacy.

## Phase B — Normalize the BMU core

- [ ] Introduce a canonical module manifest/type shared by navigation, mastery map and curriculum.
- [ ] Reconcile every existing component with the curriculum registry.
- [ ] Replace hard-coded navigation tables with registry-driven navigation.
- [ ] Define a versioned telemetry event schema.
- [ ] Separate identity/profile persistence from learning-event persistence.
- [ ] Add tests for mastery transitions and telemetry reducers.

## Phase C — Integrate the wider BlackMamba ecosystem

- [ ] Import XarvisCore curriculum concepts as normalized BMU data.
- [ ] Add GeoMaster adapter.
- [ ] Add Kodex lab adapter.
- [ ] Add Kodex portfolio artifact adapter.
- [ ] Add profession-routing adapter.
- [ ] Add AR training adapter for REALIDADAUMENTADA.
- [ ] Keep experimental engines in source repositories until their contracts are stable.

## Phase D — Production AI and shared deployment

- [ ] Move provider API keys out of the browser bundle.
- [ ] Introduce BMU server/edge AI gateway.
- [ ] Add authorization for Alumno, Mentor, Maestro and Creador roles.
- [ ] Add rate limiting, quotas and structured AI audit logs.
- [ ] Define learner-data retention, export and deletion behavior.
- [ ] Replace local-only persistence with an optional synchronized backend while preserving offline-first behavior where useful.

## Phase E — Multidisciplinary missions

- [ ] Build a mission schema that can combine several domains.
- [ ] Ship a first mission spanning at least physics + mathematics + engineering.
- [ ] Connect music/frequency/oscillation material as a cross-domain lab.
- [ ] Generate portfolio artifacts from completed missions.
- [ ] Add mentor review and evidence-based mastery checkpoints.

## Phase F — Certification and institutional layer

- [ ] Define what BMU can certify itself versus what requires external accreditation.
- [ ] Create evidence packages: objectives, attempts, artifacts, assessments and mentor review.
- [ ] Version curricula and certification requirements.
- [ ] Add campus/node abstraction only after identity, persistence and authorization are production-ready.

## Validation rule

No large migration is considered complete until it passes:

```text
READ → PLAN → WRITE → READ BACK → COMPARE → VALIDATE
```

For code changes, `npm run check` is the minimum local/CI gate. Integration work should add domain-specific tests before obsolete implementations are removed.
