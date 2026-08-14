import assert from "node:assert/strict"
import { readFile, readdir, stat } from "node:fs/promises"
import path from "node:path"

const claudeRoot = path.resolve("plugins/tegy")
const openAiRoot = path.resolve("plugins/tegy-openai")
const claudeManifest = await readJson(
  path.join(claudeRoot, ".claude-plugin/plugin.json")
)
const claudeMcpManifest = await readJson(path.join(claudeRoot, ".mcp.json"))
const claudeSkill = await readFile(
  path.join(claudeRoot, "skills", "review", "SKILL.md"),
  "utf8"
)
const claudeRunner = await readFile(
  path.join(claudeRoot, "agents", "tegy-review-runner.md"),
  "utf8"
)
const claudeDecisionGateEvalPrompt = await readFile(
  path.join(claudeRoot, "evals", "decision-gate", "prompt.md"),
  "utf8"
)
const claudeDecisionGateEvalGrader = await readFile(
  path.join(claudeRoot, "evals", "decision-gate", "graders", "criteria.md"),
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
const readme = await readFile("README.md", "utf8")
const reviewCases = await readJson("submission/openai/test-cases.json")
const decisionGateEvalCases = await readJson(
  "tests/decision-gate-eval-cases.json"
)

assert.equal(claudeManifest.name, "tegy")
assert.equal(claudeManifest.version, "4.0.0")
assert.match(claudeManifest.description, /explicit, blocking decision-review gate/u)
assert.equal(codexManifest.name, "tegy-openai")
assert.equal(codexManifest.version, "4.0.0")
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
      oauth: { scopes: "tegy:review:run" },
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
assert.equal(claudeMarketplace.plugins?.length, 1)
assert.equal(claudeMarketplace.plugins[0]?.name, "tegy")
assert.equal(claudeMarketplace.plugins[0]?.version, "4.0.0")
assert.match(
  claudeMarketplace.plugins[0]?.description ?? "",
  /Gate one complete decision candidate/u
)
assert.equal(claudeMarketplace.plugins[0]?.source?.source, "git-subdir")
assert.equal(claudeMarketplace.plugins[0]?.source?.path, "plugins/tegy")
assert.equal(
  claudeMarketplace.plugins[0]?.source?.sha,
  "083e3c4d52f244f3044897e092980e287fd5894a",
  "Claude marketplace must pin the immutable v4 payload commit."
)
assert.equal(codexMarketplace.name, "tegy")
assert.equal(codexMarketplace.plugins?.length, 1)
assert.equal(codexMarketplace.plugins[0]?.name, "tegy-openai")
assert.equal(codexMarketplace.plugins[0]?.version, "4.0.0")
assert.equal(codexMarketplace.plugins[0]?.source?.path, "./plugins/tegy-openai")
assert.equal(codexMarketplace.plugins[0]?.policy?.installation, "AVAILABLE")
assert.equal(codexMarketplace.plugins[0]?.policy?.authentication, "ON_INSTALL")

assert.match(claudeSkill, /^---\n[\s\S]+?\n---\n/u)
assert.match(claudeSkill, /disable-model-invocation: true/u)
assert.match(claudeSkill, /context: fork/u)
assert.match(claudeSkill, /agent: tegy:tegy-review-runner/u)
assert.match(claudeSkill, /background: false/u)
assert.match(claudeSkill, /allowed-tools: mcp__plugin_tegy_tegy__review/u)
assert.match(claudeSkill, /Run only when the user invokes \/tegy:review/u)
assert.match(claudeSkill, /never invoke automatically/u)
assert.match(claudeSkill, /The fork has no parent conversation history/u)
assert.match(claudeSkill, /Call `mcp__plugin_tegy_tegy__review` exactly once/u)
assert.match(claudeSkill, /Do\s+not send `action`, `review_id`/u)
assert.match(claudeSkill, /Gate outcome: PASS/u)
assert.match(claudeSkill, /Gate outcome: REVISE/u)
assert.match(claudeSkill, /Gate outcome: BLOCK/u)
assert.match(claudeSkill, /Gate outcome: NO RESULT/u)
assert.match(claudeSkill, /Parent must not present the decision as final/u)
assert.match(claudeSkill, /Assumptions and calculations/u)
assert.match(claudeSkill, /Risks and reversal conditions/u)
assert.match(claudeSkill, /Recovery idempotency key: <key>/u)
assert.match(claudeSkill, /Terminal idempotency key: <key>/u)
assert.match(claudeSkill, /request_cancelled` or `review_timeout/u)
assert.doesNotMatch(claudeSkill, /mcp__tegy__review/u)
assert.doesNotMatch(claudeSkill, /Mode: manual|Mode: automatic/u)
assert.doesNotMatch(claudeSkill, /action:\s*["'`](?:start|get)/u)
assert.doesNotMatch(claudeSkill, /retry_after|polling loop/iu)

assert.match(claudeRunner, /^---\n[\s\S]+?\n---\n/u)
assert.match(claudeRunner, /name: tegy-review-runner/u)
assert.match(claudeRunner, /model: inherit/u)
assert.match(claudeRunner, /maxTurns: 4/u)
assert.match(claudeRunner, /tools:\n  - mcp__plugin_tegy_tegy__review/u)
assert.match(claudeRunner, /Do not inspect\nother context/u)
assert.match(claudeRunner, /Wait for the single call's terminal result/u)
assert.match(claudeRunner, /PASS, REVISE, BLOCK, or\nNO RESULT/u)
assert.doesNotMatch(claudeRunner, /mcp__(?!plugin_tegy_tegy__review)/u)

assert.match(claudeDecisionGateEvalPrompt, /^---\n[\s\S]+?\n---\n/u)
assert.match(claudeDecisionGateEvalPrompt, /^\/tegy:review$/mu)
assert.match(
  claudeDecisionGateEvalPrompt,
  /allowed_tools: \[Skill, mcp__plugin_tegy_tegy__review\]/u
)
assert.match(claudeDecisionGateEvalPrompt, /Decision candidate:/u)
assert.match(claudeDecisionGateEvalPrompt, /Risks and reversal conditions:/u)
assert.doesNotMatch(claudeDecisionGateEvalPrompt, /action:|review_id|poll/iu)
assert.match(claudeDecisionGateEvalGrader, /type: llm/u)
assert.match(claudeDecisionGateEvalGrader, /outcome of REVISE or BLOCK/u)
assert.match(
  claudeDecisionGateEvalGrader,
  /six-month delivery cannot satisfy the\n   ten-week decision objective/u
)

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

assert.match(readme, /Tegy Review v4 is a decision gate/u)
assert.match(readme, /One isolated runner makes one hosted review call/u)
assert.match(readme, /A timeout is not approval or denial/u)
assert.match(readme, /not native UI parity or a deterministic security guarantee/u)
assert.match(readme, /Claude cannot invoke it implicitly/u)
assert.match(readme, /allow_implicit_invocation: false/u)
assert.match(readme, /The hosted review consumes Tegy allowance/u)
assert.match(readme, /Upgrading from 2\.0 or 3\.0/u)
assert.match(readme, /remove the manually added\n`tegy` server/u)
assert.match(readme, /claude mcp remove tegy/u)
assert.match(readme, /tests\/decision-gate-eval-cases\.json/u)
assert.doesNotMatch(readme, /automatic interview review|may use the skill once/iu)

assert.equal(reviewCases.positive?.length, 2)
assert.equal(reviewCases.negative?.length, 4)
assert.match(JSON.stringify(reviewCases), /call only review once/iu)
assert.match(JSON.stringify(reviewCases), /No implicit decision review/u)
assert.doesNotMatch(
  JSON.stringify(reviewCases),
  /create_chat|start_turn|create_handoff|review_id|retry_after/iu
)

assert.deepEqual(decisionGateEvalCases.targets, ["claude-code", "codex"])
assert.match(decisionGateEvalCases.environment?.control ?? "", /weaker\/default host model/u)
assert.match(decisionGateEvalCases.environment?.invocation ?? "", /Enter the treatment gate explicitly/u)
assert.equal(
  decisionGateEvalCases.evaluation?.primary_metric,
  "critical decision-defect escape rate"
)
assert.match(decisionGateEvalCases.evaluation?.population ?? "", /held-out suite of multiple decision cases/u)
assert.equal(decisionGateEvalCases.cases?.length, 3)
assert.deepEqual(decisionGateEvalCases.cases[0]?.expected_trace, {
  skill_calls: 1,
  review_calls: 1,
  poll_calls: 0,
})
assert.deepEqual(decisionGateEvalCases.cases[1]?.expected_trace, {
  skill_calls: 0,
  review_calls: 0,
  poll_calls: 0,
})
assert.deepEqual(decisionGateEvalCases.cases[2]?.expected_trace, {
  skill_calls: 1,
  review_calls: 0,
  poll_calls: 0,
})
assert.doesNotMatch(
  JSON.stringify(decisionGateEvalCases),
  /create_chat|start_turn|create_handoff|review_id|retry_after/iu
)

console.log(
  "Tegy v4 explicit Claude/Codex decision-gate structure, boundary, recovery, and no-executable checks passed."
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
