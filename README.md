# Tegy plugins

Official, reviewable plugins for using
[Tegy](https://app.tegy.io/mcp) through its authenticated hosted MCP service.

Claude Code gets `/tegy:review` and the sole Tegy MCP connection in one plugin.
The skill can also invoke one review automatically at a strategy-interview
decision checkpoint: after Claude has a provisional candidate answer and
before it commits to a conclusion.

ChatGPT and Codex get the same bounded workflow as `$tegy-review`, together
with the registered Tegy MCP connection.

Both packages are declarative. They contain remote-MCP configuration, skill
instructions, and one tool-restricted Claude runner, but no local server,
executable, hook, dependency, or install script. Tegy's hosted service remains
the boundary for OAuth, review execution, billing, and real reviewer output.

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

### Upgrading from 2.0

Version 2.0 told Claude Code users to add `tegy` as a separate MCP server.
Local, project, and user MCP definitions take precedence over plugin-provided
servers, so that legacy entry can hide the plugin's tool. In each project where
you followed the old setup, inspect `/mcp` and remove the manually added
`tegy` server from its original scope. For the default local-scope command in
the 2.0 instructions, run `claude mcp remove tegy` from that same project
directory. Then run `/reload-plugins`, open `/mcp`, and authenticate the
plugin-provided `tegy` server. Do not use an unverified same-named server as a
fallback.

During a strategy or case interview, Claude may use the skill once after it
has formed a substantive provisional answer with material assumptions and
before it gives a conclusion. It should not run during opening clarification,
initial structuring, or routine work. It runs at most one automatic Tegy review
in the same case.

For a deterministic manual review, invoke `/tegy:review` with an explicit
packet:

```text
Original brief: ...
Strategy draft: ...
Criteria: ...        # optional
Evidence: ...        # optional
Idempotency key: ... # optional, reuse only for an identical recovery
```

The manual command asks for either required field if it is absent. The hosted
review is one long-running tool call; the client does not start a job and poll
it through follow-up tool calls.

An automatic review consumes Tegy allowance. The skill pre-approves only the
plugin-provided `review` tool, so Claude can run that one call at the decision
checkpoint without a separate per-call permission prompt. Disable the plugin
when you do not want automatic reviews.

## Claude.ai

The Claude Code plugin is not a Claude.ai extension. To expose Tegy's hosted
tool in Claude.ai, use
[Connect Tegy](https://claude.ai/new?modal=add-custom-connector&connectorName=Tegy&connectorUrl=https%3A%2F%2Fmcp.tegy.io%2Fmcp#settings/customize-connectors),
select **Connect**, sign in to Tegy, and enable it in the conversation. The
connector alone does not install the Claude Code skill instructions.

## ChatGPT

Tegy is currently available as a personal developer-mode plugin while the
public universal-directory submission is reviewed:

1. In ChatGPT, enable **Settings → Security and login → Developer mode**.
2. Open **Plugins**, choose **Create app**, and enter
   `https://mcp.tegy.io/mcp`.
3. Keep the discovered OAuth configuration, review the requested scopes, and
   sign in with Tegy.
4. Start a Work chat, type `@`, and select Tegy.

This developer path is not a public directory listing. A published listing
will replace it with ordinary directory installation after OpenAI review.

## Codex

Add this repository marketplace and install Tegy:

```bash
codex plugin marketplace add Rocket-Minds/tegy-plugins
codex plugin add tegy-openai@tegy
```

Start a new thread after installation. Invoke `$tegy-review` with an explicit
packet, or conduct a strategy interview and let Codex use the skill once at a
provisional-answer checkpoint.

An automatic Codex review also consumes Tegy allowance. Its exact permission
behavior follows the Codex host and the user's plugin settings.

## Privacy and billing boundary

A manual review sends only the explicit original brief, strategy draft,
optional review criteria, and optional evidence in the command packet. An
automatic interview review sends the interviewer's exact case objective,
Claude's provisional candidate answer, and only facts, data, or criteria the
interviewer supplied for that case.

The skills do not forward the whole conversation, ambient files, inferred
facts, or unselected local content. The hosted service returns a bounded
reviewer result. In automatic interview mode, the client uses those findings
to revise its candidate answer; Tegy does not impersonate the client or inject
a fake assistant response.

## Source and validation

The Claude marketplace pins each published release to an immutable Git commit.
Client-only automatic-trigger cases for Claude Code and Codex live in
`tests/interview-eval-cases.json`; they are intentionally separate from the
ChatGPT app-submission cases.
Validate both packages locally with:

```bash
claude plugin validate ./plugins/tegy --strict
python3 /path/to/plugin-creator/scripts/validate_plugin.py ./plugins/tegy-openai
node tests/validate-structure.mjs
```

See the [Tegy setup page](https://app.tegy.io/mcp) for supported clients,
connection management, and privacy details.
