import assert from "node:assert/strict"
import { readFile, readdir, stat } from "node:fs/promises"
import path from "node:path"

const root = path.resolve("plugins/tegy")
const manifest = JSON.parse(
  await readFile(path.join(root, ".claude-plugin/plugin.json"), "utf8")
)
const marketplace = JSON.parse(
  await readFile(".claude-plugin/marketplace.json", "utf8")
)

assert.equal(manifest.name, "tegy")
assert.equal(manifest.version, "1.0.0")
assert.equal(marketplace.name, "tegy")
assert.equal(marketplace.plugins?.length, 1)
assert.equal(marketplace.plugins[0]?.name, "tegy")
assert.equal(marketplace.plugins[0]?.source?.source, "git-subdir")
assert.equal(marketplace.plugins[0]?.source?.path, "plugins/tegy")
assert.match(
  marketplace.plugins[0]?.source?.sha ?? "",
  /^[0-9a-f]{40}$/u
)

const expectedSkills = ["advise", "gtm", "product", "ma", "handoff"]
const pluginFiles = await walk(root)
const forbiddenNames = new Set([
  ".mcp.json",
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

for (const skillName of expectedSkills) {
  const source = await readFile(
    path.join(root, "skills", skillName, "SKILL.md"),
    "utf8"
  )

  assert.match(source, /^---\n[\s\S]+?\n---\n/u)
  assert.match(source, /disable-model-invocation: true/u)
  assert.match(source, /mcp__tegy__/u)
  assert.match(source, /disallowed-tools:.*Bash/u)
  assert.doesNotMatch(source, /\bnpx\b|\bnpm install\b|\bcurl\b/u)
}

for (const skillName of ["gtm", "product", "ma"]) {
  const source = await readFile(
    path.join(root, "skills", skillName, "SKILL.md"),
    "utf8"
  )

  assert.match(source, new RegExp(`capability: "${skillName}"`, "u"))
  assert.match(source, /exact/u)
  assert.match(source, /keyword/u)
}

const advise = await readFile(
  path.join(root, "skills", "advise", "SKILL.md"),
  "utf8"
)
assert.match(advise, /capability: "advise"/u)

const handoff = await readFile(
  path.join(root, "skills", "handoff", "SKILL.md"),
  "utf8"
)
assert.match(handoff, /Do not infer/u)
assert.match(handoff, /mcp__tegy__create_handoff/u)

console.log(
  "Tegy plugin structure, capability routing, and no-executable checks passed."
)

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
