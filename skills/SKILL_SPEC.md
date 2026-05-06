# Skill Specification

A skill is a Markdown file with YAML frontmatter that defines a reusable AI agent capability.
Skills in this repo are specific to hardware, hardtech, and the Indian maker ecosystem.

---

## File format

```markdown
---
name: skill-name
version: 1.0.0
description: One sentence explaining what this skill does
compatible_with:
  - claude-code      # Claude Code /skill tool
  - codex            # OpenAI Codex agents
  - mcp-only         # Any MCP client (no /skill needed)
  - cursor           # Cursor AI
mcp_tools:
  - search_resources   # list only tools this skill actually calls
  - get_resource
tags:
  - testing
  - certification
security_status: unverified   # unverified | community | verified | audited
verified_by: ""               # maintainer GitHub handle, or empty
last_reviewed: ""             # YYYY-MM-DD
---

# Skill Title

## When to use
<!-- 2-3 sentences: what problem does this solve, when should an agent invoke it? -->

## Prompt template
<!-- The core prompt. Use [PLACEHOLDER] for variables the agent fills in. -->
<!-- Keep it neutral — no platform-specific syntax in this block. -->

```
Your prompt here with [PLACEHOLDERS].
Use the search_resources MCP tool with ...
Return: ...
Sort by: ...
```

## MCP tool calls
<!-- Ordered list of the exact tool calls this skill makes -->
1. `tool_name(param="[PLACEHOLDER]", ...)`
2. `tool_name(slug="[result.slug]")`

## Example
<!-- One concrete input/output example -->
Input: "..."
→ `tool_call(param=value)`
→ Returns: ...

## Usage by platform

### Claude Code
```
/skill hardware/skill-name
```
Then provide the required inputs when prompted.

### Codex / OpenAI agents
Load `skills/hardware/skill-name.md` as a tool definition and call with inputs.

### Manual (any LLM)
Copy the prompt template, replace [PLACEHOLDERS], send to your LLM with the MCP server active.

## Notes
<!-- Any caveats, edge cases, or important context -->
```

---

## Security requirements

All skills must:
1. Only call MCP tools from the approved list: `search_resources`, `get_resource`, `list_resource_types`, `list_cities`, `get_grants`
2. Not contain prompt injection patterns: `ignore previous`, `disregard`, `system:`, `<|im_start|>`, `[INST]`
3. Not include external URLs, webhooks, or `fetch`/`curl` instructions in the prompt template
4. Have `security_status: unverified` until reviewed

Maintainer reviews will set `security_status: community` (reviewed but not deeply audited) or `verified` (fully audited).

## Submitting a skill

1. Create `skills/hardware/your-skill-name.md` or `skills/agents/your-skill-name.md`
2. Fill in all required frontmatter fields
3. Set `security_status: unverified`
4. Run `python3 scripts/validate_md.py skills/` (coming soon)
5. Open a PR — the security scanner CI will run automatically
