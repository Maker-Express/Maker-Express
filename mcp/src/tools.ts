/**
 * MCP tool definitions — each tool maps to a Rust /mcp/* endpoint.
 * Uses raw Zod shapes (ZodRawShapeCompat) for registerTool compatibility.
 */

import { createRequire } from 'module'
import { z } from 'zod'
import { api } from './client.js'

const require = createRequire(import.meta.url)

// ── Static JSON registries (served without DB) ────────────────────────────────

function loadJson<T>(relPath: string): T {
  try {
    return require(relPath) as T
  } catch {
    return [] as unknown as T
  }
}

export interface ToolDef<Shape extends Record<string, z.ZodTypeAny>> {
  name: string
  description: string
  inputShape: Shape
  execute: (input: z.infer<z.ZodObject<Shape>>) => Promise<unknown>
}

const taxonomyToken = z.string()
  .trim()
  .min(1)
  .max(80)
  .transform((value) => value.toLowerCase().replace(/[\s_]+/g, '-'))
  .refine(
    (value) => /^[a-z0-9][a-z0-9-]*$/.test(value),
    'Use a taxonomy token such as testing-lab, 3d-printing, grant, investor, or component-supplier'
  )

// ─── search_resources ─────────────────────────────────────────────────────────

const searchResourcesShape = {
  query: z.string().optional().describe('Free-text search query'),
  q: z.string().optional().describe('Compatibility alias for query'),
  resource_type: taxonomyToken.optional()
    .describe('Filter by live resource taxonomy token. Examples: testing-lab, 3d-printing, prototyping-lab, grant, investor, component-supplier. Use get_platform_stats/list_resource_types to discover current values.'),
  type: taxonomyToken.optional().describe('Compatibility alias for resource_type'),
  category: z.string().optional().describe('Filter by category tag'),
  city: z.string().optional().describe('Filter by city name'),
  limit: z.number().int().min(1).max(50).optional().describe('Compatibility alias for max_results'),
  max_results: z.number().int().min(1).max(50).default(10).describe('Max results to return'),
}

export const searchResources: ToolDef<typeof searchResourcesShape> = {
  name: 'search_resources',
  description:
    'Search the Maker Express / Hardstack directory for labs, makerspaces, testing facilities, suppliers, PCB fabs, and more. ' +
    'Returns matching resources with contact details, equipment lists, and direct URLs.',
  inputShape: searchResourcesShape,
  execute: (input) => api.searchResources({
    ...input,
    query: input.query ?? input.q,
    resource_type: input.resource_type ?? input.type,
    max_results: input.max_results ?? input.limit,
  }),
}

// ─── find_labs_for_certification ─────────────────────────────────────────────

const findLabsShape = {
  certification: z.string().describe(
    'Certification code to search for, e.g. "bis", "fcc", "ce", "iso17025", "nabl"'
  ),
  city: z.string().optional().describe('Prefer labs in this city'),
  max_results: z.number().int().min(1).max(20).default(5).describe('Max results'),
}

export const findLabsForCertification: ToolDef<typeof findLabsShape> = {
  name: 'find_labs_for_certification',
  description:
    'Find accredited testing labs in India that can issue a specific certification. ' +
    'Use this when a maker needs BIS, FCC, CE, NABL, or other compliance testing.',
  inputShape: findLabsShape,
  execute: (input) => api.findLabsForCertification(input),
}

// ─── list_grants ─────────────────────────────────────────────────────────────

const listGrantsShape = {
  category: z.string().optional().describe('Filter by category, e.g. "electronics", "healthcare", "deep-tech"'),
  stage: z.string().optional().describe('Compatibility hint for startup stage; forwarded as tag when category is absent'),
  tag: z.string().optional().describe('Filter by tag, e.g. "hardware", "deep-tech", "msme"'),
  open_only: z.boolean().default(true).describe('Only return currently open grants'),
}

export const listGrants: ToolDef<typeof listGrantsShape> = {
  name: 'list_grants',
  description:
    'List government grants and schemes available to hardware startups and makers. ' +
    'Returns grant names, funding amounts, deadlines, and application URLs.',
  inputShape: listGrantsShape,
  execute: (input) => api.listGrants({
    ...input,
    tag: input.tag ?? input.stage,
  }),
}

export const getGrants: ToolDef<typeof listGrantsShape> = {
  name: 'get_grants',
  description:
    'Compatibility alias for list_grants. Use this for older public skills that call get_grants().',
  inputShape: listGrantsShape,
  execute: (input) => listGrants.execute(input),
}

// ─── get_resource_details ─────────────────────────────────────────────────────

const getResourceShape = {
  slug: z.string().describe('Resource slug, e.g. "iitb-fablab" or "tinkerers-lab-delhi"'),
}

export const getResourceDetails: ToolDef<typeof getResourceShape> = {
  name: 'get_resource_details',
  description:
    'Get full details about a specific resource in the Maker Express / Hardstack directory. ' +
    'Includes equipment, certifications, contact info, pricing tier, and turnaround times.',
  inputShape: getResourceShape,
  execute: (input) => api.getResourceDetails(input),
}

export const getResource: ToolDef<typeof getResourceShape> = {
  name: 'get_resource',
  description:
    'Compatibility alias for get_resource_details. Use this for older public skills that call get_resource().',
  inputShape: getResourceShape,
  execute: (input) => getResourceDetails.execute(input),
}

// ─── search_events ────────────────────────────────────────────────────────────

const searchEventsShape = {
  query: z.string().optional().describe('Search term for event title'),
  city: z.string().optional().describe('Filter by city'),
  event_type: z.enum([
    'hackathon', 'workshop', 'conference', 'exhibition', 'meetup', 'competition', 'other',
  ]).optional().describe('Filter by event type'),
}

export const searchEvents: ToolDef<typeof searchEventsShape> = {
  name: 'search_events',
  description:
    'Search upcoming hardware events in India — hackathons, workshops, maker faires, conferences. ' +
    'Returns events with dates, locations, and registration URLs.',
  inputShape: searchEventsShape,
  execute: (input) => api.searchEvents(input),
}

// ─── get_platform_stats ───────────────────────────────────────────────────────

const getPlatformStatsShape = {}

export const getPlatformStats: ToolDef<typeof getPlatformStatsShape> = {
  name: 'get_platform_stats',
  description:
    'Get aggregate statistics about the Maker Express / Hardstack platform — total resources, cities covered, ' +
    'resource type breakdown, and top cities.',
  inputShape: getPlatformStatsShape,
  execute: (_input) => api.getStats(),
}

export const listResourceTypes: ToolDef<typeof getPlatformStatsShape> = {
  name: 'list_resource_types',
  description:
    'Compatibility helper for public skills. Returns platform statistics including resource-type breakdowns when available.',
  inputShape: getPlatformStatsShape,
  execute: async (_input) => {
    const stats = await api.getStats()
    return {
      ...stats,
      compatibility_tool: 'list_resource_types',
      note: 'Use by_type/resource_types fields when present; this response intentionally includes the full stats payload.',
    }
  },
}

export const listCities: ToolDef<typeof getPlatformStatsShape> = {
  name: 'list_cities',
  description:
    'Compatibility helper for public skills. Returns platform statistics including city coverage when available.',
  inputShape: getPlatformStatsShape,
  execute: async (_input) => {
    const stats = await api.getStats()
    return {
      ...stats,
      compatibility_tool: 'list_cities',
      note: 'Use top_cities/cities fields when present; this response intentionally includes the full stats payload.',
    }
  },
}

// ─── list_skills ──────────────────────────────────────────────────────────────

const listSkillsShape = {
  source: z.enum(['first-party', 'third-party', 'all']).default('all')
    .describe('Filter by skill source: first-party (Maker Express), third-party (community-verified), or all'),
  category: z.string().optional()
    .describe('Filter by skill category tag, e.g. "cad", "robotics", "pcb", "testing"'),
  security_status: z.enum(['verified', 'audited', 'third-party-verified', 'all']).default('all')
    .describe('Filter by security audit status'),
}

export const listSkills: ToolDef<typeof listSkillsShape> = {
  name: 'list_skills',
  description:
    'List Maker Express agent skills — both first-party hardware skills and community-verified third-party skills. ' +
    'Returns skill names, descriptions, tags, security status, source attribution, and install instructions. ' +
    'Use this when an agent wants to discover what skills are available for hardware tasks.',
  inputShape: listSkillsShape,
  execute: async (input) => {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const registry = loadJson<{ skills: any[] }>('./data/skills-registry.json')
    const skills = registry.skills ?? []
    const isFirstParty = (s: { source_author?: string; id?: string }) => {
      const author = String(s.source_author ?? 'Maker Express').trim().toLowerCase()
      if (author === 'makerhub' || author === 'maker express' || author === 'hardstack') return true
      if (author) return false
      return !String(s.id ?? '').startsWith('cadskills-')
    }
    const getSecurityStatus = (s: { source_author?: string; id?: string; audit?: { overall?: string } }) => {
      const approved = String(s.audit?.overall ?? '').toUpperCase() === 'APPROVED'
      if (approved && !isFirstParty(s)) return 'third-party-verified'
      if (approved) return 'verified'
      if (s.audit) return 'audited'
      return 'unverified'
    }

    let filtered = skills
    if (input.source === 'first-party') {
      filtered = filtered.filter((s) => isFirstParty(s))
    } else if (input.source === 'third-party') {
      filtered = filtered.filter((s) => !isFirstParty(s))
    }
    if (input.category) {
      const cat = input.category.toLowerCase()
      filtered = filtered.filter((s) =>
        (s.tags ?? []).some((t: string) => t.toLowerCase().includes(cat)) ||
        (s.display_name ?? '').toLowerCase().includes(cat)
      )
    }
    if (input.security_status !== 'all') {
      filtered = filtered.filter((s) => getSecurityStatus(s) === input.security_status)
    }

      return {
        total: filtered.length,
        skills: filtered.map((s) => ({
        id: s.id,
        name: s.display_name,
        description: s.description,
        tags: s.tags ?? [],
        source: s.source_author ?? 'Maker Express',
        source_url: s.source_url,
        license: s.source_license,
        security_status: getSecurityStatus(s),
        pinned_sha: s.pinned_commit_sha?.slice(0, 7),
        audited_at: s.audit?.audited_at,
        install: {
          claude_code: `mkdir -p ~/.claude/skills/${s.id} && curl -fsSL ${s.raw_url ?? s.source_url} -o ~/.claude/skills/${s.id}/SKILL.md`,
          repo: `https://github.com/${s.source_repo}`,
        },
      })),
      _meta: {
        source_note: 'Third-party skills are version-pinned to a reviewed commit. Updates require a new security audit.',
        submit_skill: 'https://github.com/Maker-Express/Maker-Express/issues/new?labels=community-skill',
      },
    }
  },
}

// ─── suggest_skills ───────────────────────────────────────────────────────────

const suggestSkillsShape = {
  task: z.string().describe('Describe what you are trying to accomplish, e.g. "generate a URDF for a robotic arm"'),
  agent_type: z.enum(['claude', 'codex', 'cursor', 'generic']).default('generic')
    .describe('The AI agent type — helps match install format'),
}

export const suggestSkills: ToolDef<typeof suggestSkillsShape> = {
  name: 'suggest_skills',
  description:
    'Given a task description, suggest relevant Maker Express skills that could help. ' +
    'Use this when an agent wants to self-augment with the right skill for a hardware task.',
  inputShape: suggestSkillsShape,
  execute: async (input) => {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const registry = loadJson<{ skills: any[] }>('./data/skills-registry.json')
    const skills = registry.skills ?? []
    const isFirstParty = (s: { source_author?: string; id?: string }) => {
      const author = String(s.source_author ?? 'Maker Express').trim().toLowerCase()
      if (author === 'makerhub' || author === 'maker express' || author === 'hardstack') return true
      return !String(s.id ?? '').startsWith('cadskills-')
    }
    const getSecurityStatus = (s: { source_author?: string; id?: string; audit?: { overall?: string } }) => {
      const approved = String(s.audit?.overall ?? '').toUpperCase() === 'APPROVED'
      if (approved && !isFirstParty(s)) return 'third-party-verified'
      if (approved) return 'verified'
      if (s.audit) return 'audited'
      return 'unverified'
    }

    const taskLower = input.task.toLowerCase()
    const keywords = taskLower.split(/\W+/).filter((w) => w.length > 3)

    // Score each skill by keyword overlap with task
    const scored = skills
      .map((s) => {
        const searchText = [
          s.display_name ?? '',
          s.description ?? '',
          ...(s.tags ?? []),
        ].join(' ').toLowerCase()

        let score = 0
        for (const kw of keywords) {
          if (searchText.includes(kw)) score += 1
        }
        return { skill: s, score }
      })
      .filter(({ score }) => score > 0)
      .sort((a, b) => b.score - a.score)
      .slice(0, 5)

    if (scored.length === 0) {
      return {
        suggestions: [],
        message: 'No skills matched the task description. Try describing the task differently or check list_skills for all available skills.',
      }
    }

    return {
      suggestions: scored.map(({ skill: s, score }) => ({
        id: s.id,
        name: s.display_name,
        description: s.description,
        relevance_score: score,
        tags: s.tags ?? [],
        source: s.source_author ?? 'Maker Express',
        security_status: getSecurityStatus(s),
        install: input.agent_type === 'claude'
          ? `mkdir -p ~/.claude/skills/${s.id} && curl -fsSL ${s.raw_url ?? s.source_url} -o ~/.claude/skills/${s.id}/SKILL.md`
          : `# Download from https://github.com/${s.source_repo}/blob/main/${s.source_path}`,
      })),
    }
  },
}

// ─── list_github_resources ────────────────────────────────────────────────────

const listGithubResourcesShape = {
  domain: z.enum([
    'cad', 'embedded', 'pcb', 'robotics', 'manufacturing',
    'materials', 'testing', 'ip', 'business', 'agent-skills', 'all',
  ]).default('all').describe('Filter by domain'),
  type: z.enum(['awesome-list', 'skill-repo', 'tool', 'reference', 'all']).default('all')
    .describe('Filter by resource type'),
  max_results: z.number().int().min(1).max(100).default(20)
    .describe('Max results to return'),
}

export const listGithubResources: ToolDef<typeof listGithubResourcesShape> = {
  name: 'list_github_resources',
  description:
    'List curated hardware GitHub repositories and awesome-lists organized by domain. ' +
    'Includes CAD tools, embedded frameworks, PCB resources, robotics, manufacturing, and more. ' +
    'All repos are verified: stars > 100, license permissive, actively maintained.',
  inputShape: listGithubResourcesShape,
  execute: async (input) => {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const registry = loadJson<{ resources: any[] }>('./data/github-resources.json')
    let resources = registry.resources ?? []

    if (input.domain !== 'all') {
      resources = resources.filter((r) => r.domain === input.domain)
    }
    if (input.type !== 'all') {
      resources = resources.filter((r) => r.type === input.type)
    }

    resources = resources.slice(0, input.max_results)

    // Group by domain for convenience
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const byDomain: Record<string, any[]> = {}
    for (const r of resources) {
      if (!byDomain[r.domain]) byDomain[r.domain] = []
      byDomain[r.domain].push({
        id: r.id,
        repo: r.repo,
        url: r.url,
        stars: r.stars,
        description: r.description,
        type: r.type,
        license: r.license,
        credit: r.credit,
      })
    }

    return {
      total: resources.length,
      domains: Object.keys(byDomain).sort(),
      resources_by_domain: byDomain,
      all_resources: resources,
    }
  },
}

// ─── All tools (type-erased for iteration) ───────────────────────────────────

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const ALL_TOOLS: ToolDef<any>[] = [
  searchResources,
  findLabsForCertification,
  listGrants,
  getGrants,
  getResourceDetails,
  getResource,
  searchEvents,
  getPlatformStats,
  listResourceTypes,
  listCities,
  listSkills,
  suggestSkills,
  listGithubResources,
]
