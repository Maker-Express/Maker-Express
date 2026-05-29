/**
 * Thin HTTP client for MCP tools.
 *
 * Compatibility behavior:
 * - Primary path: legacy `/mcp/*` endpoints.
 * - Fallback path: current `/v1/*` + `/api/v1/*` endpoints when `/mcp/*` is not present.
 * - Auth failures fail closed when credentials are configured. Anonymous clients may
 *   fall back from protected `/mcp/*` to public read-only endpoints.
 */

const API_BASE =
  process.env['HARDWARE_DIRECTORY_API_URL'] ??
  process.env['MAKERHUB_API_URL'] ??
  'http://localhost:8080'

const API_KEY =
  process.env['HARDWARE_DIRECTORY_API_KEY'] ??
  process.env['MAKERHUB_API_KEY'] ??
  ''

const SERVICE_KEY =
  process.env['HARDWARE_DIRECTORY_MCP_SERVICE_KEY'] ??
  process.env['MAKERHUB_MCP_SERVICE_KEY'] ??
  ''

const HAS_CONFIGURED_CREDENTIALS = Boolean(API_KEY.trim() || SERVICE_KEY.trim())

type QueryParams = Record<string, string | number | boolean | undefined>

interface RequestAttempt {
  path: string
  params: QueryParams
}

interface HttpResult<T> {
  ok: boolean
  status: number
  body: string
  json: T | null
}

function makeUrl(path: string, params: QueryParams): URL {
  const base = API_BASE.endsWith('/') ? API_BASE : `${API_BASE}/`
  const url = new URL(path.startsWith('/') ? path.slice(1) : path, base)
  for (const [key, value] of Object.entries(params)) {
    if (value !== undefined) {
      url.searchParams.set(key, String(value))
    }
  }
  return url
}

async function fetchJson<T>(attempt: RequestAttempt): Promise<HttpResult<T>> {
  const url = makeUrl(attempt.path, attempt.params)
  const headers: Record<string, string> = { Accept: 'application/json' }
  if (API_KEY.trim()) {
    headers['Authorization'] = `Bearer ${API_KEY.trim()}`
  }
  if (SERVICE_KEY.trim()) {
    headers['x-mcp-service-key'] = SERVICE_KEY.trim()
  }

  const res = await fetch(url.toString(), {
    headers,
    signal: AbortSignal.timeout(10_000),
  })

  const body = await res.text().catch(() => '')
  if (!res.ok) {
    return { ok: false, status: res.status, body, json: null }
  }

  if (!body) {
    return { ok: true, status: res.status, body, json: null }
  }

  try {
    return { ok: true, status: res.status, body, json: JSON.parse(body) as T }
  } catch {
    throw new Error(`Directory API returned invalid JSON from ${url.pathname}`)
  }
}

async function getCompat<T>(attempts: RequestAttempt[]): Promise<T> {
  let lastNotFound: { status: number; path: string; body: string } | null = null
  let lastAnonymousMcpAuthFailure: { status: number; path: string; body: string } | null = null

  for (const attempt of attempts) {
    const result = await fetchJson<T>(attempt)
    if (result.ok) {
      if (result.json === null) {
        throw new Error(`Directory API returned empty JSON body for ${attempt.path}`)
      }
      return result.json
    }

    // Compatibility fallback for endpoint-not-found variants.
    if (result.status === 404 || result.status === 405) {
      lastNotFound = { status: result.status, path: attempt.path, body: result.body }
      continue
    }

    // Secure downgrade rule:
    // - If credentials were configured, 401/403 must fail closed so a bad/revoked key
    //   is not silently bypassed by public fallback endpoints.
    // - If no credentials were configured and the protected `/mcp/*` endpoint rejects
    //   anonymous access, continue to public read-only fallbacks.
    if ((result.status === 401 || result.status === 403) && attempt.path.startsWith('/mcp/')) {
      if (HAS_CONFIGURED_CREDENTIALS) {
        throw new Error(
          `Directory API auth failed ${result.status} on ${attempt.path}; refusing public fallback because credentials are configured.`
        )
      }
      lastAnonymousMcpAuthFailure = { status: result.status, path: attempt.path, body: result.body }
      continue
    }

    throw new Error(`Directory API error ${result.status} on ${attempt.path}: ${result.body}`)
  }

  if (lastNotFound) {
    throw new Error(`Directory API error ${lastNotFound.status} on ${lastNotFound.path}: ${lastNotFound.body}`)
  }
  if (lastAnonymousMcpAuthFailure) {
    throw new Error(
      `Directory API auth failed ${lastAnonymousMcpAuthFailure.status} on ${lastAnonymousMcpAuthFailure.path}, and no public fallback succeeded.`
    )
  }
  throw new Error('Directory API error: no compatible endpoint attempts were configured')
}

// ─── Tool call types ──────────────────────────────────────────────────────────

export interface SearchResourcesParams {
  query?: string
  resource_type?: string
  category?: string
  city?: string
  max_results?: number
}

export interface FindLabsParams {
  certification: string
  city?: string
  max_results?: number
}

export interface ListGrantsParams {
  category?: string
  tag?: string
  open_only?: boolean
}

export interface GetResourceParams {
  slug: string
}

export interface SearchEventsParams {
  query?: string
  city?: string
  event_type?: string
}

function toQuery(obj: object): QueryParams {
  return Object.fromEntries(
    Object.entries(obj).filter(([, v]) => v !== undefined)
  ) as QueryParams
}

function legacyMcp(path: string, params: QueryParams): RequestAttempt {
  return { path, params }
}

function searchOrBrowseAttempts(prefix: '/v1' | '/api/v1', p: SearchResourcesParams): RequestAttempt {
  const query = p.query?.trim()
  const v1Params: QueryParams = {
    type: p.resource_type,
    city: p.city,
    page_size: p.max_results,
  }
  if (query && query.length >= 2) {
    return {
      path: `${prefix}/search`,
      params: { ...v1Params, q: query },
    }
  }
  return {
    path: `${prefix}/resources`,
    params: v1Params,
  }
}

function isGrantOpen(grant: Record<string, unknown>): boolean {
  const openUntil = grant['open_until']
  if (typeof openUntil !== 'string' || !openUntil.trim()) return true
  const parsed = Date.parse(openUntil)
  if (Number.isNaN(parsed)) return true
  return parsed >= Date.now()
}

function maybeFilterOpenGrants(payload: Record<string, unknown>, openOnly: boolean | undefined): Record<string, unknown> {
  if (!openOnly) return payload
  const rawData = payload['data']
  if (!Array.isArray(rawData)) return payload
  const filtered = rawData.filter((row): row is Record<string, unknown> => {
    return !!row && typeof row === 'object' && isGrantOpen(row as Record<string, unknown>)
  })
  return {
    ...payload,
    data: filtered,
    total: filtered.length,
  }
}

function maybeFilterEventsByQuery(payload: Record<string, unknown>, query: string | undefined): Record<string, unknown> {
  const q = query?.trim().toLowerCase()
  if (!q) return payload
  const rawData = payload['data']
  if (!Array.isArray(rawData)) return payload
  const filtered = rawData.filter((row): row is Record<string, unknown> => {
    if (!row || typeof row !== 'object') return false
    const title = String((row as Record<string, unknown>)['title'] ?? '').toLowerCase()
    const description = String((row as Record<string, unknown>)['description'] ?? '').toLowerCase()
    const organiser = String((row as Record<string, unknown>)['organiser'] ?? '').toLowerCase()
    return title.includes(q) || description.includes(q) || organiser.includes(q)
  })
  return {
    ...payload,
    data: filtered,
    total: filtered.length,
  }
}

// ─── API calls ────────────────────────────────────────────────────────────────

export const api = {
  searchResources: (p: SearchResourcesParams) =>
    getCompat<Record<string, unknown>>([
      legacyMcp('/mcp/search_resources', toQuery(p)),
      searchOrBrowseAttempts('/v1', p),
      searchOrBrowseAttempts('/api/v1', p),
    ]),

  findLabsForCertification: (p: FindLabsParams) =>
    getCompat<Record<string, unknown>>([
      legacyMcp('/mcp/find_labs_for_certification', toQuery(p)),
      {
        path: '/v1/search',
        params: {
          q: p.certification,
          type: 'testing-lab',
          city: p.city,
          page_size: p.max_results,
        },
      },
      {
        path: '/api/v1/search',
        params: {
          q: p.certification,
          type: 'testing-lab',
          city: p.city,
          page_size: p.max_results,
        },
      },
      {
        path: '/v1/resources',
        params: {
          type: 'testing-lab',
          city: p.city,
          page_size: p.max_results,
        },
      },
      {
        path: '/api/v1/resources',
        params: {
          type: 'testing-lab',
          city: p.city,
          page_size: p.max_results,
        },
      },
    ]),

  listGrants: async (p: ListGrantsParams) => {
    const payload = await getCompat<Record<string, unknown>>([
      legacyMcp('/mcp/list_grants', toQuery(p)),
      {
        path: '/v1/grants',
        params: {
          category: p.category ?? p.tag,
          limit: 50,
        },
      },
      {
        path: '/api/v1/grants',
        params: {
          category: p.category ?? p.tag,
          limit: 50,
        },
      },
    ])
    return maybeFilterOpenGrants(payload, p.open_only)
  },

  getResourceDetails: (p: GetResourceParams) =>
    getCompat<Record<string, unknown>>([
      legacyMcp('/mcp/get_resource_details', toQuery(p)),
      {
        path: `/v1/resources/${encodeURIComponent(p.slug)}`,
        params: {},
      },
      {
        path: `/api/v1/resources/${encodeURIComponent(p.slug)}`,
        params: {},
      },
    ]),

  searchEvents: async (p: SearchEventsParams) => {
    const payload = await getCompat<Record<string, unknown>>([
      legacyMcp('/mcp/search_events', toQuery(p)),
      {
        path: '/v1/events',
        params: {
          city: p.city,
          event_type: p.event_type,
          upcoming: true,
          page_size: 50,
        },
      },
      {
        path: '/api/v1/events',
        params: {
          city: p.city,
          event_type: p.event_type,
          upcoming: true,
          page_size: 50,
        },
      },
    ])
    return maybeFilterEventsByQuery(payload, p.query)
  },

  getStats: () =>
    getCompat<Record<string, unknown>>([
      { path: '/v1/stats', params: {} },
      { path: '/api/v1/stats', params: {} },
    ]),
}
