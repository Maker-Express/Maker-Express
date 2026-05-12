---
name: audit-resource-quality
version: 1.0.0
description: Autonomous audit of existing directory entries — verify websites, flag stale data, identify missing fields, and open correction PRs
compatible_with:
  - claude-code
  - codex
  - mcp-only
  - cursor
mcp_tools:
  - search_resources
  - get_resource
  - list_resource_types
  - list_cities
tags:
  - agent
  - quality
  - audit
  - maintenance
  - automation
security_status: unverified
verified_by: ""
last_reviewed: ""
---

# Audit Resource Quality (Agent)

## When to use
Use this skill to systematically check existing directory entries for quality issues: broken website URLs, missing fields, outdated information, or incorrect access levels. Run periodically to keep the directory accurate. Unlike `research-and-contribute` which adds new entries, this skill only audits and corrects existing ones. Each invocation audits one resource type in one city to keep PRs focused.

**Expected runtime:** 15–45 minutes per type+city combination.
**Output:** A pull request with data corrections, or a report of issues requiring human review.

## Prompt template

```
You are auditing existing entries in the hardware directory for quality issues.

== STEP 1: Select audit scope ==

Pick ONE combination to audit this session:
- Resource type: [RESOURCE_TYPE — e.g. testing-lab, pcb-fab, makerspace]
- City: [CITY — e.g. Bangalore, Mumbai, Chennai]

Or use the MCP tools to find the highest-priority scope:
list_resource_types()
→ Note types with likely staleness (older resource types)
list_cities()
→ Focus on cities you haven't audited recently

Confirm scope before proceeding. Maximum 20 entries per audit session.

== STEP 2: Fetch entries ==

search_resources(type="[RESOURCE_TYPE]", city="[CITY]", limit=20)

For each result, collect the slug. Then fetch full details for each:
get_resource(slug="[SLUG]")

Build an audit list:
| Slug | Name | Website | Has email? | Has description? | Access level set? |

== STEP 3: Website verification ==

For each entry with a website URL:
1. Check if the URL is reachable (HTTP 200)
2. Check if the domain has changed or redirects
3. Check if the organisation name on the website matches the directory entry name
4. Check if the resource type is still accurate (e.g. has a makerspace become a co-working space?)

Flag as:
- ✅ OK — website reachable, name matches
- ⚠️ REDIRECT — website redirects to different URL (update needed)
- ❌ DEAD — website unreachable (mark for human review — don't auto-delete)
- ❓ MISMATCH — organisation name on website differs from directory

== STEP 4: Field completeness check ==

For each entry, check required vs. optional fields:

Required (must be present):
- [ ] name
- [ ] slug
- [ ] city, state
- [ ] access_level
- [ ] type

Should be present (flag if missing):
- [ ] website
- [ ] description_short — ≥10 words, factual, no marketing
- [ ] tags (at least 1)

Flag entries missing required fields as ❌ INCOMPLETE.
Flag entries missing "should be present" fields as ⚠️ PARTIAL.

== STEP 5: Content quality check ==

For each entry with a description, check:
- Is it ≥10 words and ≤3 sentences?
- Is it factual and neutral (no marketing language like "world-class", "best-in-class")?
- Does it accurately describe what the resource offers?

Flag:
- ⚠️ MARKETING — description contains promotional language
- ⚠️ TOO_SHORT — description is <10 words
- ⚠️ STALE — description references specific equipment/services that appear to have changed

== STEP 6: Generate corrections ==

For each flagged entry, determine what can be auto-corrected vs. what needs human review:

**Auto-correct (open PR):**
- Update redirected website URL to final destination
- Add missing tags based on description content
- Fix obvious formatting issues (extra spaces, incorrect capitalisation)
- Update description if website clearly states different info

**Human review only (report, do not PR):**
- Dead websites (resource may have closed)
- Name mismatches (may be a rebranding or a duplicate)
- Access level changes (requires verification)
- Resource type changes

== STEP 7: Format corrections as Markdown ==

For entries to auto-correct, format the changes following the existing entry format:

### [Resource Name]

| Field | Value |
|-------|-------|
| **Slug** | `[slug]` |
| **Location** | [City], [State] |
| **Access** | [CORRECTED_LEVEL] |
| **Website** | [CORRECTED_URL] |
| **Tags** | [corrected, tags] |
| **Source** | [hardstack.sh](https://hardstack.sh) |

[Corrected description.]

---

Run validation:
python3 scripts/validate_md.py resources/[type_file].md

== STEP 8: Open PR or report ==

If corrections exist:
git checkout -b audit/[type]-[city]-$(date +%Y%m%d)
# Apply corrections to resources/[type].md
git commit -m "audit: correct [N] entries in [type] ([city])"
gh pr create --title "audit: correct [N] [type] entries in [city]" \
  --body "## Audit summary
- Type: [TYPE], City: [CITY]
- Entries checked: [N]
- Issues found: [N]
- Auto-corrected: [N]
- Requires human review: [N] (listed below)

## Human review needed
[List entries with dead websites, name mismatches, type changes]

## Sources
[List verified URLs for each correction]

🤖 Audited using the audit-resource-quality skill
Powered by [hardstack.sh](https://hardstack.sh)"

If no corrections, output a plain text report:
AUDIT REPORT — [TYPE] in [CITY] — [DATE]
Entries checked: [N]
Result: All entries OK / Issues found: [N] (human review required)
```

## MCP tool calls
1. `list_resource_types()` — find audit candidates by type
2. `list_cities()` — find audit candidates by city
3. `search_resources(type="[TYPE]", city="[CITY]", limit=20)` — fetch entries for scope
4. `get_resource(slug="[SLUG]")` — fetch full details for each entry

## Example

Input: "Audit testing labs in Bangalore"

→ `search_resources(type="testing-lab", city="Bangalore", limit=20)` → returns 14 entries
→ `get_resource(slug="stqc-bangalore")` × 14 — fetch full details
→ Website checks: 12 OK, 1 redirected (stqc.gov.in → stqc-digital.gov.in), 1 dead (private-lab-404.com)
→ Field checks: 3 missing `tags`, 2 descriptions contain "world-class"
→ Auto-corrects: 1 URL redirect + 3 tag additions + 2 description neutralisations
→ Human review: 1 dead website entry
→ Opens PR: "audit: correct 6 testing-lab entries in Bangalore"
→ PR body lists 1 dead website for maintainer decision

## Usage by platform

### Claude Code
```
/skill agents/audit-resource-quality
```
Specify the resource type and city to audit, or let the skill choose the highest-priority scope.

### Codex / OpenAI agents
Load `skills/agents/audit-resource-quality.md` and trigger with audit scope.

### Manual (any LLM)
Copy the prompt template, replace [PLACEHOLDERS], run with MCP server and web browsing active.

## Notes
- Never delete entries — even dead websites may temporarily be down; flag for human review
- One type + city per PR — keeps review burden manageable for maintainers
- Maximum 20 entries per session — larger audits split into multiple PRs
- This skill works best with web browsing capabilities to verify URLs; without browsing, skip Step 3
- Access level changes require on-site verification or contact with the resource — never change access_level without evidence
