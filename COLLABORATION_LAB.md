# BMU Collaboration Lab

The old `CLABORATIONMIT` placeholder is absorbed into **BlackMamba University (BMU)** as a collaboration mode rather than maintained as a separate academic product.

## Purpose

Let students, mentors and creators work on the same engineering challenge while preserving clear roles, evidence and learning objectives.

A collaboration is not a free-form chat room. It is a structured mission with:
- a problem statement;
- learning objectives;
- role assignments;
- artifacts;
- checkpoints;
- evidence;
- review.

## Core object: Mission Packet

A Mission Packet should contain:

```json
{
  "id": "mission-001",
  "title": "Build a sensor-controlled greenhouse",
  "modules": ["physics", "electronics", "control"],
  "roles": [
    {"role": "student", "scope": "solve-and-build"},
    {"role": "mentor", "scope": "guide-and-review"},
    {"role": "creator", "scope": "author-and-approve"}
  ],
  "objectives": [],
  "constraints": [],
  "artifacts": [],
  "checkpoints": [],
  "evidence": []
}
```

## Collaboration loop

```text
Mission
  ↓
Role assignment
  ↓
Individual attempt
  ↓
Shared artifact
  ↓
Mentor review
  ↓
Revision
  ↓
Evidence
  ↓
Mastery update
```

## Rules

### 1. Individual thinking first
Collaboration should not erase independent reasoning. Missions may require an individual attempt before shared editing.

### 2. Evidence over status
A task is complete because an artifact or result satisfies its checks, not because someone marks it done.

### 3. Role-scoped actions
Students, mentors and creators should not receive identical permissions.

### 4. Minimal telemetry
Only collect learning signals that are needed for the educational objective. Collaboration should not become behavioral surveillance.

### 5. Youth-safe by design
BMU targets learners aged 14–18. Shared spaces must avoid exposing unnecessary personal data, public leaderboards by default, or unrestricted contact between unknown participants.

## First implementation target

Build a local-only collaboration prototype:
1. create one Mission Packet;
2. assign local roles;
3. attach an artifact;
4. record mentor feedback;
5. mark one checkpoint complete with evidence;
6. update mastery only after review.

No networked classroom or public social layer is required for the first version.
