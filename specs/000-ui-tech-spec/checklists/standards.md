# Architectural Compliance Checklist: Hybrid UI Standards

**Purpose**: Validate that new feature requirements and designs comply with the Hybrid UI architecture (React for complexity, Native for performance).
**Created**: 2026-01-07
**Feature**: [000-ui-tech-spec](../spec.md)

## Requirement Completeness

- [ ] CHK001 - Does the feature spec explicitly categorize all new UI elements as either "React (Screen/System)" or "Native (Micro-UI/Effect)"? [Compliance, Spec §Proposal]
- [ ] CHK002 - Are mounting requirements defined without creating new React roots? [Consistency, Spec §FR-003]
- [ ] CHK003 - Does the spec define the cleanup strategy (e.g., Maid, Debris) for all requested Native UI elements? [Completeness, Spec §2]

## Requirement Clarity

- [ ] CHK004 - Is the selection of Native UI justified by frequency (e.g., >5 updates/sec) or performance constraints? [Clarity, Spec §2]
- [ ] CHK005 - Are visual priority requirements (DisplayOrder/Z-index) specified for features that overlay both React and Native layers? [Clarity, Spec §Risks]

## Requirement Consistency

- [ ] CHK006 - Do state management requirements avoid direct mutation of "owned" Roblox instances from outside the React tree? [Consistency, Spec §FR-004]
- [ ] CHK007 - Are "Forbidden Patterns" (like React-controlled per-frame tweens) explicitly avoided in the requirement description? [Consistency, Spec §Technical]

## Measurability

- [ ] CHK008 - Can the "Single React Root" constraint be objectively verified in the proposed technical approach? [Measurability, Spec §FR-003]
- [ ] CHK009 - Are performance targets (e.g., 60 FPS) defined for the Native Micro-UI components? [Measurability, Spec §NFR]

## Notes

- This checklist is used to audit *future* UI feature specs (e.g., Inventory, Abilities) to ensure they don't drift from the project's technical foundation.
