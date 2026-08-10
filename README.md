# Tegy plugins

Official, reviewable plugins for using
[Tegy](https://app.tegy.io/mcp) through its authenticated remote MCP service.

Claude Code gets one focused command: `/tegy:review`.

ChatGPT and Codex get the same focused workflow as `$tegy-review`, together
with the registered Tegy MCP connection.

Both packages are declarative. The OpenAI package contains the registered app
mapping plus a direct remote-MCP mapping so Codex accounts can complete Tegy
OAuth independently. Neither package contains a local server, executable,
hook, dependency, or installation script. Tegy's hosted service remains the
product boundary for authentication, review execution, and real assistant
output.

## Claude

Connect the hosted Tegy service before using the optional command pack:

1. Open [Connect Tegy](https://claude.ai/new?modal=add-custom-connector&connectorName=Tegy&connectorUrl=https%3A%2F%2Fmcp.tegy.io%2Fmcp#settings/customize-connectors).
2. Add Tegy, select **Connect**, then sign in to Tegy and allow access.
3. Enable Tegy in the Claude conversation where you want to use it.
4. Approve the first tool call if Claude asks.

An installed command pack is not proof that the connector is authorized.

## Claude Code

First connect the remote Tegy MCP service:

```bash
claude mcp add --transport http tegy https://mcp.tegy.io/mcp
```

Open `/mcp` in Claude Code and complete the browser authentication when
prompted. If Tegy is already connected through the same claude.ai account and
appears healthy in `/mcp`, do not add the duplicate direct connection.

Then, optionally, add this marketplace and install the command pack:

```text
/plugin marketplace add Rocket-Minds/tegy-plugins
/plugin install tegy@tegy
/reload-plugins
```

Run `/tegy:review` with an original brief and the complete strategy draft. The
command asks for either input if it is absent; it never fills gaps from the
surrounding conversation.

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

Start a new thread after installation. Invoke `$tegy-review` explicitly, or
ask Codex to use the Tegy plugin to review the brief and draft you supply.

## Privacy and billing boundary

Only the original brief, strategy draft, optional review criteria, and optional
evidence explicitly supplied to the command reach Tegy. The skills do not
forward surrounding conversation, ambient files, or unselected local content.
Tegy returns a bounded reviewer result; it does not rewrite the draft or create
a replacement strategy.

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
