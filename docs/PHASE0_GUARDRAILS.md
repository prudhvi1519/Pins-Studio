# Phase 0 Guardrails

## Goal
The `pins_studio/` directory is a legacy museum folder and must never change.

## CI Enforcement
Any PR or push that modifies, adds, deletes, or renames files within `pins_studio/**` will fail CI immediately.

## Local Windows Command
To verify compliance before pushing, run:
```bash
node scripts/check-legacy-unchanged.js --base origin/main --head HEAD
```

## Safety Note
Do NOT run negative tests that create, delete, or rename `pins_studio/`. Never delete or rename it.
