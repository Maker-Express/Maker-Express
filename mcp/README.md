# Maker Express + Hardstack MCP Server

Connect Claude Code, Codex, Cursor, or any MCP-compatible client to the shared Maker Express / Hardstack hardware directory.

This package is the public agent interface for the same data core used by [maker.express](https://maker.express) and [hardstack.xyz](https://hardstack.xyz). It exposes resource search, grants, events, platform stats, skills discovery, and curated hardware GitHub resources.

## Tools

| Tool | Purpose |
|---|---|
| `search_resources` | Search labs, makerspaces, suppliers, PCB fabs, consultants, investors, events, and other hardware resources. |
| `find_labs_for_certification` | Find labs for BIS, FCC, CE, NABL, ISO 17025, EMC, safety, and related certification work. |
| `list_grants` | List grants, schemes, and funding opportunities. |
| `get_resource_details` | Fetch one resource by slug. |
| `search_events` | Search hardware events and workshops. |
| `get_platform_stats` | Return live aggregate platform stats. |
| `list_skills` | Discover first-party and curated third-party skills. |
| `suggest_skills` | Suggest skills from a task description. |
| `list_github_resources` | List curated hardware GitHub repos and awesome-lists. |

Compatibility aliases are also registered for older public skills: `get_resource`, `get_grants`, `list_resource_types`, and `list_cities`.

## Install

```bash
cd mcp
npm install
npm run build
```

## Configure

Set the API origin and optional access keys through environment variables. Do not hardcode secrets in MCP client config files that are committed to git.

```bash
export HARDWARE_DIRECTORY_API_URL="https://api.maker.express"
export HARDWARE_DIRECTORY_API_KEY="optional_read_key"
export HARDWARE_DIRECTORY_MCP_SERVICE_KEY="optional_service_key"
node dist/index.js
```

`HARDWARE_DIRECTORY_API_URL` can point to either brand as long as it exposes the same API contract.

## Claude Desktop Example

```json
{
  "mcpServers": {
    "maker-express": {
      "command": "node",
      "args": ["/absolute/path/to/Maker-Express/mcp/dist/index.js"],
      "env": {
        "HARDWARE_DIRECTORY_API_URL": "https://api.maker.express"
      }
    }
  }
}
```

## Example Prompts

```text
Find EMC pre-compliance labs near Delhi for an IoT device.
```

```text
Suggest agent skills for preparing an injection moulding RFQ.
```

```text
List active grants for an early-stage robotics hardware startup.
```

## Validation

```bash
npm run typecheck
npm run build
npm run smoke
HARDWARE_DIRECTORY_API_URL=https://api.maker.express npm run smoke:prod
```

The smoke test verifies that all tools are registered and can optionally call the live API. It retries 429 responses before failing so production health checks do not become flaky under short bursts.

## API Compatibility Rules

- `resource_type` accepts a bounded taxonomy token rather than a hardcoded enum. Use `get_platform_stats` or `list_resource_types` to discover current values such as `testing-lab`, `3d-printing`, `grant`, `investor`, or `component-supplier`.
- The client tries `/mcp/*` first, then public read-only `/v1/*` and `/api/v1/*` fallbacks where safe.
- If API or service credentials are configured and `/mcp/*` returns `401` or `403`, the client fails closed instead of silently downgrading to public routes.

## Security

- Reads secrets only from environment variables.
- Sends API keys as `Authorization: Bearer ...` when provided.
- Sends service keys as `x-mcp-service-key` when provided.
- Logs only MCP startup/tool count to stderr; tool responses remain on stdout as JSON-RPC payloads.
- Third-party skills returned by `list_skills` are version-pinned and audit-gated.

## License

MIT for code in `mcp/`. Public data and skills are covered by the repo-level license notes.
