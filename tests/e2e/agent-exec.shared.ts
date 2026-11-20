// The installed agent package (SLATEBOX_AGENT_TOOLS_DIR) as an agent uses it since exec: the
// slatebox CLI's `exec` and the MCP server's `exec` tool, each running a short script against the
// typed `slatebox` client. There are no per-action commands or tools any more. Keys inside a
// script are derived from the run's key, so the same run key replays a call on any surface.
import { execFile } from 'node:child_process'
import { createHash } from 'node:crypto'
import { createRequire } from 'node:module'
import { resolve } from 'node:path'
import { promisify } from 'node:util'
import { expect } from '@playwright/test'

export type ExecRun = {
  status: 'completed' | 'failed' | 'confirmation_required'
  result?: any
  error?: { code: string; status?: number; message: string; details?: any }
  calls: { n: number; method: string; mode: string | null; ok: boolean; status: number; code?: string; replayed?: boolean }[]
  confirmation?: { id: string; reasons: { rule: string }[] }
  idempotencyKey: string
}
type Options = { preview?: boolean; key?: string; confirm?: string }

/** The package's two executables and its MCP SDK, from the installed directory. */
export function installedTools(dir: string) {
  const tools = createRequire(resolve(dir, 'package.json'))
  const manifest = tools('./package.json')
  return {
    Client: tools('@modelcontextprotocol/sdk/client/index.js').Client,
    StdioClientTransport: tools('@modelcontextprotocol/sdk/client/stdio.js').StdioClientTransport,
    cli: resolve(dir, manifest.bin.slatebox) as string,
    server: resolve(dir, manifest.bin['slatebox-mcp']) as string,
  }
}

/** JavaScript literal for a value inside a script. */
export const lit = (value: unknown) => JSON.stringify(value)

/** slatebox exec -e CODE --json: the whole run, and the exit code (0 completed, 6 held, 7 failed). */
export async function cliExec(cli: string, env: NodeJS.ProcessEnv, code: string, { preview, key, confirm }: Options = {}) {
  const args = [cli, 'exec', '-e', code, '--json', '--intent', 'Acceptance proof',
    ...(preview ? ['--preview'] : []), ...(key ? ['--idempotency-key', key] : []), ...(confirm ? ['--confirm', confirm] : [])]
  try {
    const { stdout } = await promisify(execFile)(process.execPath, args, { env })
    return { exit: 0, run: JSON.parse(stdout) as ExecRun }
  } catch (error) {
    const failed = error as { code: number; stdout: string; stderr: string }
    return { exit: failed.code, run: (failed.stdout ? JSON.parse(failed.stdout) : null) as ExecRun, stderr: failed.stderr }
  }
}

/** A script that must complete: the value it returned. */
export async function cliResult(cli: string, env: NodeJS.ProcessEnv, code: string, options: Options = {}) {
  const { exit, run } = await cliExec(cli, env, code, options)
  expect(exit, JSON.stringify(run?.error)).toBe(0)
  return run.result
}

/**
 * A script the gate holds for the person (it shares a slate, or removes something): the run ends
 * held with exactly these reasons and saves nothing; run again with --confirm and the same key, as
 * the CLI's printed command says, it saves once. Returns the confirmed run.
 */
export async function cliConfirmed(cli: string, env: NodeJS.ProcessEnv, code: string, rules: string[], options: Options = {}) {
  const held = await cliExec(cli, env, code, options)
  expect(held.exit, JSON.stringify(held.run?.error)).toBe(6)
  expect(held.run.status).toBe('confirmation_required')
  expect(held.run.confirmation!.reasons.map((reason) => reason.rule).sort()).toEqual([...rules].sort())
  const saved = await cliExec(cli, env, code, { ...options, key: held.run.idempotencyKey, confirm: held.run.confirmation!.id })
  expect(saved.exit, JSON.stringify(saved.run?.error)).toBe(0)
  return saved.run
}

/** The MCP server's exec tool. */
export async function mcpExec(mcp: any, code: string, extra: Record<string, unknown> = {}) {
  const answer = await mcp.callTool({ name: 'exec', arguments: { intent: 'Acceptance proof', code, ...extra } })
  return answer.structuredContent as ExecRun
}

/** The same through MCP: held, then confirmed with the same key. Returns the confirmed run. */
export async function mcpConfirmed(mcp: any, code: string, rules: string[], extra: Record<string, unknown> = {}) {
  const held = await mcpExec(mcp, code, extra)
  expect(held.status, JSON.stringify(held.error)).toBe('confirmation_required')
  expect(held.confirmation!.reasons.map((reason) => reason.rule).sort()).toEqual([...rules].sort())
  const saved = await mcpExec(mcp, code, { ...extra, idempotencyKey: held.idempotencyKey, confirm: held.confirmation!.id })
  expect(saved.status, JSON.stringify(saved.error)).toBe('completed')
  return saved
}

/**
 * The Idempotency-Key the nth call of a run saved under, as the server derives it: 'x', then 40
 * hex of sha256(token id + newline + the run's key), ':' and n. An HTTP call with that key is the
 * same request as the script's call.
 */
export const derivedKey = (tokenId: string, runKey: string, n: number) =>
  'x' + createHash('sha256').update(tokenId + '\n' + runKey).digest('hex').slice(0, 40) + ':' + n
