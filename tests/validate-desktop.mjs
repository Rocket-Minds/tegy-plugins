import assert from "node:assert/strict"
import { readFile, readdir } from "node:fs/promises"
import path from "node:path"

const root = path.resolve(process.argv[2] ?? "plugins/tegy-desktop")
const readJson = async file => JSON.parse(await readFile(path.join(root, file), "utf8"))
assert.equal((await readJson(".claude-plugin/plugin.json")).name, "tegy-cowork")
assert.deepEqual((await files(root)).filter(file => !file.startsWith("evals/")), [".claude-plugin/plugin.json", ".mcp.json", "README.md", "assets/icon.svg", "skills/brief/SKILL.md", "skills/review/SKILL.md", "skills/solve/SKILL.md"])
assert.deepEqual(await readJson(".mcp.json"), { mcpServers: { Tegy_Cowork: { type: "http", url: "https://mcp.tegy.io/mcp?delivery=app&integration=cowork", oauth: { scopes: "tegy:review:run tegy:brief:run" } } } })
for (const skill of ["solve", "review", "brief"]) {
  const source = await readFile(path.join(root, "skills", skill, "SKILL.md"), "utf8")
  const [header, body] = source.slice(4).split("\n---\n")
  assert.match(header, new RegExp(`^name: ${skill}\\n`))
  assert.doesNotMatch(header, /^(?:hooks|allowed-tools):/mu, "No automatic hooks or pre-approved hosted calls")
  assert.doesNotMatch(source, /\$\{(?:CLAUDE_SESSION_ID|session_id)\}/u)
  assert.ok(body.includes(`mcp__Tegy_Cowork__${skill === "brief" ? "brief" : "review"}`))
  assert.doesNotMatch(header, /disable-model-invocation:\s*true/u)
}
console.log("Cowork connection, user-requested tool routing, and no-hook boundary passed.")

async function files(directory, prefix = "") {
  const result = []
  for (const entry of await readdir(directory, { withFileTypes: true })) {
    const name = path.posix.join(prefix, entry.name)
    if (entry.isDirectory()) result.push(...await files(path.join(directory, entry.name), name))
    else result.push(name)
  }
  return result.sort()
}
