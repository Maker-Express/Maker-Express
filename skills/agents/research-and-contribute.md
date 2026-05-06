---
name: research-and-contribute
version: 1.0.0
description: Full autonomous loop — research gaps in the directory, find real resources, validate, and open a PR
compatible_with:
  - claude-code
  - codex
  - mcp-only
  - cursor
mcp_tools:
  - search_resources
  - list_cities
  - list_resource_types
tags:
  - agent
  - contribution
  - research
  - automation
security_status: verified
verified_by: maintainer
last_reviewed: 2025-05-07
---

# Research and Contribute (Agent Loop)

## When to use
Use this skill to autonomously research gaps in the directory and contribute new verified
resources via a pull request. This is the canonical "contribute with tokens" workflow —
donate your compute time to expand the directory for the Indian maker community.

**Expected runtime:** 10–30 minutes depending on scope.
**Output:** A pull request to the hardstack-india/data public repo.

## Prompt template

```
You are contributing to an open directory of India's hardware ecosystem.
The directory lives at: https://github.com/hardstack-india/data

Your mission: find real, verifiable hardware resources that are missing from the directory
and submit them via a pull request.

== STEP 1: Find gaps ==

Use the MCP tools to understand what's currently in the directory:

a) Check coverage by type:
   list_resource_types()
   → Note which types have the fewest entries

b) Check coverage by city:
   list_cities()
   → Focus on cities with fewer than 10 resources, especially:
     Jaipur, Lucknow, Indore, Bhopal, Coimbatore, Nashik, Vizag, Surat, Vadodara

c) Spot-check specific gaps:
   search_resources(type="testing-lab", city="Jaipur", limit=5)
   search_resources(type="pcb-fab", city="Lucknow", limit=5)
   → Confirm the gap is real before researching

Pick ONE gap to fill (type + city combination).

== STEP 2: Research ==

Find real, verifiable resources for your chosen gap:
- Search government directories: csir.res.in, stqc.gov.in, birac.nic.in, nabl.gov.in
- Search state government MSME portals for the target city's state
- Search "[type] [city]" and "[type] [state]" to find facilities
- Verify each resource exists by checking their website
- Do NOT add resources you cannot verify

For each resource found, collect:
- Name (official name from their website)
- Slug: org-name-city (lowercase, hyphens, globally unique)
- Location: City, State
- Access level: L0-L4 (see CONTRIBUTING.md)
- Website: must be reachable
- Tags: relevant to their specialisation
- Brief description (1–2 neutral sentences)

Verify the slug is not already in the directory:
   search_resources(q="[slug]", limit=3)
   → If found, skip or use a more specific slug

== STEP 3: Format entries ==

Format each new resource as a Markdown section:

### [Resource Name]

| Field | Value |
|-------|-------|
| **Slug** | `[slug]` |
| **Location** | [City], [State] |
| **Access** | [L0–L4 label] |
| **Website** | [url] |
| **Tags** | [tag1, tag2] |
| **Contributed by** | [@your-github-username](https://github.com/your-github-username) |

[One sentence description from their website (neutral, no marketing).]

---

== STEP 4: Validate ==

Before committing, run:
   python3 scripts/validate_md.py resources/[type_file].md
Fix any errors before proceeding.

== STEP 5: Submit PR ==

```bash
git clone https://github.com/YOUR_FORK/data
cd data
git checkout -b add-[type]-[city]

# Append your entries to the correct resources/<type>.md file
# (Do not modify any existing entries)

git add resources/
git commit -m "data: add [N] [type] resources in [city]"

gh pr create \
  --title "data: add [N] [type] resources in [city]" \
  --body "## Summary
- Added [N] resources to resources/[type_file].md
- City: [CITY], [STATE]
- Resource type: [TYPE]

## Sources
[list each resource website you verified]

## Verification
- [ ] All slugs unique (validate_md.py passed)
- [ ] All websites reachable at time of submission
- [ ] No marketing copy — descriptions are neutral and factual
- [ ] Contributed-by fields set to my GitHub username

🤖 Contributed using the research-and-contribute skill
Powered by [hardstack.sh](https://hardstack.sh)"
```

== RULES ==
1. Only add resources you can verify from public sources — no fabrication
2. One gap per PR (one type + city combination)
3. Maximum 20 new entries per PR
4. Never modify existing entries — append only
5. Include source URLs in the PR description
6. Set Contributed-by to your GitHub username for attribution
```

## MCP tool calls
1. `list_resource_types()` — discover gaps by type count
2. `list_cities()` — discover gaps by city coverage
3. `search_resources(type="[TYPE]", city="[CITY]", limit=5)` — confirm gap exists
4. `search_resources(q="[SLUG]", limit=3)` — check slug uniqueness

## Quality bar

Only submit resources that meet ALL of these:
- ✅ Website exists and is reachable
- ✅ Organization clearly operates in the stated city
- ✅ Resource type is correct (don't put a makerspace in testing-lab)
- ✅ Description is ≤2 sentences, neutral, no marketing language
- ✅ Slug follows naming convention and is unique

## Notes
- This skill runs best in an agentic loop with web browsing capabilities
- With Claude Code + browser tools: can automate Steps 2–3 fully
- Without browser: use Step 1 (MCP) to find gaps, then manually research
- Attribution: your GitHub username in "Contributed by" builds your contribution history
