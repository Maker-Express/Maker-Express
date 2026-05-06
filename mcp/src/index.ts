#!/usr/bin/env node
/**
 * MakerHub India MCP Server
 *
 * Exposes the MakerHub India API as MCP tools so AI agents can search and
 * query India's hardware ecosystem directory.
 *
 * Usage:
 *   MAKERHUB_API_KEY=your_key node dist/index.js
 */

import { Server } from '@modelcontextprotocol/sdk/server/index.js'
import { StdioServerTransport } from '@modelcontextprotocol/sdk/server/stdio.js'
import {
  CallToolRequestSchema,
  ListToolsRequestSchema,
  type Tool,
} from '@modelcontextprotocol/sdk/types.js'

const API_BASE = process.env.MAKERHUB_API_URL ?? 'https://api.makerhub.in'
const API_KEY  = process.env.MAKERHUB_API_KEY ?? ''

// ── API helpers ───────────────────────────────────────────────────────────────

async function apiGet<T>(path: string): Promise<T> {
  const url = `${API_BASE}${path}`
  const res = await fetch(url, {
    headers: {
      'X-MakerHub-Key': API_KEY,
      'Accept': 'application/json',
      'User-Agent': 'MakerHub-MCP/1.0',
    },
  })
  if (!res.ok) {
    const text = await res.text()
    throw new Error(`API error ${res.status}: ${text}`)
  }
  return res.json() as Promise<T>
}

type SearchResult = { resources: unknown[]; total: number; page: number }

// ── Tool definitions ──────────────────────────────────────────────────────────

const TOOLS: Tool[] = [
  {
    name: 'search_resources',
    description:
      'Search the MakerHub India directory for hardware ecosystem resources. ' +
      'Filter by type (testing-lab, pcb-fab, makerspace, etc.), city, category, or keyword.',
    inputSchema: {
      type: 'object',
      properties: {
        q:        { type: 'string',  description: 'Full-text search query' },
        type:     { type: 'string',  description: 'Resource type (e.g. testing-lab, pcb-fab, makerspace)' },
        city:     { type: 'string',  description: 'City name (e.g. Bangalore, Mumbai, Chennai)' },
        state:    { type: 'string',  description: 'State name' },
        category: { type: 'string',  description: 'Capability category (e.g. electronics, mechanical, medical)' },
        tags:     { type: 'string',  description: 'Comma-separated tags (e.g. emc,nabl,iso17025)' },
        limit:    { type: 'number',  description: 'Max results to return (default 10, max 50)' },
        page:     { type: 'number',  description: 'Page number (default 1)' },
      },
    },
  },
  {
    name: 'get_resource',
    description: 'Get full details for a specific resource by its slug.',
    inputSchema: {
      type: 'object',
      required: ['slug'],
      properties: {
        slug: { type: 'string', description: 'Resource slug (e.g. iit-bombay-ncair, stqc-bangalore)' },
      },
    },
  },
  {
    name: 'list_resource_types',
    description: 'List all available resource types with their counts.',
    inputSchema: { type: 'object', properties: {} },
  },
  {
    name: 'list_cities',
    description: 'List cities that have resources, with resource counts.',
    inputSchema: {
      type: 'object',
      properties: {
        type: { type: 'string', description: 'Filter by resource type' },
      },
    },
  },
  {
    name: 'get_grants',
    description: 'Get funding and grant opportunities for hardware startups in India.',
    inputSchema: {
      type: 'object',
      properties: {
        stage:    { type: 'string', description: 'Startup stage: idea, prototype, early, growth, any' },
        category: { type: 'string', description: 'Sector: electronics, biotech, aerospace, etc.' },
        limit:    { type: 'number', description: 'Max results (default 10)' },
      },
    },
  },
]

// ── Tool handlers ─────────────────────────────────────────────────────────────

async function handleSearchResources(args: Record<string, unknown>): Promise<string> {
  const params = new URLSearchParams()
  if (args.q)        params.set('q',        String(args.q))
  if (args.type)     params.set('type',     String(args.type))
  if (args.city)     params.set('city',     String(args.city))
  if (args.state)    params.set('state',    String(args.state))
  if (args.category) params.set('category', String(args.category))
  if (args.tags)     params.set('tags',     String(args.tags))
  params.set('limit', String(Math.min(Number(args.limit ?? 10), 50)))
  params.set('page',  String(Number(args.page ?? 1)))

  const result = await apiGet<SearchResult>(`/v1/resources?${params}`)
  const resources = Array.isArray(result.resources) ? result.resources : []

  if (resources.length === 0) {
    return `No resources found matching your query. Try broadening the search.`
  }

  const lines = [`Found ${result.total} resource(s) (showing ${resources.length}):\n`]
  for (const r of resources as Record<string, unknown>[]) {
    lines.push(
      `**${r.name}** (${r.type})\n` +
      `  City: ${r.city}, ${r.state}\n` +
      (r.description_short ? `  ${r.description_short}\n` : '') +
      (r.website ? `  Website: ${r.website}\n` : '') +
      `  Slug: ${r.slug}  |  Access level: ${r.access_level ?? '?'}\n`
    )
  }
  return lines.join('\n')
}

async function handleGetResource(args: Record<string, unknown>): Promise<string> {
  const slug = String(args.slug ?? '').trim().toLowerCase().replace(/[^a-z0-9-]/g, '')
  if (!slug) return 'Error: slug is required'

  const r = await apiGet<Record<string, unknown>>(`/v1/resources/${slug}`)

  const lines = [
    `# ${r.name}`,
    `**Type:** ${r.type}  |  **City:** ${r.city}, ${r.state}`,
    `**Access level:** ${r.access_level ?? 'unknown'} (0=open, 4=restricted)`,
    '',
  ]
  if (r.description_short) lines.push(String(r.description_short), '')
  if (r.website) lines.push(`**Website:** ${r.website}`)
  if (r.email)   lines.push(`**Email:** ${r.email}`)
  if (r.phone)   lines.push(`**Phone:** ${r.phone}`)
  if (Array.isArray(r.equipment) && r.equipment.length)
    lines.push(`**Equipment:** ${r.equipment.join(', ')}`)
  if (Array.isArray(r.certifications) && r.certifications.length)
    lines.push(`**Certifications:** ${r.certifications.join(', ')}`)
  if (Array.isArray(r.tags) && r.tags.length)
    lines.push(`**Tags:** ${(r.tags as string[]).join(', ')}`)

  return lines.join('\n')
}

async function handleListTypes(): Promise<string> {
  const data = await apiGet<{ types: Array<{ type: string; count: number }> }>('/v1/stats/types')
  if (!data.types?.length) return 'No type data available.'
  return data.types
    .sort((a, b) => b.count - a.count)
    .map(t => `${t.count.toString().padStart(5)}  ${t.type}`)
    .join('\n')
}

async function handleListCities(args: Record<string, unknown>): Promise<string> {
  const params = new URLSearchParams()
  if (args.type) params.set('type', String(args.type))
  const data = await apiGet<{ cities: Array<{ city: string; count: number }> }>(
    `/v1/stats/cities?${params}`
  )
  if (!data.cities?.length) return 'No city data available.'
  return data.cities
    .sort((a, b) => b.count - a.count)
    .slice(0, 30)
    .map(c => `${c.count.toString().padStart(5)}  ${c.city}`)
    .join('\n')
}

async function handleGetGrants(args: Record<string, unknown>): Promise<string> {
  const params = new URLSearchParams()
  if (args.stage)    params.set('stage',    String(args.stage))
  if (args.category) params.set('category', String(args.category))
  params.set('limit', String(Math.min(Number(args.limit ?? 10), 50)))

  const data = await apiGet<{ grants: unknown[]; total: number }>(`/v1/funding?${params}`)
  const grants = Array.isArray(data.grants) ? data.grants : []
  if (!grants.length) return 'No grants found for your criteria.'

  const lines = [`Found ${data.total} funding opportunity(ies):\n`]
  for (const g of grants as Record<string, unknown>[]) {
    lines.push(
      `**${g.name}** (${g.type})\n` +
      (g.description ? `  ${g.description}\n` : '') +
      (g.award_range ? `  Award: ${g.award_range}\n` : '') +
      (g.url ? `  URL: ${g.url}\n` : '')
    )
  }
  return lines.join('\n')
}

// ── Server setup ──────────────────────────────────────────────────────────────

const server = new Server(
  { name: 'makerhub-india', version: '1.0.0' },
  { capabilities: { tools: {} } },
)

server.setRequestHandler(ListToolsRequestSchema, async () => ({ tools: TOOLS }))

server.setRequestHandler(CallToolRequestSchema, async (req) => {
  const { name, arguments: args = {} } = req.params
  const a = args as Record<string, unknown>

  try {
    let text: string
    switch (name) {
      case 'search_resources':    text = await handleSearchResources(a); break
      case 'get_resource':        text = await handleGetResource(a); break
      case 'list_resource_types': text = await handleListTypes(); break
      case 'list_cities':         text = await handleListCities(a); break
      case 'get_grants':          text = await handleGetGrants(a); break
      default:
        return { content: [{ type: 'text', text: `Unknown tool: ${name}` }], isError: true }
    }
    return { content: [{ type: 'text', text }] }
  } catch (err) {
    const msg = err instanceof Error ? err.message : String(err)
    return { content: [{ type: 'text', text: `Error: ${msg}` }], isError: true }
  }
})

const transport = new StdioServerTransport()
await server.connect(transport)
