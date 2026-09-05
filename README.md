# 🐍 BlackMamba University (BMU)

> **Canonical academic platform for the BlackMamba ecosystem.**

BMU is evolving from a single study application into a modular academic operating system: adaptive learning, technical labs, multidisciplinary curriculum, mastery tracking, learner portfolios, telemetry, AI assistance, and integrations with the wider BlackMamba software ecosystem.

## Current product core

The repository already contains a working React/TypeScript application with modules for mathematics, physics, chemistry, circuits, AI tutoring, mastery mapping, planning, games/labs, biology, space, and role-aware interfaces.

The current learning loop is:

```text
Learner chooses a module
        ↓
Interactive problem / simulation
        ↓
Attempt + timing + error signals
        ↓
Mastery / telemetry update
        ↓
Adaptive explanation or next task
        ↓
Artifact / progress evidence
```

## Pedagogical direction

BMU combines three useful ideas without treating them as magic formulas:

- challenge should track learner capability closely enough to preserve productive engagement;
- instruction should provide scaffolding just beyond what the learner can do alone;
- difficult skills improve through deliberate, measurable practice and feedback.

The system should use telemetry to adapt learning experiences, not to make medical, neurological, or biometric diagnoses.

## Canonical ecosystem rule

`Blackmvmba88/Bmu` is now the source of truth for the academic product and its contracts.

Related repositories remain valuable, but they contribute capabilities through documented adapters instead of independently redefining BMU:

- **XarvisCore** → curriculum research, GeoMaster, sovereign-university concepts, knowledge engines.
- **Kodex** → technical labs, profession routing, portfolio artifacts, simulations.
- **REALIDADAUMENTADA** → AR-guided training and classroom overlays.

See [`docs/ECOSYSTEM_MAP.md`](./docs/ECOSYSTEM_MAP.md).

## Curriculum

BMU now has a machine-readable canonical curriculum registry at [`curriculum/registry.json`](./curriculum/registry.json).

It includes:

- **Cimientos de Soberanía**: practical life foundations, responsibility, ethics, autonomy, and early interest-driven specialization.
- Core STEM domains: mathematics, physics, chemistry, electronics, control, biology, astronomy, geography, and cognition.
- Advanced tracks in AI, engineering platforms, cybersecurity, data science, creative development, and teaching.
- Multidisciplinary paths that are expected to produce verifiable projects and portfolio artifacts.

## Roles

BMU currently models four roles:

- **Alumno** — learns, experiments, solves and builds.
- **Mentor** — reviews progress and helps guide learning strategy.
- **Maestro** — authors and calibrates learning modules.
- **Creador** — maintains system-level curriculum and platform capabilities.

These roles are product permissions and learning responsibilities; they should eventually be enforced server-side for shared deployments.

## Engineering stack

- React 19
- TypeScript 5.8
- Vite 6
- Recharts
- Google GenAI client in the current prototype
- `localStorage` for current offline-first profile persistence

### Local commands

```bash
npm ci
npm run dev
npm run typecheck
npm run build
npm run check
```

`npm run check` is the canonical local validation gate: TypeScript typecheck followed by a production Vite build.

## Validation

A GitHub Actions workflow now runs the same validation gate on pushes and pull requests to `main`.

The consolidation strategy is deliberately incremental:

1. establish a canonical BMU repository;
2. validate the existing product before large code moves;
3. normalize curriculum and module contracts;
4. connect external BlackMamba capabilities through adapters;
5. remove duplicate/stale implementations only after replacement paths are proven.

## Security boundary

The current prototype can expose a model-provider API key to the browser bundle through Vite configuration. That is **not** a production-safe credential boundary.

Before any public production deployment, AI calls must move behind a BMU-owned server-side or edge gateway. See [`SECURITY.md`](./SECURITY.md).

## Roadmap

The active consolidation and engineering plan lives in [`ROADMAP.md`](./ROADMAP.md).

The next major milestones are:

- canonicalize existing modules and navigation;
- import the latest curriculum concepts from XarvisCore as data;
- define a shared telemetry/event contract;
- add Kodex lab/portfolio adapters;
- add GeoMaster and AR adapters;
- move AI credentials and authorization server-side;
- build multidisciplinary missions and evidence-based certification.

## Project status

BMU is an active prototype / pre-production platform. Some modules are implemented, others are experimental, and several concepts currently live in neighboring repositories. The consolidation work is intended to turn that spread into one coherent system without discarding useful research.

---

**BlackMamba University — Audacia · Multidisciplinariedad · Conocimiento real**
