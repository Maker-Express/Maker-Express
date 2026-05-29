#!/usr/bin/env node
/**
 * Maker Express + Hardstack — MCP Server
 *
 * Exposes the shared hardware directory as MCP tools for Claude, Codex,
 * Cursor, and any other MCP-compatible AI client.
 *
 * Usage (local dev):
 *   npm run dev
 *
 * Usage (production):
 *   HARDWARE_DIRECTORY_API_URL=https://api.maker.express node dist/index.js
 *
 * Claude Desktop config (~/.config/claude/claude_desktop_config.json):
 * {
 *   "mcpServers": {
 *     "maker-express": {
 *       "command": "node",
 *       "args": ["/path/to/Maker-Express/mcp/dist/index.js"],
 *       "env": { "HARDWARE_DIRECTORY_API_URL": "http://localhost:8080" }
 *     }
 *   }
 * }
 */

import { McpServer } from '@modelcontextprotocol/sdk/server/mcp.js'
import { StdioServerTransport } from '@modelcontextprotocol/sdk/server/stdio.js'
import { ALL_TOOLS } from './tools.js'

const server = new McpServer({
  name: 'maker-express-hardstack',
  version: '0.2.0',
})

// Register all tools using the non-deprecated registerTool API
for (const tool of ALL_TOOLS) {
  server.registerTool(
    tool.name,
    {
      description: tool.description,
      inputSchema: tool.inputShape,
    },
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    async (input: any) => {
      const result = await tool.execute(input)
      return {
        content: [
          {
            type: 'text' as const,
            text: JSON.stringify(result, null, 2),
          },
        ],
      }
    }
  )
}

const transport = new StdioServerTransport()
await server.connect(transport)
// Log to stderr so stdout stays clean for MCP JSON-RPC
console.error('[maker-express-mcp] Server running — %d tools registered', ALL_TOOLS.length)
