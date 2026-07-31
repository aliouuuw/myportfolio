# Bocal — Engineering Direction

Strategic note. Sits beside `strategic-plan.md` and `profile.md`. The build-level
docs live in the project repos (Gerpain first); this captures *what* I'm building
across projects and *why*, so the direction survives between work sessions.

## Thesis

I am not building "ERP in TypeScript." I'm extracting a **reusable operational
substrate** from the problems I solve repeatedly: money/ledgers, audit trails,
state transitions, permissions, operator dashboards, cross-domain consistency.

The first durable piece is **Bocal** — an append-only, balanced-movement ledger
with derived balances. It is the system of financial record that sits *underneath*
mutable operator workflows. It is framework-free and portable by design, so the
same primitive serves multiple domains unchanged.

This reframes the BocalBun lesson: the value was never the plumbing (entity
engine, RLS) — it was a good **abstraction for business semantics**. Bocal is that
abstraction, scoped down to the one primitive that is hardest to get right and
most valuable when correct: money.

## How it gets validated

Two real domains, same substrate:

1. **Gerpain** (bakery distribution) — cash collections, settlement, commissions.
   Bocal becomes the source of truth for money; workflow tables stay for operator
   UX. Atomic posting on validate. *This is the proving ground.*
2. **EduPlan** (schools) — fees, payments, waivers modeled as ledger movements.
   Reuses Bocal as-is. Second domain proves the primitive *and* the repeatable
   app base.

If both ship on the same base with Bocal dropped in unchanged, the substrate
thesis is proven in practice, not just on paper.

## The repeatable base

Bocal rides on a deliberately repeatable app base so each new client project
starts from the same shape:

```
TanStack Start + oRPC + Drizzle + Neon + Better Auth + TanStack Query + Bocal
```

Single typed full-stack app, one deploy, end-to-end types. Chosen over a split
backend/frontend stack for repeatability and AI-agentic dev speed.

## Why this is worth doing in an AI-coding world

Agents make CRUD generation trivial; that's not the moat. The moat is a
**semantically correct, durable, append-only core** that AI-generated app code can
safely sit on top of without corrupting financial truth. Bocal is the safe layer
under the vibe-coded layer.

## Where the build docs live

- Decision + architecture: `gerpain-2.0/docs/` (`architecture.md`, `adr/`)
- Ledger spec: `gerpain-2.0/docs/bocal-spec.md`
- Agent guardrails: `gerpain-2.0/AGENTS.md`
