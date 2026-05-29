#!/usr/bin/env node

import http from 'node:http'
import { existsSync } from 'node:fs'
import path from 'node:path'
import process from 'node:process'
import { fileURLToPath } from 'node:url'
import { Client } from '@modelcontextprotocol/sdk/client/index.js'
import { StdioClientTransport } from '@modelcontextprotocol/sdk/client/stdio.js'

const scriptDir = path.dirname(fileURLToPath(import.meta.url))
const packageRoot = path.resolve(scriptDir, '..')
const serverEntry = path.join(packageRoot, 'dist', 'index.js')

function parseToolText(result) {
  const block = result?.content?.find((entry) => entry?.type === 'text')
  if (!block?.text) return null
  try {
    return JSON.parse(block.text)
  } catch {
    return null
  }
}

function startMockApi() {
  const hits = []
  const server = http.createServer((req, res) => {
    const url = new URL(req.url ?? '/', 'http://127.0.0.1')
    hits.push({ path: url.pathname, auth: req.headers.authorization ?? '', serviceKey: req.headers['x-mcp-service-key'] ?? '' })

    if (url.pathname === '/mcp/search_resources') {
      res.writeHead(401, { 'content-type': 'application/json' })
      res.end(JSON.stringify({ error: 'mcp auth required' }))
      return
    }

    if (url.pathname === '/v1/search' || url.pathname === '/api/v1/search') {
      res.writeHead(200, { 'content-type': 'application/json' })
      res.end(JSON.stringify({ total: 1, data: [{ id: 'public-fallback-fixture', name: 'Public fallback fixture' }] }))
      return
    }

    res.writeHead(404, { 'content-type': 'application/json' })
    res.end(JSON.stringify({ error: 'not found' }))
  })

  return new Promise((resolve, reject) => {
    server.once('error', reject)
    server.listen(0, '127.0.0.1', () => {
      const address = server.address()
      if (!address || typeof address === 'string') {
        reject(new Error('Mock server did not expose an IPv4 port'))
        return
      }
      resolve({ server, baseUrl: `http://127.0.0.1:${address.port}`, hits })
    })
  })
}

async function callSearch(apiUrl, env = {}) {
  const transport = new StdioClientTransport({
    command: process.execPath,
    args: [serverEntry],
    cwd: packageRoot,
    env: {
      ...process.env,
      HARDWARE_DIRECTORY_API_URL: apiUrl,
      MAKERHUB_API_URL: apiUrl,
      ...env,
    },
    stderr: 'pipe',
  })

  const client = new Client(
    { name: 'mcp-auth-fallback-smoke', version: '1.0.0' },
    { capabilities: {} }
  )

  try {
    await client.connect(transport)
    return await client.callTool({
      name: 'search_resources',
      arguments: { query: 'fixture', max_results: 1 },
    })
  } finally {
    await client.close().catch(() => {})
    await transport.close().catch(() => {})
  }
}

async function main() {
  if (!existsSync(serverEntry)) {
    throw new Error(`Build artifact missing: ${serverEntry}. Run this package build script before smoke.`)
  }

  const { server, baseUrl, hits } = await startMockApi()
  try {
    const anonymous = await callSearch(baseUrl, {
      HARDWARE_DIRECTORY_API_KEY: '',
      MAKERHUB_API_KEY: '',
      HARDWARE_DIRECTORY_MCP_SERVICE_KEY: '',
      MAKERHUB_MCP_SERVICE_KEY: '',
    })
    if (anonymous?.isError) {
      throw new Error(`Anonymous fallback should succeed, got tool error: ${anonymous.content?.[0]?.text ?? 'unknown'}`)
    }
    const anonymousPayload = parseToolText(anonymous)
    if (Number(anonymousPayload?.total ?? 0) !== 1) {
      throw new Error('Anonymous fallback did not return the public fallback fixture')
    }

    const publicHitsAfterAnonymous = hits.filter((hit) => hit.path === '/v1/search' || hit.path === '/api/v1/search').length
    if (publicHitsAfterAnonymous < 1) {
      throw new Error('Anonymous fallback did not call a public read-only endpoint')
    }

    const beforeCredentialed = hits.length
    const credentialed = await callSearch(baseUrl, {
      HARDWARE_DIRECTORY_API_KEY: 'bad-test-key',
      MAKERHUB_API_KEY: '',
      HARDWARE_DIRECTORY_MCP_SERVICE_KEY: '',
      MAKERHUB_MCP_SERVICE_KEY: '',
    })
    if (!credentialed?.isError) {
      throw new Error('Credentialed /mcp 401 should fail closed, but the tool succeeded')
    }
    const credentialedHits = hits.slice(beforeCredentialed)
    const credentialedPublicHits = credentialedHits.filter((hit) => hit.path === '/v1/search' || hit.path === '/api/v1/search')
    if (credentialedPublicHits.length > 0) {
      throw new Error('Credentialed /mcp 401 incorrectly downgraded to public fallback')
    }

    console.log(JSON.stringify({
      ok: true,
      anonymousFallback: 'public-read-only-succeeded',
      credentialedFallback: 'failed-closed',
      hitPaths: hits.map((hit) => hit.path),
    }, null, 2))
  } finally {
    await new Promise((resolve) => server.close(resolve))
  }
}

main().catch((error) => {
  console.error('[mcp-auth-fallback-smoke] failed:', error instanceof Error ? error.message : String(error))
  process.exitCode = 1
})
