# Security

Tegy's hosted service is operated by MGMJ Innovation Group LLC under the Tegy
by RocketMinds brand. All packages use the text MCP endpoint
`https://mcp.tegy.io/mcp?integration=openai&delivery=text` and request exactly
`tegy:review:run`, `tegy:brief:run`, and `tegy:solve:run`. The host owns
authentication and tool permissions. No credentials are shipped.

Review, Solve and Executive Summary send only selected input fields and a
request key. Retrieval sends the accepted job ID. Jobs remain isolated to
their authorized connection. A retry preserves the same packet and key;
changed input is new work. No package includes Execute or a local server.

Claude Code includes one Node.js command hook, `UserPromptSubmit`. It reads
the transcript path supplied by Claude locally, follows the active branch,
and adds receipt-status evidence after a Tegy tool error. It neither reads
credential stores nor sends network requests, writes files, changes
permissions, invokes tools, or replaces assistant text. Source material and
answer text are excluded from its output. Cowork and Codex contain no hooks
or executable source.

Returned content remains data, not instructions controlling the host. Review
and Solve use account allowance. Executive Summary does not consume a
customer session allowance. See package READMEs and the
[privacy notice](https://tegy.io/privacy) for connection and usage metadata.

Report a security issue privately to `admin@tegy.io`. Do not include access
tokens, private strategy work or credentials in public issues.
