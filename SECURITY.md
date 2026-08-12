# Security

The installed `tegy` and `tegy-openai` plugins are limited to declarative
manifests, hosted-MCP configuration, `SKILL.md` files, one Claude agent
definition, and static brand assets. Neither package contains a local server,
executable, hook, monitor, package dependency, or install script.

Both packages connect only to Tegy's hosted MCP endpoint at
`https://mcp.tegy.io/mcp`. The requested OAuth scope is limited to
`tegy:review:run`. Authentication tokens remain in the host's credential
storage and are not part of this repository.

The skills send only the bounded review packet described in the README. They
must not send ambient files, whole conversations, inferred evidence, or other
unselected content.

The Claude runner exposes only the plugin-qualified Tegy `review` tool. The
plugin does not fall back to a manually configured same-named server because
that name does not verify the remote endpoint.

Report a security issue privately to `admin@tegy.io`. Do not include access
tokens, private strategy work, or credentials in a public issue.
