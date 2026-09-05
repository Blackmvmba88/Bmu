# Security boundary

BlackMamba University is currently a client-heavy prototype. Treat all browser-delivered code and configuration as public.

## AI credentials

The current Vite application can inject `GEMINI_API_KEY` into the browser bundle through `vite.config.ts`. That is acceptable only for local/private prototyping with disposable restricted credentials. It is **not** an acceptable production credential boundary.

Before public deployment:

1. Move model-provider credentials to a server-side or edge gateway.
2. Make the browser call BMU-owned API routes instead of the model provider directly.
3. Apply provider restrictions, quotas, rate limits, abuse controls, and structured logging at the gateway.
4. Never commit real `.env` files or long-lived provider keys.
5. Rotate any credential that may have been exposed in a public build.

## Learner telemetry

Cognitive telemetry may contain sensitive educational behavior. Production telemetry must have:

- explicit data minimization;
- documented retention rules;
- separation between learner identity and event streams where practical;
- access control by role;
- export/delete mechanisms;
- no claims of medical, neurological, or biometric diagnosis from interaction telemetry.

## Reporting

Until a dedicated private disclosure channel exists, avoid posting secrets or learner data in public GitHub issues.
