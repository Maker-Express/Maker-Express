#!/usr/bin/env node

import { existsSync } from 'node:fs'
import path from 'node:path'
import process from 'node:process'
import { fileURLToPath } from 'node:url'
import { Client } from '@modelcontextprotocol/sdk/client/index.js'
import { StdioClientTransport } from '@modelcontextprotocol/sdk/client/stdio.js'

function parseArgs(argv) {
  const args = {
    apiUrl:
      process.env.HARDWARE_DIRECTORY_API_URL ??
      process.env.MAKERHUB_API_URL ??
      'https://api.maker.express',
    callTool: false,
  }

  for (let i = 0; i < argv.length; i += 1) {
    const token = argv[i]
    if (token === '--api-url') {
      args.apiUrl = argv[i + 1]
      i += 1
    } else if (token === '--skip-call') {
      args.callTool = false
    } else if (token === '--call') {
      args.callTool = true
    }
  }

  return args
}

const REQUIRED_TOOLS = [
  'search_resources',
  'find_labs_for_certification',
  'list_grants',
  'get_grants',
  'get_resource_details',
  'get_resource',
  'search_events',
  'get_platform_stats',
  'list_resource_types',
  'list_cities',
  'list_skills',
  'suggest_skills',
  'list_github_resources',
]

function parseToolText(result) {
  const block = result?.content?.find((entry) => entry?.type === 'text')
  if (!block?.text) return null
  try {
    return JSON.parse(block.text)
  } catch {
    return null
  }
}

function sleep(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms))
}

async function callToolWithRetry(client, request, retries = 3) {
  let lastResult = null
  for (let attempt = 0; attempt <= retries; attempt += 1) {
    lastResult = await client.callTool(request)
    const message = lastResult?.content?.find((entry) => entry?.type === 'text')?.text ?? ''
    if (!lastResult?.isError || !/429|Too Many Requests/i.test(message)) {
      return lastResult
    }
    if (attempt < retries) {
      await sleep((attempt + 1) * 5000)
    }
  }
  return lastResult
}

async function main() {
  const args = parseArgs(process.argv.slice(2))
  const scriptDir = path.dirname(fileURLToPath(import.meta.url))
  const packageRoot = path.resolve(scriptDir, '..')
  const serverEntry = path.join(packageRoot, 'dist', 'index.js')

  if (!existsSync(serverEntry)) {
    throw new Error(`Build artifact missing: ${serverEntry}. Run this package build script before smoke.`)
  }

  const transport = new StdioClientTransport({
    command: process.execPath,
    args: [serverEntry],
    cwd: packageRoot,
    env: {
      ...process.env,
      HARDWARE_DIRECTORY_API_URL: args.apiUrl,
      MAKERHUB_API_URL: args.apiUrl,
    },
    stderr: 'pipe',
  })

  const stderrLines = []
  if (transport.stderr) {
    transport.stderr.on('data', (chunk) => {
      const text = String(chunk).trim()
      if (text) stderrLines.push(text)
    })
  }

  const client = new Client(
    { name: 'mcp-smoke', version: '1.0.0' },
    { capabilities: {} }
  )

  try {
    await client.connect(transport)
    const listed = await client.listTools()
    const names = listed.tools.map((tool) => tool.name)
    const missing = REQUIRED_TOOLS.filter((name) => !names.includes(name))
    if (missing.length > 0) {
      throw new Error(`Missing tools: ${missing.join(', ')}`)
    }

    const summary = {
      ok: true,
      apiUrl: args.apiUrl,
      toolCount: names.length,
      tools: names,
      statsProbe: null,
      searchProbe: null,
      serverStderr: stderrLines.slice(-4),
    }

    if (args.callTool) {
      const statsProbe = await callToolWithRetry(client, {
        name: 'get_platform_stats',
        arguments: {},
      })
      if (statsProbe?.isError) {
        const message = statsProbe.content?.find((entry) => entry?.type === 'text')?.text ?? 'unknown tool error'
        throw new Error(`get_platform_stats probe failed: ${message}`)
      }
      summary.statsProbe = parseToolText(statsProbe) ?? statsProbe

      const searchProbe = await callToolWithRetry(client, {
        name: 'search_resources',
        arguments: { query: 'mekuva', max_results: 3 },
      })
      if (searchProbe?.isError) {
        const message = searchProbe.content?.find((entry) => entry?.type === 'text')?.text ?? 'unknown tool error'
        throw new Error(`search_resources probe failed: ${message}`)
      }
      summary.searchProbe = parseToolText(searchProbe) ?? searchProbe
      const searchCount = Number(
        summary.searchProbe?.count ??
        summary.searchProbe?.total ??
        (Array.isArray(summary.searchProbe?.data) ? summary.searchProbe.data.length : undefined) ??
        (Array.isArray(summary.searchProbe?.results) ? summary.searchProbe.results.length : undefined) ??
        0
      )
      if (!Number.isFinite(searchCount) || searchCount < 1) {
        throw new Error('search_resources probe returned no results for Mekuva fixture')
      }
    }

    console.log(JSON.stringify(summary, null, 2))
  } finally {
    await client.close().catch(() => {})
    await transport.close().catch(() => {})
  }
}

main().catch((error) => {
  console.error('[mcp-smoke] failed:', error instanceof Error ? error.message : String(error))
  process.exitCode = 1
})
