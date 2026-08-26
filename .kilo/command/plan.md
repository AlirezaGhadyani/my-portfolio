---
name: plan
description: Generate or update an implementation plan for a task.
---

# /plan

Generate or update an implementation plan.

## Usage

```
/plan <task description>
```

## Behavior

1. Load `knowledge/architecture.md` for the dependency graph and invariants
2. Analyze the task against the current codebase
3. Generate a step-by-step plan with:
   - Task IDs (stable, referenceable)
   - Dependencies between tasks
   - Validation commands for each step
   - Rollback strategy
4. Check for conflicts with existing plans in `.kilo/plans/`
5. Output the plan in the standard format (see `.kilo/plans/1787647591569-architecture-remediation.md`)

## Rules

- One task = one commit
- Never widen scope — add discoveries to the plan's deferred section
- Every task must have validation commands
- Never mark a task done without quoting real command output
