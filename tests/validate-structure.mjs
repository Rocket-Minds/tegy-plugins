import assert from "node:assert/strict"
import { readFile, readdir, stat } from "node:fs/promises"
import path from "node:path"

const claudeRoot = path.resolve("plugins/tegy")
const openAiRoot = path.resolve("plugins/tegy-openai")
const claudeManifest = await readJson(
  path.join(claudeRoot, ".claude-plugin/plugin.json")
)
const claudeMcpManifest = await readJson(path.join(claudeRoot, ".mcp.json"))
const claudeReviewSkill = await readFile(
  path.join(claudeRoot, "skills", "review", "SKILL.md"),
  "utf8"
)
const claudeBriefSkill = await readFile(
  path.join(claudeRoot, "skills", "brief", "SKILL.md"),
  "utf8"
)
const claudeSolveSkill = await readFile(
  path.join(claudeRoot, "skills", "solve", "SKILL.md"),
  "utf8"
)
const claudeReviewRunner = await readFile(
  path.join(claudeRoot, "agents", "tegy-review-runner.md"),
  "utf8"
)
const claudeBriefRunner = await readFile(
  path.join(claudeRoot, "agents", "tegy-brief-runner.md"),
  "utf8"
)

const codexManifest = await readJson(
  path.join(openAiRoot, ".codex-plugin/plugin.json")
)
const codexMcpManifest = await readJson(path.join(openAiRoot, ".mcp.json"))
const codexSkill = await readFile(
  path.join(openAiRoot, "skills", "tegy-review", "SKILL.md"),
  "utf8"
)
const codexSkillUi = await readFile(
  path.join(openAiRoot, "skills", "tegy-review", "agents", "openai.yaml"),
  "utf8"
)
const appManifest = await readJson(path.join(openAiRoot, ".app.json"))
const claudeMarketplace = await readJson(".claude-plugin/marketplace.json")
const codexMarketplace = await readJson(".agents/plugins/marketplace.json")
const reviewCases = await readJson("submission/openai/test-cases.json")
const decisionGateEvalCases = await readJson(
  "tests/decision-gate-eval-cases.json"
)

assert.equal(claudeManifest.name, "tegy")
assert.match(claudeManifest.version, /^\d+\.\d+\.\d+$/u)
assert.match(claudeManifest.description, /strategy solving.*decision review.*brief writing/u)
assert.equal(codexManifest.name, "tegy-openai")
assert.equal(codexManifest.version, "4.0.2")
assert.match(codexManifest.description, /Explicit decision-review gate/u)
assert.equal(codexManifest.apps, "./.app.json")
assert.equal(codexManifest.mcpServers, "./.mcp.json")
assert.equal(codexManifest.skills, "./skills/")
assert.equal(codexManifest.interface?.developerName, "Rocket Minds")
assert.equal(codexManifest.interface?.privacyPolicyURL, "https://app.tegy.io/privacy")
assert.equal(codexManifest.interface?.termsOfServiceURL, "https://app.tegy.io/terms")
assert.equal(
  appManifest.apps?.tegy?.id,
  "asdk_app_6a692aff65c8819198d21196888695b4"
)

assert.deepEqual(claudeMcpManifest, {
  mcpServers: {
    tegy: {
      type: "http",
      url: "https://mcp.tegy.io/mcp",
      oauth: { scopes: "tegy:review:run tegy:brief:run" },
      alwaysLoad: true,
      timeout: 2_100_000,
    },
  },
})
assert.equal(Object.keys(claudeMcpManifest.mcpServers).length, 1)
assert.deepEqual(codexMcpManifest, {
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
  JSON.stringify({ claudeMcpManifest, codexMcpManifest }),
  /bearer|command|env|header|token/iu
)

assert.equal(claudeMarketplace.name, "tegy")
for (const entry of claudeMarketplace.plugins) {
  assert.equal(typeof entry.source, "string", "Directory packages must use repository-local paths")
  assert.ok(entry.source.startsWith("./plugins/"))
  const packageRoot = path.resolve(entry.source)
  assert.ok(packageRoot.startsWith(path.resolve("plugins") + path.sep))
  const manifest = await readJson(path.join(packageRoot, ".claude-plugin/plugin.json"))
  assert.equal(entry.name, manifest.name)
  assert.equal(entry.version, manifest.version)
  assert.equal(manifest.author.name, "MGMJ Innovation Group LLC (Tegy)")
}
assert.equal(codexMarketplace.name, "tegy")
assert.equal(codexMarketplace.plugins?.length, 1)
assert.equal(codexMarketplace.plugins[0]?.name, "tegy-openai")
assert.equal(codexMarketplace.plugins[0]?.version, codexManifest.version)
assert.equal(codexMarketplace.plugins[0]?.source?.path, "./plugins/tegy-openai")
assert.equal(codexMarketplace.plugins[0]?.policy?.installation, "AVAILABLE")
assert.equal(codexMarketplace.plugins[0]?.policy?.authentication, "ON_INSTALL")

for (const skill of [claudeReviewSkill, claudeBriefSkill, claudeSolveSkill]) {
  assert.match(skill, /^---\n[\s\S]+?\n---\n/u)
  const header = skill.split("\n---\n")[0]
  assert.doesNotMatch(header, /^allowed-tools:/mu, "Hosted calls must use the host's permission flow")
  assert.doesNotMatch(skill, /\$\{CLAUDE_SESSION_ID\}/u, "Request keys must not export Claude session IDs")
}
for (const [runner, tool] of [[claudeReviewRunner, "review"], [claudeBriefRunner, "brief"]]) {
  const advertisedTools = runner.match(/^  - (mcp__.+)$/gmu) ?? []
  assert.deepEqual(advertisedTools, [`  - mcp__plugin_tegy_tegy__${tool}`], "Runners may only call their own hosted operation")
}
assert.match(codexSkill, /^---\n[\s\S]+?\n---\n/u)
assert.match(codexSkill, /Use only when the user explicitly invokes \$tegy-review/u)
assert.match(codexSkill, /never invoke it implicitly/u)
assert.match(codexSkill, /the `tegy-mcp` MCP server exactly\n   once/u)
assert.match(codexSkill, /Do not send `action`, `review_id`/u)
assert.match(codexSkill, /the decision gate passes/u)
assert.match(codexSkill, /the gate does not pass/u)
assert.match(codexSkill, /the gate blocks the decision/u)
assert.match(codexSkill, /Gate outcome: NO RESULT/u)
assert.match(codexSkill, /request_cancelled` or `review_timeout/u)
assert.doesNotMatch(codexSkill, /Invoke automatically|automatic interview review/iu)
assert.doesNotMatch(codexSkill, /action:\s*["'`](?:start|get)/u)
assert.doesNotMatch(codexSkill, /retry_after|polling loop/iu)

assert.match(codexSkillUi, /display_name: "Tegy Decision Review"/u)
assert.match(codexSkillUi, /\$tegy-review/u)
assert.match(codexSkillUi, /value: "tegy-mcp"/u)
assert.match(codexSkillUi, /url: "https:\/\/mcp\.tegy\.io\/mcp"/u)
assert.match(codexSkillUi, /allow_implicit_invocation: false/u)

const pluginFiles = [...(await walk(claudeRoot)), ...(await walk(openAiRoot))]
const forbiddenNames = new Set([
  ".lsp.json",
  "package.json",
  "package-lock.json",
  "hooks.json",
  "monitors.json",
])
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

assert.doesNotMatch(
  JSON.stringify(reviewCases),
  /create_chat|start_turn|create_handoff|review_id|retry_after/iu
)

assert.deepEqual(decisionGateEvalCases.targets, ["claude-code", "claude-cowork"])
assert.ok(decisionGateEvalCases.cases.some(item => item.kind === "negative"))
assert.ok(decisionGateEvalCases.cases.some(item => item.kind === "positive"))
console.log("Plugin package, consent, isolated-tool, and credential boundaries passed.")

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
