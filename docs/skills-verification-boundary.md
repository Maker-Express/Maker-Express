# Skills Verification Boundary (Public vs Private)

This repository is the public distribution surface for skills and catalogs.

## Public in this repo

- Skill content (`skills/**/*.md`)
- Public trust signals:
  - `security_status`
  - `verified_by`
  - `last_reviewed`
- Source attribution links for community and CAD skills

## Private (operations repo only)

- Full skill-audit traces
- Sandbox execution logs
- Internal threat findings
- Re-audit work queues and incident notes

## Why this split exists

- Keep public repo easy to consume for contributors
- Avoid exposing internal security telemetry
- Preserve reproducible trust signals without publishing sensitive details

## Maintainer rule

Never publish raw private audit artifacts in this repo. Publish only the minimum trust metadata needed by users and contributors.
