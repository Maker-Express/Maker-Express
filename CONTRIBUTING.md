# Contributing to MakerHub India Data

Thank you for helping expand India's hardware ecosystem directory.

## Quick start

```bash
git clone https://github.com/makerhub-india/data.git
cd data
python3 scripts/validate.py data/resources.json   # confirm baseline is valid
```

Edit `data/resources.json`, add your resource, validate, then open a PR.

## What to add

We need:
- **Testing labs** — EMC, environmental, mechanical, chemical, food safety
- **PCB fabs** — with min order qty, layer count, lead time
- **Makerspaces** — especially outside metro cities
- **Government labs** — CSIR, DRDO, DAE, DST facilities with public access
- **Component suppliers** — Indian distributors and importers
- **Contract manufacturers** — EMS companies doing small-batch PCB assembly
- **Accelerators** — Hardware-focused incubators and accelerators
- **Certification bodies** — BIS, NABL, PESO, AERB accredited labs

## Resource schema

Every entry in `data/resources.json` is a JSON object. Required fields:

| Field | Type | Description |
|-------|------|-------------|
| `slug` | string | URL-safe unique ID — `iit-bombay-ncair`, `fab-lab-ahmedabad` |
| `name` | string | Official name |
| `type` | string | One of the [resource types](#resource-types) |
| `city` | string | Primary city name in English |
| `state` | string | Indian state name in English |
| `description_short` | string | 1–2 sentence description, max 280 chars |
| `categories` | array | From the [categories list](#categories) |
| `tags` | array | Freeform search tags |
| `access_level` | 0–4 | 0 = open public, 4 = restricted |

Optional but valuable:

| Field | Type |
|-------|------|
| `website` | URL |
| `email` | email |
| `phone` | string |
| `address` | string |
| `equipment` | array of strings |
| `certifications` | array of strings |
| `price_tier` | 1–4 (1=free, 4=expensive) |
| `walk_in` | boolean |
| `verified` | boolean |
| `latitude` / `longitude` | number |

## Resource types

```
testing-lab         pcb-fab             ems
component-supplier  makerspace          govt-lab
research-lab        tinkering-lab       consultant
certification-body  accelerator         manufacturer
tool-service        3d-printing         logistics
investor            grant               co-working
prototyping-lab     online-tool         online-store
distributor         event               laser-scanning
community           other
```

## Categories

```
electronics  mechanical  biotech      materials
software     robotics    aerospace    energy
chemistry    textiles    agriculture  prototyping
defense      automotive  medical      iot
```

## Access levels

| Level | Meaning |
|-------|---------|
| 0 | Open public — walk in, no prior arrangement needed |
| 1 | Easy access — email/call to book |
| 2 | Institutional — need affiliation or introduction |
| 3 | Restricted — special approval required |
| 4 | Closed — government security clearance or internal only |

## Validation

Before opening a PR, run:

```bash
python3 scripts/validate.py data/resources.json
```

This checks:
- All required fields are present
- Slug is unique and URL-safe
- Type is a known value
- Access level is 0–4
- No duplicate slugs
- URLs are valid format

The same script runs in CI on every PR. PRs that fail validation are not merged.

## PR guidelines

- One PR per batch of related resources (e.g., all testing labs in Pune)
- PR title format: `data: add N [type] resources in [city/region]`
- Include the source of your data in the PR description
- Don't include records you haven't verified exist

## Quality standards

Every resource should be verifiable. Before adding:
1. Check the website is live
2. Confirm the city and type are correct
3. If access_level is 0 or 1, confirm it's actually accessible to the public
4. Use the official English name

## Updating existing resources

To fix incorrect data (broken URL, wrong city, outdated description):
1. Find the entry by slug in `data/resources.json`
2. Make the correction
3. PR title: `fix: correct [field] for [slug]`
