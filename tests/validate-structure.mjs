import assert from "node:assert/strict"
import { readFile, readdir, stat } from "node:fs/promises"
import path from "node:path"

const claudeRoot = path.resolve("plugins/tegy")
const openAiRoot = path.resolve("plugins/tegy-openai")
const claudeManifest = await readJson(
  path.join(claudeRoot, ".claude-plugin/plugin.json")
)
const claudeMcpManifest = await readJson(
  path.join(claudeRoot, ".mcp.json")
)
const codexManifest = await readJson(
  path.join(openAiRoot, ".codex-plugin/plugin.json")
)
const appManifest = await readJson(path.join(openAiRoot, ".app.json"))
const mcpManifest = await readJson(path.join(openAiRoot, ".mcp.json"))
const claudeRunner = await readFile(
  path.join(claudeRoot, "agents", "tegy-review-runner.md"),
  "utf8"
)
const claudeMarketplace = await readJson(".claude-plugin/marketplace.json")
const codexMarketplace = await readJson(".agents/plugins/marketplace.json")
const readme = await readFile("README.md", "utf8")
const interviewEvalCases = await readJson("tests/interview-eval-cases.json")

assert.equal(claudeManifest.name, "tegy")
assert.equal(claudeManifest.version, "3.0.0")
assert.match(claudeManifest.description, /automatically consume Tegy allowance/u)
assert.equal(codexManifest.name, "tegy-openai")
assert.equal(codexManifest.version, "3.0.0")
assert.match(codexManifest.description, /automatically consume Tegy allowance/u)
assert.equal(codexManifest.apps, "./.app.json")
assert.equal(codexManifest.mcpServers, "./.mcp.json")
assert.equal(codexManifest.skills, "./skills/")
assert.equal(codexManifest.interface?.developerName, "Rocket Minds")
assert.equal(
  codexManifest.interface?.privacyPolicyURL,
  "https://app.tegy.io/privacy"
)
assert.equal(
  codexManifest.interface?.termsOfServiceURL,
  "https://app.tegy.io/terms"
)
assert.equal(
  appManifest.apps?.tegy?.id,
  "asdk_app_6a692aff65c8819198d21196888695b4"
)

assert.deepEqual(claudeMcpManifest, {
  mcpServers: {
    tegy: {
      type: "http",
      url: "https://mcp.tegy.io/mcp",
      oauth: {
        scopes: "tegy:review:run",
      },
      alwaysLoad: true,
      timeout: 2_100_000,
    },
  },
})
assert.equal(Object.keys(claudeMcpManifest.mcpServers).length, 1)

assert.deepEqual(mcpManifest, {
  mcpServers: {
    "tegy-mcp": {
      oauth_resource: "https://mcp.tegy.io/mcp",
      scopes: ["tegy:review:run"],
      tool_timeout_sec: 2100,
      type: "http",
      url: "https://mcp.tegy.io/mcp",
    },
  },
})
assert.doesNotMatch(
  JSON.stringify({ claudeMcpManifest, mcpManifest }),
  /bearer|command|env|header|token/iu
)

assert.equal(claudeMarketplace.name, "tegy")
assert.equal(claudeMarketplace.plugins?.length, 1)
assert.equal(claudeMarketplace.plugins[0]?.name, "tegy")
assert.equal(claudeMarketplace.plugins[0]?.version, claudeManifest.version)
assert.match(
  claudeMarketplace.plugins[0]?.description ?? "",
  /allowance-consuming Tegy review/u
)
assert.equal(claudeMarketplace.plugins[0]?.source?.source, "git-subdir")
assert.equal(claudeMarketplace.plugins[0]?.source?.path, "plugins/tegy")
assert.match(
  claudeMarketplace.plugins[0]?.source?.sha ?? "",
  /^[0-9a-f]{40}$/u
)
assert.equal(
  claudeMarketplace.plugins[0]?.source?.sha,
  "c57d8259aaac9e5318e3215e1b6df13c4dd33e2e",
  "Claude marketplace must pin the immutable v3 payload commit."
)

assert.equal(codexMarketplace.name, "tegy")
assert.equal(codexMarketplace.plugins?.length, 1)
assert.equal(codexMarketplace.plugins[0]?.name, "tegy-openai")
assert.equal(codexMarketplace.plugins[0]?.version, codexManifest.version)
assert.equal(
  codexMarketplace.plugins[0]?.source?.path,
  "./plugins/tegy-openai"
)
assert.equal(
  codexMarketplace.plugins[0]?.policy?.installation,
  "AVAILABLE"
)
assert.equal(
  codexMarketplace.plugins[0]?.policy?.authentication,
  "ON_INSTALL"
)

const expectedSkills = ["review"]
const expectedOpenAiSkills = ["tegy-review"]
const pluginFiles = [
  ...(await walk(claudeRoot)),
  ...(await walk(openAiRoot)),
]
const forbiddenNames = new Set([
  ".lsp.json",
  "package.json",
  "package-lock.json",
  "hooks.json",
  "monitors.json",
])

assert.match(readme, /sole Tegy MCP connection/u)
assert.match(readme, /Installing the plugin does not prove/u)
assert.match(readme, /at most one automatic Tegy review/u)
assert.match(readme, /one long-running tool call/u)
assert.match(readme, /Upgrading from 2\.0/u)
assert.match(readme, /remove the manually added\n`tegy` server/u)
assert.match(readme, /claude mcp remove tegy/u)
assert.match(readme, /without a separate per-call permission prompt/u)
assert.match(readme, /automatic review consumes Tegy allowance/iu)
assert.match(readme, /Idempotency key: .*optional/u)
assert.match(readme, /tests\/interview-eval-cases\.json/u)
assert.match(readme, /Do not use an unverified\s+same-named server as a\s+fallback/u)
assert.match(readme, /\/tegy:review/u)
assert.match(readme, /\$tegy-review/u)

assert.match(claudeRunner, /^---\n[\s\S]+?\n---\n/u)
assert.match(claudeRunner, /name: tegy-review-runner/u)
assert.match(claudeRunner, /model: inherit/u)
assert.match(claudeRunner, /maxTurns: 4/u)
assert.match(
  claudeRunner,
  /tools:\n  - mcp__plugin_tegy_tegy__review/u
)
assert.doesNotMatch(
  claudeRunner,
  /mcp__(?!plugin_tegy_tegy__review)/u
)
assert.match(claudeRunner, /Do not inspect other context/u)
assert.match(claudeRunner, /Return the real tool result/u)

for (const file of pluginFiles) {
  assert.equal(
    forbiddenNames.has(path.basename(file)),
    false,
    `Installed plugin must not contain ${file}`
  )
  assert.equal(
    /\.(?:js|mjs|cjs|ts|sh|py)$/u.test(file),
    false,
    `Installed plugin must not contain executable source ${file}`
  )
}

for (const skillName of expectedSkills) {
  const source = await readFile(
    path.join(claudeRoot, "skills", skillName, "SKILL.md"),
    "utf8"
  )

  assert.match(source, /^---\n[\s\S]+?\n---\n/u)
  assert.doesNotMatch(source, /disable-model-invocation/u)
  assert.match(source, /context: fork/u)
  assert.match(source, /agent: tegy:tegy-review-runner/u)
  assert.match(source, /background: false/u)
  assert.match(
    source,
    /allowed-tools: mcp__plugin_tegy_tegy__review/u
  )
  assert.doesNotMatch(source, /mcp__tegy__review/u)
  assert.doesNotMatch(source, /disallowed-tools:/u)
  assert.match(source, /At most once when Claude is the interviewee/u)
  assert.match(source, /Call `mcp__plugin_tegy_tegy__review` exactly once/u)
  assert.match(source, /Do not\s+send `action`, `review_id`/u)
  assert.match(source, /\$ARGUMENTS/u)
  assert.match(source, /The fork has no parent conversation history/u)
  assert.match(source, /Parent action: revise the provisional answer/u)
  assert.match(source, /packet's idempotency key when present/u)
  assert.match(source, /Recovery idempotency key: <key>/u)
  assert.match(source, /Terminal idempotency key: <key>/u)
  assert.match(source, /request_cancelled` or `review_timeout/u)
  assert.match(source, /new-key review requires an explicit new invocation/u)
  assert.match(source, /without rewriting,\nsummarizing, or fabricating/u)
  assert.match(source, /Stop without claiming\nthat Tegy ran/u)
  assert.doesNotMatch(source, /\bnpx\b|\bnpm install\b|\bcurl\b/u)
  assert.doesNotMatch(source, /action:\s*["'`](?:start|get)/u)
  assert.doesNotMatch(source, /retry_after|polling loop/iu)
}

for (const skillName of expectedOpenAiSkills) {
  const source = await readFile(
    path.join(openAiRoot, "skills", skillName, "SKILL.md"),
    "utf8"
  )

  assert.match(source, new RegExp(`name: ${skillName}`, "u"))
  assert.match(source, /authenticated `review` tool/u)
  assert.match(source, /the `tegy-mcp` MCP server/u)
  assert.match(source, /^---\n[\s\S]+?\n---\n/u)
  assert.match(source, /Call `review` exactly once/u)
  assert.match(source, /Do not send `action`, `review_id`/u)
  assert.match(source, /at most one automatic Tegy\nreview per case/u)
  assert.match(source, /revise the candidate answer/u)
  assert.match(source, /explicitly supplied idempotency key/u)
  assert.match(source, /show the returned recovery guidance and the idempotency key/u)
  assert.match(source, /request_cancelled` or `review_timeout/u)
  assert.match(source, /new-key review\nrequires an explicit new invocation/u)
  assert.doesNotMatch(source, /\[TODO:/u)
  assert.doesNotMatch(source, /action:\s*["'`](?:start|get)/u)
  assert.doesNotMatch(source, /retry_after|polling loop/iu)
}

const reviewCases = await readJson("submission/openai/test-cases.json")
assert.equal(reviewCases.positive?.length, 2)
assert.equal(reviewCases.negative?.length, 3)
assert.match(JSON.stringify(reviewCases), /call only review once/iu)
assert.doesNotMatch(
  JSON.stringify(reviewCases),
  /Strategy interview decision checkpoint|Opening interview clarification/u
)
assert.doesNotMatch(
  JSON.stringify(reviewCases),
  /create_chat|start_turn|create_handoff|review_id|retry_after/iu
)

assert.deepEqual(interviewEvalCases.targets, ["claude-code", "codex"])
assert.match(interviewEvalCases.environment?.treatment ?? "", /only the Tegy plugin/u)
assert.match(interviewEvalCases.environment?.control ?? "", /without the Tegy plugin/u)
assert.match(interviewEvalCases.environment?.privacy ?? "", /outside both client conversations/u)
assert.equal(interviewEvalCases.cases?.length, 2)
assert.equal(interviewEvalCases.cases[0]?.kind, "positive")
assert.deepEqual(interviewEvalCases.cases[0]?.expected_trace, {
  skill_calls: 1,
  review_calls: 1,
  poll_calls: 0,
})
assert.equal(interviewEvalCases.cases[1]?.kind, "negative")
assert.deepEqual(interviewEvalCases.cases[1]?.expected_trace, {
  skill_calls: 0,
  review_calls: 0,
  poll_calls: 0,
})
assert.match(
  JSON.stringify(interviewEvalCases),
  /Decision checkpoint invokes one review/u
)
assert.doesNotMatch(
  JSON.stringify(interviewEvalCases),
  /create_chat|start_turn|create_handoff|review_id|retry_after/iu
)

console.log(
  "Tegy v3 one-call Claude/Codex interview-review structure, boundary, recovery, and no-executable checks passed."
)

async function readJson(file) {
  return JSON.parse(await readFile(file, "utf8"))
}

async function walk(directory) {
  const files = []

  for (const entry of await readdir(directory)) {
    const target = path.join(directory, entry)

    if ((await stat(target)).isDirectory()) {
      files.push(...(await walk(target)))
    } else {
      files.push(target)
    }
  }

  return files
}
