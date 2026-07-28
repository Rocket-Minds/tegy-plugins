# Tegy plugins

Official, reviewable command adapters for using
[Tegy](https://app.tegy.io/mcp) through its authenticated remote MCP service.

The `tegy` plugin adds:

- `/tegy:advise`
- `/tegy:gtm`
- `/tegy:product`
- `/tegy:ma`
- `/tegy:handoff`

The plugin is declarative and commands-only. It contains no local server,
`.mcp.json`, executable, hook, dependency, or installation script. Tegy's
hosted service remains the product boundary for authentication, usage, durable
chat state, StrategyOS behavior, and real assistant output.

## Install

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

## Privacy and billing boundary

Only the command arguments explicitly sent to Tegy reach Tegy. The skills do
not forward the surrounding Claude conversation or local files. Paid work uses
the connected Tegy account's normal allowance; typed usage errors report the
actual limit and reset instead of retrying silently.

## Source and validation

The marketplace pins each plugin release to an immutable Git commit. Validate
locally with:

```bash
claude plugin validate ./plugins/tegy --strict
node tests/validate-structure.mjs
```

See the [Tegy setup page](https://app.tegy.io/mcp) for supported clients,
connection management, and privacy details.
