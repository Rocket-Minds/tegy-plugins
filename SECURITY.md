# Security

Tegy's hosted service is operated by MGMJ Innovation Group LLC under the Tegy
by RocketMinds brand. These public client packages contain declarative
manifests, hosted MCP configuration, skills, and static assets. Claude Code
also includes two isolated tool runners. No package contains an executable,
local server, hook, monitor, dependency, or install script.

| Package | Connection | Requested permissions |
| --- | --- | --- |
| `plugins/tegy` | `https://mcp.tegy.io/mcp` | Review and Brief |
| `plugins/tegy-desktop` | `https://mcp.tegy.io/mcp?delivery=app&integration=cowork` | Review and Brief |
| `plugins/tegy-openai` | `https://mcp.tegy.io/mcp` | Review only |

Authentication tokens remain in the host's credential storage. No credentials
are shipped. The Claude packages use the host's normal approval flow and do
not pre-approve hosted tool calls. Users invoke a command or explicitly ask
for Tegy; Review also accepts an explicit independent external review request.
A general writing or business question does not authorize sending text to Tegy.
Codex's review skill disables implicit invocation.

Review sends the selected decision packet; Brief sends the selected source
packet. Solve asks before sending its completed candidate for Review. Every
new request uses a random opaque key, not a Claude session ID. Recovery reuses
that key only with the identical packet and at the user's request. The Claude
Code runners are limited to their respective hosted Review or Brief tool.

Cowork ships no PostToolUse or Stop hook. The result card reads an accepted job
through the host's authenticated MCP connection. It sends only that job ID
and cannot read another user's or grant's job. The user chooses to send a
finished result back into the task with Discuss result or by pasting it. No
server-provided hook response can keep or restart a Claude turn.

No skill silently sends ambient files, whole conversations, or unselected
content. See each package README for the exact request fields and when they
are sent. The [privacy notice](https://tegy.io/privacy), particularly sections
2.3 and 2.4, covers authentication, request metadata, identifiers and timing.
Returned content is material to assess, not instructions controlling Claude.

Report a security issue privately to `admin@tegy.io`. Do not include access
tokens, private strategy work, or credentials in a public issue.
