# AI Agent Contribution Guide

This document is written for AI agents (Claude, GPT, Gemini, etc.) contributing
to the MakerHub India dataset. Follow these instructions precisely.

## Your mission

Find real hardware ecosystem resources in India that are missing from
`data/resources.json` and add them following the schema.

## Step 0: Understand the current gaps

```python
# Run this to see what's missing
import json, collections

data = json.load(open("data/resources.json"))

# Types with fewest entries (these need the most help)
by_type = collections.Counter(r["type"] for r in data)
print("Least-covered types:")
for t, n in by_type.most_common()[-8:]:
    print(f"  {n:4d}  {t}")

# Cities with fewest entries
by_city = collections.Counter(r.get("city", "unknown") for r in data)
# Tier-2 cities to focus on:
TIER2 = ["Jaipur", "Lucknow", "Indore", "Bhopal", "Nashik", "Coimbatore",
         "Kochi", "Vadodara", "Surat", "Agra", "Ludhiana", "Kanpur", "Nagpur"]
print("\nTier-2 city coverage:")
for city in TIER2:
    n = by_city.get(city, 0)
    print(f"  {n:4d}  {city}")
```

## Step 1: Research new resources

Search for real, verifiable resources. Good sources:
- Government websites: `.gov.in`, `.nic.in`, `.res.in`
- University lab directories
- DSIR, DRDO, CSIR, STPI facility listings
- State industrial directories (MSME, SIDBI)
- Trade association member lists (ELCINA, IESA, NASSCOM hardware)
- Google Maps searches for specific types in specific cities

**Do not hallucinate.** Only add resources that you have verified exist via
at least one authoritative source. Include that source URL in your PR description.

## Step 2: Format your entries

Each entry is a JSON object. Copy this template:

```json
{
  "slug": "your-resource-slug",
  "name": "Official Resource Name",
  "type": "testing-lab",
  "city": "Bangalore",
  "state": "Karnataka",
  "description_short": "One or two sentences describing what this resource does and who it serves. Max 280 characters.",
  "website": "https://example.gov.in",
  "categories": ["electronics", "mechanical"],
  "tags": ["emc", "testing", "nabl"],
  "access_level": 1
}
```

### Slug rules
- Lowercase, hyphens only, no spaces or special characters
- 3–60 characters
- Must be unique in the dataset
- Format: `{name-abbrev}-{city}` e.g. `iit-bombay-ncair`, `fab-lab-pune`

### Access levels
- `0` = Open public (walk in any time)
- `1` = Easy access (email or call to book)
- `2` = Institutional access (affiliation required)
- `3` = Restricted (special approval)
- `4` = Closed/classified

When uncertain, use `1`.

## Step 3: Validate your entries

```bash
python3 scripts/validate.py data/resources.json
```

Fix any errors before opening the PR.

## Step 4: Open a PR

```bash
git checkout -b data/add-testing-labs-jaipur
git add data/resources.json
git commit -m "data: add 5 testing labs in Jaipur"
git push origin data/add-testing-labs-jaipur
gh pr create \
  --title "data: add 5 testing labs in Jaipur" \
  --body "$(cat <<'EOF'
## Summary
Added 5 verified testing labs in Jaipur, Rajasthan.

## Sources
- NABL accredited laboratory listing: https://nabcb.qci.org.in/accreditation/nabl/
- Rajasthan MSME directory: https://msme.rajasthan.gov.in/

## Validation
python3 scripts/validate.py passes with 0 errors.

## Slugs added
- sbi-testing-jaipur
- rtestlab-jaipur
- csir-cecri-jaipur
- raj-industry-lab-jaipur
- itc-jaipur
EOF
)"
```

## PR template

Your PR description MUST include:
1. **Summary** — what you added and why
2. **Sources** — URLs you used to verify each resource
3. **Validation** — confirm `python3 scripts/validate.py` passes

PRs without sources are rejected.

## Rate limits

To avoid overwhelming maintainers:
- Maximum **20 resources per PR**
- Maximum **1 PR per hour per agent**
- Focus on one city or type per PR

## What gets rejected

- Hallucinated resources (not verifiable via web search)
- Duplicates of existing entries (validate.py catches these)
- Resources outside India
- Resources with `access_level: 4` unless you have a public source confirming existence
- Promotional or sponsored content

## Questions?

Open an issue in this repo. Do not email the maintainers directly.
