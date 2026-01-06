# [FEATURE NAME]

**Status**: Draft
**Owner**: [Name]
**Created**: [DATE]
**Feature Branch**: `[###-feature-name]`
**Input**: User description: "$ARGUMENTS"

## Summary

[A concise paragraph summarizing the feature, its goal, and the expected outcome.]

## Problem / Why

[Explain the context. What user problem are we solving? Why is this needed now? What happens if we don't do this?]

## Proposal / What

[High-level description of the solution from a product/design perspective.]

### User Scenarios & Testing

<!--
  Prioritize user journeys (P1, P2...). Each must be INDEPENDENTLY TESTABLE.
-->

#### User Story 1 - [Brief Title] (Priority: P1)
**Description**: [Plain language description of the journey]
**Value**: [Why is this P1?]
**Independent Test**: [How to verify this slice works alone]
**Acceptance Scenarios**:
1. **Given** [state], **When** [action], **Then** [result]

#### User Story 2 - [Brief Title] (Priority: P2)
**Description**: ...
**Independent Test**: ...

### Requirements

#### Functional
- **FR-001**: System MUST [capability]
- **FR-002**: System MUST [capability]

#### Key Entities
- **[Entity 1]**: [Attributes, Purpose]
- **[Entity 2]**: [Attributes, Relationships]

### Edge Cases
- [Boundary condition?]
- [Error scenario?]

## Technical / How

[High-level architectural approach. How does this fit into the existing system? New dependencies? APIs? This section guides the detailed `plan.md`.]

## Risks

- [Risk 1]: [Mitigation]
- [Risk 2]: [Mitigation]

## Open Questions

- [Question 1]: [Who needs to answer?]
- [Question 2]: [Impact if unresolved?]

## Success Criteria

- **SC-001**: [Measurable outcome, e.g. "Response time < 200ms"]
- **SC-002**: [User metric, e.g. "Reduction in support tickets"]