<!--
SYNC IMPACT REPORT
==================
Version: 0.1.0 -> 0.2.0
Change Type: Major Amendment (Spec Kit Adoption)

Modified Principles:
- Adopted "Spec Kit" process framework (11 sections).
- Retained Engineering Standards (Modular, TDD, Clean Code) as Section 12.
- Updated "Spec Structure" requirements (Section 6).

Templates Status:
- .specify/templates/spec-template.md: ⚠ NEEDS UPDATE (to match Section 6)
- .specify/templates/plan-template.md: ✅ Compatible
- .specify/templates/tasks-template.md: ✅ Compatible

Follow-up:
- Update spec-template.md to include Title, Status, Owner, Summary, Problem, Proposal, Technical, Risks, Open Questions.
-->
# IronGuard Mercs Constitution

> This document defines how we **design, debate, decide, and deliver**.
> It is a living agreement between contributors.

## 1. Purpose

This project uses **Specs** as the primary tool for:
- Designing systems and features before they are built
- Aligning game design + technical execution
- Providing long-term documentation
- Reducing ambiguity and rework
- Enabling safe collaboration

Specs are not bureaucracy.
Specs are how we **think clearly together**.

## 2. Core Principles (Process)

1. **Specs over conversations**
   - Decisions live in docs, not chat threads or memory.

2. **Readable > Perfect**
   - Specs should be understandable before they are impressive.

3. **Iterate, don’t procrastinate**
   - It is better to write a small imperfect spec than wait for a grand perfect one.

4. **Truth lives in one place**
   - A spec is the source of truth until superseded by a newer one.

5. **Design + Tech hand-in-hand**
   - Gameplay intent, user experience, and implementation approach are connected — specs reflect that.

6. **Respect async work**
   - Specs allow collaboration without needing everyone online at once.

## 3. Spec Lifecycle

Specs move through clear states:

- **Draft**: Author exploring / defining. Feedback welcome.
- **Review**: Open for structured comments. Must be reviewed by at least 1 other contributor.
- **Approved**: Accepted as direction. Becomes source of truth.
- **Implemented**: Feature is delivered and aligned with spec.
- **Superseded**: Replaced by a new spec. Old spec preserved historically.

State is always declared at the top of the document.

## 4. Ownership

### Spec Author
Responsible for:
- Writing the spec
- Maintaining clarity
- Responding to feedback
- Updating the spec as changes happen

### Reviewer(s)
Responsible for:
- Challenging assumptions constructively
- Identifying risks
- Ensuring consistency with other specs
- Approving when confident

### Final Decision Authority
If consensus cannot be reached:
- Default owner: **Project Lead / Game Director**
- They decide → decision recorded in the spec

## 5. What Requires a Spec?

A spec is required for:
- New gameplay mechanics or systems (combat rules, dungeon generation rules, classes, progression)
- Core tech framework changes (network strategy, architecture shifts, dependency changes)
- Social / economic systems (progression, rewards, monetization)
- Player experience shaping decisions (difficulty model, UX foundations)

Specs are **optional** for:
- Minor bugfixes
- Small refactors
- Cosmetic-only work
- Content that fits an existing approved pattern

When unsure → write a small spec. Small specs are cheap. Mistakes are not.

## 6. Spec Structure (Minimum Requirements)

A valid spec must include:
- **Title**
- **Status**
- **Owner**
- **Summary**
- **Problem / Why**
- **Proposal / What**
- **Technical / How**
- **Risks**
- **Open Questions**

Optional but encouraged: diagrams, mockups, code snippets, examples.

## 7. Decision Logging

Specs **replace tribal knowledge**.
When a decision is made:
- it MUST be reflected in the spec
- reversals MUST be documented
- alternatives MAY be recorded

We capture **why** decisions were made so future-you doesn’t hate past-you.

## 8. Versioning & Evolution

We assume specs will evolve.
Rules:
- Changes to approved specs require review
- Major changes → new spec that supersedes old
- Historic specs are never deleted

Specs are part of the project’s memory.

## 9. Culture & Values

We agree to:
- Debate ideas, not people
- Value clarity over cleverness
- Prefer collaboration over ego
- Default to trust
- Assume good intent
- Be kind, be direct

Great specs come from **respectful friction**, not silence.

## 10. Enforcement

This constitution applies to: Contributors, Maintainers, Leads.
Specs without adherence to this constitution → may be rejected or returned for restructuring.
This exists to protect: quality, cohesion, contributor sanity.

## 11. Final Word

This constitution exists to make: better decisions, better code, better gameplay, happier developers.
If it stops doing that, we change it.

## 12. Engineering Standards (Retained)

To support the delivery of these specs, we adhere to these technical standards:

*   **Version Control**: Git-based workflow with clear, semantic commit messages.
    *   **No Direct Commits to Main**: Direct pushes to the `main` branch are strictly prohibited.
    *   **Pull Request Required**: All changes must be submitted via a Pull Request from a feature branch and pass CI checks (linting + tests) before merging.
*   **Security**: Zero tolerance for secrets in code. Mandatory input validation at system boundaries. Secure defaults over custom implementations.

---

**Version**: 0.2.1 | **Ratified**: 2026-01-06 | **Last Amended**: 2026-01-06