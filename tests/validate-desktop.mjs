import assert from "node:assert/strict"
import { readFile, readdir } from "node:fs/promises"
import path from "node:path"

const root = path.resolve(process.argv[2] ?? "plugins/tegy-desktop")
const readJson = async file => JSON.parse(await readFile(path.join(root, file), "utf8"))
assert.equal((await readJson(".claude-plugin/plugin.json")).name, "tegy")
assert.deepEqual(await files(root), [".claude-plugin/plugin.json", ".mcp.json", "hooks/hooks.json", "skills/brief/SKILL.md", "skills/review/SKILL.md", "skills/solve/SKILL.md"])
assert.deepEqual(await readJson(".mcp.json"), { mcpServers: { Tegy_Cowork: { type: "http", url: "https://mcp.tegy.io/mcp?delivery=app&integration=cowork", oauth: { scopes: "tegy:review:run tegy:brief:run" } } } })
const receiver = input => ({ type: "mcp_tool", server: "Tegy_Cowork", tool: "receive_result", input, timeout: 270 })
assert.deepEqual(await readJson("hooks/hooks.json"), {
  hooks: {
    PostToolUse: [{ matcher: "^mcp__Tegy_Cowork__(review|brief)$", hooks: [receiver({ event: "PostToolUse", session_id: "${session_id}", receipt: "${tool_response}" })] }],
    Stop: [{ hooks: [receiver({ event: "Stop", session_id: "${session_id}" })] }],
  },
})
for (const skill of ["solve", "review", "brief"]) {
  const source = await readFile(path.join(root, "skills", skill, "SKILL.md"), "utf8")
  const [header, body] = source.slice(4).split("\n---\n")
  assert.match(header, new RegExp(`^name: ${skill}\\n`))
  assert.doesNotMatch(header, /^hooks:/mu, "Shared hooks belong at plugin scope, not once per skill")
  assert.ok(body.includes(`mcp__Tegy_Cowork__${skill === "brief" ? "brief" : "review"}`))
  assert.doesNotMatch(header, /disable-model-invocation:\s*true/u)
}
console.log("Cowork connector, exact tool routing, shared hooks, and no-executable boundary passed.")

async function files(directory, prefix = "") {
  const result = []
  for (const entry of await readdir(directory, { withFileTypes: true })) {
    const name = path.posix.join(prefix, entry.name)
    if (entry.isDirectory()) result.push(...await files(path.join(directory, entry.name), name))
    else result.push(name)
  }
  return result.sort()
}
