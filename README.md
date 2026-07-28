# Tegy plugins

Official, reviewable plugins for using
[Tegy](https://app.tegy.io/mcp) through its authenticated remote MCP service.

Claude Code gets:

- `/tegy:advise`
- `/tegy:gtm`
- `/tegy:product`
- `/tegy:ma`
- `/tegy:handoff`

ChatGPT and Codex get the same five workflows as `tegy-advise`, `tegy-gtm`,
`tegy-product`, `tegy-ma`, and `tegy-handoff`, together with the registered
Tegy MCP connection.

Both packages are declarative. The OpenAI package contains the registered app
mapping plus a direct remote-MCP mapping so Codex accounts can complete Tegy
OAuth independently. Neither package contains a local server, executable,
hook, dependency, or installation script. Tegy's hosted service remains the
product boundary for authentication, usage, durable chat state, StrategyOS
behavior, exact uploads, and real assistant output.

## Claude Code

First connect the remote Tegy MCP service:

```bash
claude mcp add --transport http tegy https://mcp.tegy.io/mcp
```

Open `/mcp` in Claude Code and complete the browser authentication when
prompted. If Tegy is already connected through the same claude.ai account, do
not add the duplicate direct connection.

Then add this marketplace and install the command pack:

```text
/plugin marketplace add Rocket-Minds/tegy-plugins
/plugin install tegy@tegy
/reload-plugins
```

Run `/tegy:advise <your strategy question>` or another explicit command.

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

Start a new thread after installation. Invoke a focused workflow explicitly,
for example `$tegy-advise`, or ask Codex to use the Tegy plugin.

## Privacy and billing boundary

Only instructions and evidence explicitly sent to Tegy reach Tegy. The skills
do not forward surrounding conversation or unselected local files. Exact local
file upload is used only when the user selects a file and the host can access
its raw bytes; otherwise the workflow says that exact upload is unavailable.
Paid work uses the connected Tegy account's normal allowance; typed usage
errors report the actual limit and reset instead of retrying silently.

## Source and validation

The Claude marketplace pins its release to an immutable Git commit. Validate
both packages locally with:

```bash
claude plugin validate ./plugins/tegy --strict
python3 /path/to/plugin-creator/scripts/validate_plugin.py ./plugins/tegy-openai
node tests/validate-structure.mjs
```

See the [Tegy setup page](https://app.tegy.io/mcp) for supported clients,
connection management, and privacy details.
