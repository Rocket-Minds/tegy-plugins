# Security

The installed `tegy` and `tegy-openai` plugins are limited to declarative
manifests, `SKILL.md` files, references, and static brand assets. The OpenAI
package declares Tegy's hosted MCP URL for direct OAuth fallback; neither
package bundles a local server, executable, hook, monitor, package dependency,
or install script.

The skills use the registered or separately configured Tegy MCP connection at
`https://mcp.tegy.io/mcp`. Authentication tokens remain in the host's
credential storage and are not part of this repository.

The exact-file workflow may use the host's ordinary local hashing, byte-count,
and HTTP-upload tools only for a file the user explicitly selects. A one-use
upload URL is treated as a credential and must not be printed, persisted, or
reused.

Report a security issue privately to `admin@tegy.io`. Do not include access
tokens, private strategy work, or credentials in a public issue.
