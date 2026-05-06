# MakerHub India MCP Server

Connect any MCP-compatible AI client to the MakerHub India directory.

## What this does

This MCP server exposes the MakerHub India API as tools that AI agents can call:

| Tool | Description |
|------|-------------|
| `search_resources` | Full-text search with filters (type, city, category) |
| `get_resource` | Get full details for a specific resource by slug |
| `list_types` | List all resource types and counts |
| `list_cities` | List cities with resource counts |
| `get_grants` | Get funding/grant opportunities |
| `find_nearby` | Find resources near a city (by type) |

## Setup

### 1. Get a free API key

Register at [makerhub.in/api](https://makerhub.in/api) for a free key (1,000 requests/day).

### 2. Install

```bash
cd mcp
npm install
```

### 3. Configure your AI client

**Claude Desktop** (`~/Library/Application Support/Claude/claude_desktop_config.json`):
```json
{
  "mcpServers": {
    "makerhub": {
      "command": "node",
      "args": ["/path/to/mcp/dist/index.js"],
      "env": {
        "MAKERHUB_API_KEY": "your_key_here"
      }
    }
  }
}
```

**Cursor / Continue / other MCP clients:** See their docs for MCP server configuration.

## Usage examples

Once connected, you can ask your AI:

```
"Find EMC testing labs in Bangalore"
→ search_resources(type="testing-lab", city="Bangalore", tags=["emc"])

"What PCB fabs are available in Mumbai with quick turnaround?"
→ search_resources(type="pcb-fab", city="Mumbai")

"Get details for STQC Bangalore"
→ get_resource(slug="stqc-bangalore")

"What government grants are available for hardware startups?"
→ get_grants(stage="early")
```

## Development

```bash
npm run dev     # TypeScript watch mode
npm run build   # Compile to dist/
npm test        # Run tests
```

## Self-hosting

The MCP server connects to `https://api.makerhub.in` by default.
To point at a self-hosted API:

```bash
export MAKERHUB_API_URL=http://localhost:8080
```

## License

MIT — See [../LICENSE](../LICENSE)
