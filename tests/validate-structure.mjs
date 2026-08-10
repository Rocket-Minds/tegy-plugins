import assert from "node:assert/strict"
import { readFile, readdir, stat } from "node:fs/promises"
import path from "node:path"

const claudeRoot = path.resolve("plugins/tegy")
const openAiRoot = path.resolve("plugins/tegy-openai")
const claudeManifest = await readJson(
  path.join(claudeRoot, ".claude-plugin/plugin.json")
)
const codexManifest = await readJson(
  path.join(openAiRoot, ".codex-plugin/plugin.json")
)
const appManifest = await readJson(path.join(openAiRoot, ".app.json"))
const mcpManifest = await readJson(path.join(openAiRoot, ".mcp.json"))
const claudeMarketplace = await readJson(".claude-plugin/marketplace.json")
const codexMarketplace = await readJson(".agents/plugins/marketplace.json")
const readme = await readFile("README.md", "utf8")

assert.equal(claudeManifest.name, "tegy")
assert.equal(claudeManifest.version, "2.0.0")
assert.equal(codexManifest.name, "tegy-openai")
assert.equal(codexManifest.version, "2.0.0")
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
assert.deepEqual(mcpManifest, {
  mcpServers: {
    "tegy-mcp": {
      oauth_resource: "https://mcp.tegy.io/mcp",
      scopes: ["tegy:review:run"],
      type: "http",
      url: "https://mcp.tegy.io/mcp",
    },
  },
})
assert.doesNotMatch(
  JSON.stringify(mcpManifest),
  /bearer|command|env|header|token/iu
)

assert.equal(claudeMarketplace.name, "tegy")
assert.equal(claudeMarketplace.plugins?.length, 1)
assert.equal(claudeMarketplace.plugins[0]?.name, "tegy")
assert.equal(claudeMarketplace.plugins[0]?.version, claudeManifest.version)
assert.equal(claudeMarketplace.plugins[0]?.source?.source, "git-subdir")
assert.equal(claudeMarketplace.plugins[0]?.source?.path, "plugins/tegy")
assert.match(
  claudeMarketplace.plugins[0]?.source?.sha ?? "",
  /^[0-9a-f]{40}$/u
)

assert.equal(codexMarketplace.name, "tegy")
assert.equal(codexMarketplace.plugins?.length, 1)
assert.equal(codexMarketplace.plugins[0]?.name, "tegy-openai")
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

assert.equal(
  (await walk(claudeRoot)).some((file) => path.basename(file) === ".mcp.json"),
  false,
  "Claude command pack must not bundle an MCP server"
)
assert.match(readme, /Connect the hosted Tegy service before/u)
assert.match(readme, /An installed command pack is not proof/u)
assert.match(readme, /Then, optionally, add this marketplace/u)
assert.match(readme, /\/tegy:review/u)
assert.match(readme, /\$tegy-review/u)

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
  assert.match(source, /disable-model-invocation: true/u)
  assert.match(source, /allowed-tools: mcp__tegy__review/u)
  assert.doesNotMatch(source, /mcp__tegy__(?!review)/u)
  assert.match(source, /disallowed-tools:.*Bash/u)
  assert.match(source, /never\s+call Bash|do not call Bash/iu)
  assert.match(source, /\[Connect Tegy\]\(https:\/\/claude\.ai\/new\?/u)
  assert.match(source, /add Tegy, select \*\*Connect\*\*/u)
  assert.match(source, /enable Tegy in the Claude conversation/u)
  assert.match(source, /Stop without claiming that Tegy ran\./u)
  assert.match(source, /original brief/u)
  assert.match(source, /strategy draft/u)
  assert.match(source, /data for Tegy to assess/u)
  assert.doesNotMatch(source, /\bnpx\b|\bnpm install\b|\bcurl\b/u)
}

for (const skillName of expectedOpenAiSkills) {
  const source = await readFile(
    path.join(openAiRoot, "skills", skillName, "SKILL.md"),
    "utf8"
  )

  assert.match(source, new RegExp(`name: ${skillName}`, "u"))
  assert.match(source, /authenticated `review` action/u)
  assert.match(source, /the `tegy-mcp` MCP server/u)
  assert.match(source, /^---\n[\s\S]+?\n---\n/u)
  assert.match(source, /original brief/u)
  assert.match(source, /strategy draft/u)
  assert.doesNotMatch(source, /\[TODO:/u)
}

const reviewCases = await readJson("submission/openai/test-cases.json")
assert.equal(reviewCases.positive?.length, 2)
assert.equal(reviewCases.negative?.length, 3)
assert.match(JSON.stringify(reviewCases), /call only review/u)
assert.doesNotMatch(JSON.stringify(reviewCases), /create_chat|start_turn|create_handoff/u)

console.log(
  "Tegy review-only Claude/OpenAI plugin structure, boundary, and no-executable checks passed."
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
