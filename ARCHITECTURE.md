# 🏛️ BlackMamba University — Canonical Architecture

BMU is a modular academic platform. The frontend is only one layer of the system; curriculum, learning state, telemetry, AI, labs and external BlackMamba capabilities should communicate through explicit contracts.

## 1. Product shell

Current implementation:

- React + TypeScript + Vite.
- Role-aware navigation for Alumno, Mentor, Maestro and Creador.
- Interactive domain components under `components/`.
- Local-first profile persistence through `localStorage`.
- Visual theming through CSS custom properties.

The shell should remain thin: navigation, layout, session state and composition. Domain logic should live in modules/services rather than accumulating in `App.tsx`.

## 2. Canonical curriculum layer

`curriculum/registry.json` is the first machine-readable source of truth for BMU curriculum domains and advanced tracks.

Future module manifests should reference curriculum IDs instead of duplicating domain names in navigation, mastery maps and components.

Target contract:

```ts
interface BMUModuleManifest {
  id: string;
  title: string;
  domainId: string;
  version: string;
  maturity: 'experimental' | 'candidate' | 'stable';
  capabilities: string[];
  telemetryEvents: string[];
  artifactTypes: string[];
}
```

## 3. Learning and mastery layer

The mastery system should eventually consume normalized learning events rather than direct component state.

Target flow:

```text
module interaction
  → learning event
  → validation/reducer
  → mastery state
  → mentor/learner views
  → portfolio evidence
```

Mastery claims should be explainable from stored evidence: attempts, assessment results, artifacts, or mentor review.

## 4. Telemetry layer

Current telemetry concepts include response time, attempts, errors, navigation and active/idle behavior.

Production requirements:

- versioned event schema;
- minimum necessary data;
- explicit retention policy;
- separation of identity and event streams where practical;
- no medical/neurological/biometric diagnosis from ordinary interaction data;
- role-based access to learner analytics.

Example future event:

```ts
interface BMULearningEvent {
  schemaVersion: 1;
  eventId: string;
  occurredAt: string;
  learnerId: string;
  moduleId: string;
  type: 'attempt' | 'complete' | 'hint' | 'artifact' | 'assessment';
  payload: Record<string, unknown>;
}
```

## 5. AI layer

The current prototype calls Google GenAI from browser-oriented code and uses structured JSON responses for some tutoring flows.

That is useful for experimentation, but production architecture must be:

```text
Browser / BMU client
      ↓
BMU AI gateway
      ↓
policy + auth + rate limits + logging
      ↓
model provider(s)
```

Provider credentials must not be treated as secrets if they are injected into a browser bundle. See `SECURITY.md`.

The AI layer should be provider-agnostic at the BMU contract boundary so models can change without rewriting academic modules.

## 6. Persistence layer

Current state:

- profiles/preferences: `localStorage`;
- prototype is offline-first and serverless.

Target split:

- session/profile store;
- curriculum registry;
- learning-event store;
- mastery projection;
- artifact/portfolio store;
- optional synchronization service.

Local-first behavior can remain useful, but shared deployments need authenticated persistence and conflict/version handling.

## 7. External capability adapters

BMU does not need to absorb every BlackMamba repository physically.

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

## 8. Validation and release gates

Minimum code gate:

```bash
npm run check
```

which performs TypeScript type checking and a production Vite build.

Broader migration gate:

```text
READ → PLAN → WRITE → READ BACK → COMPARE → VALIDATE
```

Large integrations should not delete or overwrite their source implementation until the BMU replacement passes its own tests and comparison checks.

## 9. Immediate architecture debt

Known areas to normalize next:

1. `App.tsx` currently owns too much session, theme, idle-AI and navigation behavior.
2. Several components exist but are not represented consistently in navigation or mastery taxonomy.
3. A duplicate `components/App.tsx` exists and must be compared before removal.
4. AI provider access is coupled directly to frontend code.
5. Curriculum names are duplicated across code/docs and should converge on registry IDs.
6. Shared production persistence and authorization are not implemented yet.

These are consolidation targets, not reasons to discard the current prototype.
