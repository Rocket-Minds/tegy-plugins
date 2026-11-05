import { readFileSync } from "node:fs"
import { pathToFileURL } from "node:url"

const tools = new Set(["review", "brief", "solve", "read_result"].map(
  name => `mcp__plugin_tegy_tegy__${name}`
))

// Follow the active conversation branch. Rewound and side conversations must
// not supply evidence about the current request. System entries can be parents.
export function requestEvidence(rows) {
  const entries = new Map()
  let last
  for (const row of rows) {
    if (row.uuid && !row.isSidechain) {
      entries.set(row.uuid, row)
      last = row
    }
  }
  const chain = []
  const visited = new Set()
  while (last && !visited.has(last.uuid)) {
    visited.add(last.uuid)
    chain.push(last)
    last = entries.get(last.parentUuid)
  }
  const blocks = row => Array.isArray(row.message?.content) ? row.message.content : []
  const calls = new Map(chain.flatMap(blocks)
    .filter(block => block.type === "tool_use" && tools.has(block.name))
    .map(block => [block.id, block]))
  const results = chain.flatMap(row => blocks(row)
    .filter(block => block.type === "tool_result" && calls.has(block.tool_use_id))
    .map(block => ({ block, receipt: row.mcpMeta?.structuredContent,
      call: calls.get(block.tool_use_id) })))
  const latest = results[0]
  if (!latest || latest.block.is_error !== true || latest.receipt) return

  const earlier = results.slice(1).find(result => result.receipt &&
    result.call.name === latest.call.name &&
    canonical(result.call.input) === canonical(latest.call.input))
  const receipt = earlier?.receipt
  return {
    tool: latest.call.name,
    local_call: latest.call.id,
    current_attempt: "local_error_without_a_Tegy_receipt",
    remote_dispatch: "unconfirmed_by_this_attempt",
    remote_completion: "unconfirmed_by_this_attempt",
    remote_cancellation: "unconfirmed_by_this_attempt",
    ...(receipt ? { earlier_receipt: {
      status: receipt.status,
      job_id: receipt.data?.job_id ?? receipt.data?.review_id ??
        receipt.data?.brief_id ?? receipt.data?.solve_id,
    } } : {}),
  }
}

function canonical(value) {
  if (Array.isArray(value)) return `[${value.map(canonical).join(",")}]`
  if (value && typeof value === "object") return `{${Object.keys(value).sort()
    .map(key => `${JSON.stringify(key)}:${canonical(value[key])}`).join(",")}}`
  return JSON.stringify(value)
}

export function hookOutput(event, transcript) {
  if (event.hook_event_name !== "UserPromptSubmit") return
  const rows = transcript.split("\n").filter(Boolean).flatMap(line => {
    try { return [JSON.parse(line)] } catch { return [] }
  })
  const evidence = requestEvidence(rows)
  if (!evidence) return
  return { hookSpecificOutput: {
    hookEventName: "UserPromptSubmit",
    additionalContext: `Tegy request status evidence from the local tool transcript: ${JSON.stringify(evidence)}. ` +
      "This attempt delivered no Tegy receipt. A local rejection or interruption does not establish that the request was never sent, never accepted, or cancelled remotely. Preserve any earlier confirmed receipt. Respect a pause or denial; do not call Tegy again unless the user asks to continue. To continue, preserve the original arguments and key, or the returned job ID. Describe only what the evidence establishes.",
  } }
}

if (process.argv[1] && import.meta.url === pathToFileURL(process.argv[1]).href) {
  const event = JSON.parse(readFileSync(0, "utf8"))
  if (event.hook_event_name === "UserPromptSubmit" && event.transcript_path) {
    // A fresh conversation may not have written its first transcript entry yet.
    let transcript
    try { transcript = readFileSync(event.transcript_path, "utf8") }
    catch (error) {
      if (error.code === "ENOENT") process.exit(0)
      throw error
    }
    const output = hookOutput(event, transcript)
    if (output) process.stdout.write(JSON.stringify(output))
  }
}
