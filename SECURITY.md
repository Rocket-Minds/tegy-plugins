# Security

The installed `tegy` plugin is limited to declarative `SKILL.md` files and its
manifest. It intentionally does not bundle an MCP server, local executable,
hook, monitor, package dependency, or install script.

The skills use the separately configured `tegy` MCP connection at
`https://mcp.tegy.io/mcp`. Authentication tokens remain in Claude's MCP client
storage and are not part of this repository.

Report a security issue privately to `admin@tegy.io`. Do not include access
tokens, private strategy work, or credentials in a public issue.
