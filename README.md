# Tegy plugins

Official plugins for gating an explicit decision through
[Tegy's](https://app.tegy.io/mcp) authenticated independent reviewer.

Claude Code gets `/tegy:review` and the sole Tegy MCP connection in one plugin.
ChatGPT and Codex get the same explicit workflow as `$tegy-review`, together
with the registered Tegy MCP connection.

Tegy Review v4 is a decision gate, not an automatic interview coach. The user
selects a decision boundary, supplies one immutable decision packet, and waits
for a separate hosted reviewer before presenting the decision. Routine
analysis and recommendations do not consume review allowance automatically.

Both packages are declarative. They contain remote-MCP configuration, skill
instructions, and one tool-restricted Claude runner, but no local server,
executable, hook, dependency, or install script. Tegy's hosted service remains
the boundary for OAuth, review execution, billing, and real reviewer output.

## Review lifecycle

The workflow follows the behavioral shape of a dedicated review turn:

1. **Select the boundary.** Explicitly invoke the Tegy review skill.
2. **Freeze the target.** Supply the complete decision packet below.
3. **Enter review.** One isolated runner makes one hosted review call.
4. **Wait.** The call runs to a terminal result; the client does not poll.
5. **Exit review.** The parent receives one of four continuation rules:
   - `PASS`: present the reviewed candidate.
   - `REVISE`: materially address the findings before presenting a decision;
     do not claim Tegy approved the revision.
   - `BLOCK`: do not present a final decision; surface the missing evidence or
     unresolved choice.
   - `NO RESULT`: the review did not finish; do not claim the candidate was
     reviewed. Ask whether to retry or proceed explicitly without Tegy review.

A timeout is not approval or denial. A revise or block result cannot be bypassed
by restating the same candidate or automatically starting another review.

This matches the lifecycle principles of OpenAI Codex review and Auto-review:
a selected boundary, a separate reviewer, a terminal rationale, and controlled
continuation. A third-party skill cannot register Codex's native `review/start`
method, render `enteredReviewMode`/`exitedReviewMode` UI, or create a security
boundary inside the host. Tegy therefore provides an explicit workflow gate,
not native UI parity or a deterministic security guarantee.

## Decision packet

Every review requires these labelled fields:

```text
Original brief: ...
Decision candidate: ...
Supporting rationale: ...
Evidence: ...
Assumptions and calculations: ...
Alternatives considered: ...
Material unknowns: ...
Risks and reversal conditions: ...
Criteria: ...        # optional
Idempotency key: ... # optional, reuse only for an identical recovery
```

A required field may explicitly say `None identified` or `Not supplied`. It may
not be silently inferred from ambient conversation or files. The decision
candidate and its supporting fields are preserved as an immutable review
target; evidence and optional criteria remain separately labelled.

## Claude Code

Install the self-contained plugin in a new, otherwise vanilla Claude Code
environment:

```text
/plugin marketplace add Rocket-Minds/tegy-plugins
/plugin install tegy@tegy
/reload-plugins
```

Open `/mcp`, select the plugin-provided `tegy` server, and complete Tegy OAuth
when prompted. Installing the plugin does not prove that its server is
authorized; confirm that it is connected before relying on a review.

Invoke `/tegy:review` with the complete packet. The command is user-only:
Claude cannot invoke it implicitly. It runs synchronously in an isolated fork,
pre-approves only the plugin-provided reviewer tool, and returns the terminal
review plus the gate outcome to the parent conversation.

The hosted review consumes Tegy allowance. Explicit invocation is the consent
boundary; no ordinary interview, analysis, or recommendation starts a review.

### Upgrading from 2.0 or 3.0

Version 2.0 told Claude Code users to add `tegy` as a separate MCP server.
Local, project, and user MCP definitions take precedence over plugin-provided
servers, so that legacy entry can hide the plugin's tool. In each project where
you followed the old setup, inspect `/mcp` and remove the manually added
`tegy` server from its original scope. For the default local-scope command in
the 2.0 instructions, run `claude mcp remove tegy` from that same project
directory. Then run `/reload-plugins`, open `/mcp`, and authenticate the
plugin-provided `tegy` server. Do not use an unverified same-named server as a
fallback.

Version 3.0 could invoke during a model-inferred interview checkpoint. Version
4.0 removes that behavior. Start a new Claude session after updating, and enter
the gate explicitly with `/tegy:review` and the v4 decision packet.

## Claude.ai

The Claude Code plugin is not a Claude.ai extension. To expose Tegy's hosted
tool in Claude.ai, use
[Connect Tegy](https://claude.ai/new?modal=add-custom-connector&connectorName=Tegy&connectorUrl=https%3A%2F%2Fmcp.tegy.io%2Fmcp#settings/customize-connectors),
select **Connect**, sign in to Tegy, and enable it in the conversation. The
connector alone does not install the Claude Code decision-gate instructions.

## ChatGPT

Tegy is currently available as a personal developer-mode plugin while the
public universal-directory submission is reviewed:

1. In ChatGPT, enable **Settings → Security and login → Developer mode**.
2. Open **Plugins**, choose **Create app**, and enter
   `https://mcp.tegy.io/mcp`.
3. Keep the discovered OAuth configuration, review the requested scopes, and
   sign in with Tegy.
4. Start a Work chat, type `@`, and select Tegy.

This developer path connects the hosted tool directly; it does not install the
packaged `$tegy-review` skill. Supply the complete packet and explicitly ask for
one Tegy review. A published directory listing will replace this developer path
with ordinary plugin installation after OpenAI review.

## Codex

Add this repository marketplace and install Tegy:

```bash
codex plugin marketplace add Rocket-Minds/tegy-plugins
codex plugin add tegy-openai@tegy
```

Start a new thread after installation. Invoke `$tegy-review` with the complete
decision packet. The package sets `allow_implicit_invocation: false`, so Codex
does not select the gate merely because a task resembles a decision.

## Privacy and billing boundary

The review sends only the explicit original brief, decision candidate,
supporting rationale, evidence, assumptions and calculations, alternatives,
material unknowns, risks and reversal conditions, and optional criteria.

The skills do not forward the whole conversation, ambient files, inferred
facts, or unselected local content. The hosted service returns a bounded
reviewer result. The parent remains responsible for the final answer and must
follow the gate outcome; Tegy does not impersonate the client or inject a fake
assistant response.

## Source and validation

The Claude marketplace pins each published release to an immutable Git commit.
Decision-gate behavior cases for Claude Code and Codex live in
`tests/decision-gate-eval-cases.json`; they are intentionally separate from the
ChatGPT app-submission cases.

Validate both packages locally with:

```bash
claude plugin validate ./plugins/tegy --strict
python3 /path/to/plugin-creator/scripts/validate_plugin.py ./plugins/tegy-openai
node tests/validate-structure.mjs
```

See the [Tegy setup page](https://app.tegy.io/mcp) for supported clients,
connection management, and privacy details.
