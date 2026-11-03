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
const claudeMarketplace = await readJson(".claude-plugin/marketplace.json")
const codexMarketplace = await readJson(".agents/plugins/marketplace.json")
const decisionGateEvalCases = await readJson(
  "tests/decision-gate-eval-cases.json"
)

assert.equal(claudeManifest.name, "tegy")
assert.match(claudeManifest.version, /^\d+\.\d+\.\d+$/u)
assert.match(claudeManifest.description, /Solve.*review.*executive summaries.*recovery/u)
assert.equal(codexManifest.name, "tegy-openai")
assert.equal(codexManifest.version, "5.0.0")
assert.match(codexManifest.description, /Solve.*review.*executive summaries/u)
assert.equal(codexManifest.apps, undefined, "The marketplace package must not load the obsolete registered Review app")
assert.equal(codexManifest.mcpServers, "./.mcp.json")
assert.equal(codexManifest.skills, "./skills/")
assert.deepEqual(codexManifest.interface.capabilities, [])
const scopes = ["tegy:review:run", "tegy:brief:run", "tegy:solve:run"]
const endpoint = "https://mcp.tegy.io/mcp?integration=openai&delivery=text"

assert.deepEqual(claudeMcpManifest, {
  mcpServers: {
    tegy: {
      type: "http",
      url: "https://mcp.tegy.io/mcp?integration=openai&delivery=text",
      oauth: { scopes: scopes.join(" ") },
      alwaysLoad: true,
      timeout: 2_100_000,
    },
  },
})
assert.equal(Object.keys(claudeMcpManifest.mcpServers).length, 1)
assert.deepEqual(codexMcpManifest, {
  mcpServers: {
    "tegy-mcp": {
      type: "streamable-http", url: endpoint,
      extensions: { "com.openai": { auth: {
        type: "oauth", client: { mode: "dcr" }, baseScopes: scopes, defaultScopes: scopes,
      } } },
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

assert.deepEqual((await readdir(path.join(claudeRoot, "skills"))).sort(), ["brief", "review", "solve"])
assert.deepEqual(
  (await walk(claudeRoot))
    .map(file => path.relative(claudeRoot, file))
    .filter(file => !file.startsWith("evals/"))
    .sort(),
  [".claude-plugin/plugin.json", ".mcp.json", "README.md", "assets/icon.svg", "skills/brief/SKILL.md", "skills/review/SKILL.md", "skills/solve/SKILL.md"]
)
for (const [root, prefix] of [[claudeRoot, ""], [openAiRoot, "tegy-"]]) {
  assert.deepEqual((await readdir(path.join(root, "skills"))).sort(), ["brief", "review", "solve"].map(name => prefix + name))
  for (const operation of ["review", "solve", "brief"]) {
    const source = await readFile(path.join(root, "skills", prefix + operation, "SKILL.md"), "utf8")
    assert.match(source, /^---\n[\s\S]+?\n---\n/u)
    const header = source.split("\n---\n")[0]
    assert.doesNotMatch(header, /^(?:allowed-tools|hooks):/mu, "Hosted calls must use the host permission flow")
    assert.doesNotMatch(source, /\$\{CLAUDE_SESSION_ID\}/u)
    assert.match(source, /idempotency_key|identical key/u)
    assert.match(source, /NO RESULT/u)
    if (prefix) {
      assert.ok(header.includes("explicitly invokes $" + prefix + operation))
      const ui = await readFile(path.join(root, "skills", prefix + operation, "agents/openai.yaml"), "utf8")
      assert.ok(ui.includes(endpoint))
      assert.match(ui, /allow_implicit_invocation: false/u)
    }
  }
}
assert.match(claudeReviewSkill, /Gate: PASS/u)
assert.match(claudeReviewSkill, /Gate: REVISE/u)
assert.match(claudeReviewSkill, /Gate: BLOCK/u)
assert.match(codexSkill, /read_result/u)
assert.match(codexSkillUi, /value: "tegy-mcp"/u)

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

assert.deepEqual(decisionGateEvalCases.targets, ["claude-code", "claude-cowork", "codex"])
assert.ok(decisionGateEvalCases.cases.some(item => item.kind === "negative"))
assert.ok(decisionGateEvalCases.cases.some(item => item.kind === "positive"))
console.log("Plugin packages, three-operation permissions, and credential boundaries passed.")

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
