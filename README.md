# Tegy plugins

Tegy gives Claude Code three consulting commands backed by
[Tegy](https://app.tegy.io/mcp):

- `/tegy:solve` interviews the user, builds a decision, and sends the finished
  candidate through the Review gate.
- `/tegy:review` independently checks an existing decision candidate.
- `/tegy:brief` turns existing material into concise executive communication.

Claude may select each skill automatically from its description. Solve is for
making a decision, Review is for gating an existing candidate, and Brief is for
rewriting existing material without changing the underlying strategy.

The plugin is declarative: three short skills, two exact-tool runners, and one
hosted MCP connection. It ships no executable, hook, dependency, or install
script. Tegy's service owns OAuth, durable execution, and real model output.

## Install in Claude Code

In a new Claude Code session:

```text
/plugin marketplace add Rocket-Minds/tegy-plugins
/plugin install tegy@tegy
/reload-plugins
```

Open `/mcp`, select the plugin-provided `tegy` server, and complete Tegy OAuth.
The requested permissions are Review and Brief. After connecting, the `/`
picker shows `/tegy:solve`, `/tegy:review`, and `/tegy:brief`.

Review and Brief consume Tegy allowance when their hosted tool runs. Solve asks
questions without spending review allowance; it uses one Review only when a
complete decision candidate is ready.

### Upgrading from older versions

Older setup instructions added a separate MCP server named `tegy`. That entry
can hide the plugin-provided server. Run `claude mcp remove tegy` in the scope
where it was added, reload plugins, then authenticate the plugin-provided Tegy
server in `/mcp`.

## Command behavior

### Solve

Use for a business decision, strategy, plan, or recommendation. Claude asks one
decision-changing question at a time, distinguishes evidence from assumptions,
updates its hypothesis, and avoids a premature recommendation. At the decision
boundary, it freezes the brief, candidate, evidence, and unknowns for one
independent Review. A PASS may be presented; REVISE is corrected; BLOCK returns
to the missing evidence or choice.

### Review

Use when a complete candidate already exists. Supply:

```text
Original brief: ...
Candidate: ...
Evidence: ...
Unknowns: ...
Criteria: ...        # optional
Idempotency key: ... # optional; reuse only for identical recovery
```

The isolated runner makes one hosted Review call and returns its terminal result
with PASS, REVISE, BLOCK, or NO RESULT. It does not poll or silently start a
second paid review.

### Brief

Use to edit analysis, notes, technical prose, or an AI draft into an executive
note, email, memo, status update, or slide-ready message. Supply Source text and
optionally Purpose, Audience, Format, Constraints, and an Idempotency key. The
isolated runner makes one hosted Brief call and returns only the finished
communication.

## Other clients

The Codex package remains the explicit `$tegy-review` decision gate. Add this
marketplace with `codex plugin marketplace add Rocket-Minds/tegy-plugins`, then
install `tegy-openai@tegy`.

Claude.ai and ChatGPT can connect directly to `https://mcp.tegy.io/mcp`, but a
raw connector does not install the Claude Code skills.

## Privacy and validation

Review sends only its frozen decision packet. Brief sends only its labelled
source packet. The plugin does not silently forward conversation history or
ambient files.

Validate locally with:

```bash
claude plugin validate ./plugins/tegy --strict
python3 /path/to/plugin-creator/scripts/validate_plugin.py ./plugins/tegy-openai
node tests/validate-structure.mjs
```

See [app.tegy.io/mcp](https://app.tegy.io/mcp) for installation and connection
management.
