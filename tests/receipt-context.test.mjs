import assert from "node:assert/strict"
import { test } from "node:test"
import { spawnSync } from "node:child_process"
import { randomUUID } from "node:crypto"
import { tmpdir } from "node:os"
import path from "node:path"
import { hookOutput, requestEvidence } from "../plugins/tegy/scripts/receipt-context.mjs"

const name = "mcp__plugin_tegy_tegy__brief"
const args = { idempotency_key: "same-request", source_text: "PRIVATE SOURCE" }
const call = (uuid, parentUuid, input = args, tool = name) => ({ uuid, parentUuid,
  message: { content: [{ type: "tool_use", id: uuid, name: tool, input }] } })
const result = (uuid, parentUuid, tool_use_id, error = true, receipt) => ({ uuid, parentUuid,
  message: { content: [{ type: "tool_result", tool_use_id, is_error: error, content: "PRIVATE RESULT" }] },
  ...(receipt ? { mcpMeta: { structuredContent: receipt } } : {}) })
const denied = [call("call", null), result("result", "call", "call")]

test("a fresh conversation with no transcript yet is silent", () => {
  const run = spawnSync(process.execPath, ["plugins/tegy/scripts/receipt-context.mjs"], {
    input: JSON.stringify({ hook_event_name: "UserPromptSubmit",
      transcript_path: path.join(tmpdir(), `tegy-not-created-${randomUUID()}.jsonl`) }), encoding: "utf8",
  })
  assert.equal(run.status, 0)
  assert.equal(run.stdout, "")
  assert.equal(run.stderr, "")
})

test("a generic local error proves no remote outcome and exposes no source or result", () => {
  const output = hookOutput({ hook_event_name: "UserPromptSubmit" }, denied.map(JSON.stringify).join("\n"))
  const context = output.hookSpecificOutput.additionalContext
  assert.match(context, /unconfirmed_by_this_attempt/)
  assert.doesNotMatch(context, /PRIVATE|same-request/)
  assert.equal(output.decision, undefined)
  assert.equal(output.continue, undefined)
})

test("a completed or server-failed result needs no interruption reminder", () => {
  for (const status of ["completed", "failed"]) {
    assert.equal(requestEvidence([call("call", null), result("result", "call", "call", status === "failed", { status })]), undefined)
  }
})

test("system entries between messages do not break the active branch", () => {
  assert.ok(requestEvidence([...denied, { uuid: "system", parentUuid: "result", type: "system" },
    { uuid: "prompt", parentUuid: "system", message: { content: "Pause" } }]))
})

test("rewound and side conversations do not leak stale status", () => {
  assert.equal(requestEvidence([...denied, { uuid: "new", parentUuid: null, message: { content: "New task" } }]), undefined)
  assert.equal(requestEvidence([{ ...denied[0], isSidechain: true }, { ...denied[1], isSidechain: true }]), undefined)
})

test("an earlier receipt for the same packet is preserved despite property order", () => {
  const received = { status: "completed", data: { brief_id: "brief-1", brief: "PRIVATE ANSWER" } }
  const evidence = requestEvidence([call("first", null), result("done", "first", "first", false, received),
    call("retry", "done", { source_text: args.source_text, idempotency_key: args.idempotency_key }),
    result("interrupted", "retry", "retry")])
  assert.deepEqual(evidence.earlier_receipt, { status: "completed", job_id: "brief-1" })
  assert.doesNotMatch(JSON.stringify(evidence), /PRIVATE/)
})

test("a changed packet does not inherit another request's receipt", () => {
  const evidence = requestEvidence([call("first", null), result("done", "first", "first", false,
    { status: "completed", data: { brief_id: "brief-1" } }),
  call("next", "done", { ...args, source_text: "changed" }), result("error", "next", "next")])
  assert.equal(evidence.earlier_receipt, undefined)
})

test("unrelated tools, missing calls, and unrelated hook events are ignored", () => {
  assert.equal(requestEvidence([call("call", null, args, "Bash"), denied[1]]), undefined)
  assert.equal(requestEvidence([denied[1]]), undefined)
  assert.equal(hookOutput({ hook_event_name: "PostToolBatch" }, denied.map(JSON.stringify).join("\n")), undefined)
})

test("a truncated log line and cyclic parent cannot hang the hook", () => {
  const rows = [call("call", "result"), denied[1]]
  assert.ok(hookOutput({ hook_event_name: "UserPromptSubmit" }, rows.map(JSON.stringify).join("\n") + '\n{"partial":'))
})
