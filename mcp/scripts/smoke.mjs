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

function resultCount(payload) {
  return Number(
    payload?.count ??
    payload?.total ??
    (Array.isArray(payload?.data) ? payload.data.length : undefined) ??
    (Array.isArray(payload?.resources) ? payload.resources.length : undefined) ??
    (Array.isArray(payload?.results) ? payload.results.length : undefined) ??
    0
  )
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
      typedSearchProbe: null,
      skillsProbe: null,
      thirdPartySkillsProbe: null,
      suggestSkillsProbe: null,
      githubResourcesProbe: null,
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
      const searchCount = resultCount(summary.searchProbe)
      if (!Number.isFinite(searchCount) || searchCount < 1) {
        throw new Error('search_resources probe returned no results for Mekuva fixture')
      }

      const typedSearchProbe = await callToolWithRetry(client, {
        name: 'search_resources',
        arguments: { resource_type: '3d-printing', max_results: 3 },
      })
      if (typedSearchProbe?.isError) {
        const message = typedSearchProbe.content?.find((entry) => entry?.type === 'text')?.text ?? 'unknown tool error'
        throw new Error(`search_resources typed probe failed: ${message}`)
      }
      summary.typedSearchProbe = parseToolText(typedSearchProbe) ?? typedSearchProbe
      const typedSearchCount = resultCount(summary.typedSearchProbe)
      if (!Number.isFinite(typedSearchCount) || typedSearchCount < 1) {
        throw new Error('search_resources typed probe returned no results for 3d-printing fixture')
      }

      const skillsProbe = await callToolWithRetry(client, {
        name: 'list_skills',
        arguments: { source: 'all', security_status: 'all' },
      })
      if (skillsProbe?.isError) {
        const message = skillsProbe.content?.find((entry) => entry?.type === 'text')?.text ?? 'unknown tool error'
        throw new Error(`list_skills probe failed: ${message}`)
      }
      summary.skillsProbe = parseToolText(skillsProbe) ?? skillsProbe
      if (Number(summary.skillsProbe?.total ?? 0) < 39) {
        throw new Error(`list_skills probe returned too few skills: ${summary.skillsProbe?.total ?? 'unknown'}`)
      }

      const thirdPartySkillsProbe = await callToolWithRetry(client, {
        name: 'list_skills',
        arguments: { source: 'third-party', security_status: 'third-party-verified' },
      })
      if (thirdPartySkillsProbe?.isError) {
        const message = thirdPartySkillsProbe.content?.find((entry) => entry?.type === 'text')?.text ?? 'unknown tool error'
        throw new Error(`list_skills third-party probe failed: ${message}`)
      }
      summary.thirdPartySkillsProbe = parseToolText(thirdPartySkillsProbe) ?? thirdPartySkillsProbe
      if (Number(summary.thirdPartySkillsProbe?.total ?? 0) < 7) {
        throw new Error(`third-party list_skills probe returned too few skills: ${summary.thirdPartySkillsProbe?.total ?? 'unknown'}`)
      }

      const suggestSkillsProbe = await callToolWithRetry(client, {
        name: 'suggest_skills',
        arguments: { task: 'prepare firmware bringup and EMC precompliance for a 3D printer controller', agent_type: 'codex' },
      })
      if (suggestSkillsProbe?.isError) {
        const message = suggestSkillsProbe.content?.find((entry) => entry?.type === 'text')?.text ?? 'unknown tool error'
        throw new Error(`suggest_skills probe failed: ${message}`)
      }
      summary.suggestSkillsProbe = parseToolText(suggestSkillsProbe) ?? suggestSkillsProbe
      if (!Array.isArray(summary.suggestSkillsProbe?.suggestions) || summary.suggestSkillsProbe.suggestions.length < 1) {
        throw new Error('suggest_skills probe returned no suggestions')
      }

      const githubResourcesProbe = await callToolWithRetry(client, {
        name: 'list_github_resources',
        arguments: { domain: 'all', type: 'all', max_results: 60 },
      })
      if (githubResourcesProbe?.isError) {
        const message = githubResourcesProbe.content?.find((entry) => entry?.type === 'text')?.text ?? 'unknown tool error'
        throw new Error(`list_github_resources probe failed: ${message}`)
      }
      summary.githubResourcesProbe = parseToolText(githubResourcesProbe) ?? githubResourcesProbe
      if (Number(summary.githubResourcesProbe?.total ?? 0) < 50) {
        throw new Error(`list_github_resources probe returned too few resources: ${summary.githubResourcesProbe?.total ?? 'unknown'}`)
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
