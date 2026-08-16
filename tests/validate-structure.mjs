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
assert.equal(claudeManifest.version, "5.0.1")
assert.match(claudeManifest.description, /strategy solving.*decision review.*brief writing/u)
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
assert.equal(claudeMarketplace.plugins?.length, 1)
assert.equal(claudeMarketplace.plugins[0]?.name, "tegy")
assert.equal(claudeMarketplace.plugins[0]?.version, "5.0.0")
assert.match(
  claudeMarketplace.plugins[0]?.description ?? "",
  /strategy solving, decision review, and executive writing/u
)
assert.equal(claudeMarketplace.plugins[0]?.source?.source, "git-subdir")
assert.equal(claudeMarketplace.plugins[0]?.source?.path, "plugins/tegy")
assert.equal(
  claudeMarketplace.plugins[0]?.source?.sha,
  "c7e55158d6f61e6ccf6bcaa097c3bd52e7031735",
  "Claude marketplace must pin the immutable v5 payload commit."
)
assert.equal(codexMarketplace.name, "tegy")
assert.equal(codexMarketplace.plugins?.length, 1)
assert.equal(codexMarketplace.plugins[0]?.name, "tegy-openai")
assert.equal(codexMarketplace.plugins[0]?.version, "4.0.0")
assert.equal(codexMarketplace.plugins[0]?.source?.path, "./plugins/tegy-openai")
assert.equal(codexMarketplace.plugins[0]?.policy?.installation, "AVAILABLE")
assert.equal(codexMarketplace.plugins[0]?.policy?.authentication, "ON_INSTALL")

for (const skill of [claudeReviewSkill, claudeBriefSkill, claudeSolveSkill]) {
  assert.match(skill, /^---\n[\s\S]+?\n---\n/u)
  assert.doesNotMatch(skill, /disable-model-invocation:\s*true/u)
}
assert.match(claudeReviewSkill, /context: fork/u)
assert.match(claudeReviewSkill, /agent: tegy:tegy-review-runner/u)
assert.match(claudeReviewSkill, /pass the complete current user packet verbatim/u)
assert.match(
  claudeReviewSkill,
  /never recompute, correct, summarize, or normalize it/u
)
assert.match(claudeReviewSkill, /never call or retry the raw MCP review tool/u)
assert.match(claudeReviewSkill, /Call `mcp__plugin_tegy_tegy__review` once/u)
assert.match(claudeReviewSkill, /Gate: PASS/u)
assert.match(claudeReviewSkill, /Gate: REVISE/u)
assert.match(claudeReviewSkill, /Gate: BLOCK/u)
assert.match(claudeReviewSkill, /Gate: NO RESULT/u)
assert.doesNotMatch(claudeReviewSkill, /action:|review_id|polling loop/iu)

assert.match(claudeBriefSkill, /context: fork/u)
assert.match(claudeBriefSkill, /agent: tegy:tegy-brief-runner/u)
assert.match(claudeBriefSkill, /Call `mcp__plugin_tegy_tegy__brief` once/u)
assert.match(claudeBriefSkill, /Source text/u)
assert.doesNotMatch(claudeBriefSkill, /mcp__plugin_tegy_tegy__review/u)

assert.match(claudeSolveSkill, /Ask one highest-value question at a time/u)
assert.match(claudeSolveSkill, /Agent\(tegy:tegy-review-runner\)/u)
assert.match(claudeSolveSkill, /facts, assumptions, and\n+hypotheses/u)
assert.match(claudeSolveSkill, /do not recommend early/u)
assert.match(claudeSolveSkill, /delegate one frozen packet/u)

assert.match(claudeReviewRunner, /^---\n[\s\S]+?\n---\n/u)
assert.match(claudeReviewRunner, /tools:\n  - mcp__plugin_tegy_tegy__review/u)
assert.match(claudeBriefRunner, /^---\n[\s\S]+?\n---\n/u)
assert.match(claudeBriefRunner, /tools:\n  - mcp__plugin_tegy_tegy__brief/u)
assert.doesNotMatch(claudeReviewRunner, /mcp__(?!plugin_tegy_tegy__review)/u)
assert.doesNotMatch(claudeBriefRunner, /mcp__(?!plugin_tegy_tegy__brief)/u)

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

assert.match(readme, /\/tegy:solve/u)
assert.match(readme, /\/tegy:review/u)
assert.match(readme, /\/tegy:brief/u)
assert.match(readme, /select each skill automatically/u)
assert.match(readme, /asks one\n+decision-changing question at a time/u)
assert.match(readme, /one hosted Review call/u)
assert.match(readme, /one hosted Brief call/u)
assert.match(readme, /Review and Brief consume Tegy allowance/u)
assert.match(readme, /Older setup instructions/u)
assert.match(readme, /claude mcp remove tegy/u)

assert.equal(reviewCases.positive?.length, 2)
assert.equal(reviewCases.negative?.length, 4)
assert.match(JSON.stringify(reviewCases), /call only review once/iu)
assert.match(JSON.stringify(reviewCases), /No implicit decision review/u)
assert.doesNotMatch(
  JSON.stringify(reviewCases),
  /create_chat|start_turn|create_handoff|review_id|retry_after/iu
)

assert.deepEqual(decisionGateEvalCases.targets, ["claude-code"])
assert.match(decisionGateEvalCases.environment?.control ?? "", /weaker\/default host model/u)
assert.match(decisionGateEvalCases.environment?.invocation ?? "", /automatic skill selection/u)
assert.equal(
  decisionGateEvalCases.evaluation?.primary_metric,
  "critical decision-defect escape rate"
)
assert.match(decisionGateEvalCases.evaluation?.population ?? "", /held-out suite of multiple decision/u)
assert.equal(decisionGateEvalCases.cases?.length, 5)
assert.deepEqual(decisionGateEvalCases.cases[0]?.expected_trace, {
  brief_calls: 0,
  poll_calls: 0,
  review_calls: 0,
  skill_calls: 1,
  solve_calls: 1,
})
assert.deepEqual(decisionGateEvalCases.cases[2]?.expected_trace, {
  brief_calls: 0,
  poll_calls: 0,
  review_calls: 1,
  skill_calls: 1,
  solve_calls: 0,
})
assert.deepEqual(decisionGateEvalCases.cases[3]?.expected_trace, {
  brief_calls: 1,
  poll_calls: 0,
  review_calls: 0,
  skill_calls: 1,
  solve_calls: 0,
})
assert.deepEqual(decisionGateEvalCases.cases[4]?.expected_trace, {
  brief_calls: 0,
  poll_calls: 0,
  review_calls: 0,
  skill_calls: 0,
  solve_calls: 0,
})
assert.doesNotMatch(
  JSON.stringify(decisionGateEvalCases),
  /create_chat|start_turn|create_handoff|review_id|retry_after/iu
)

console.log(
  "Tegy v5 Claude command routing, exact-tool boundary, and no-executable checks passed."
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
