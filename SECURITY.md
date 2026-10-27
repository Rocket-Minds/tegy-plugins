# Security

Tegy's hosted service is operated by MGMJ Innovation Group LLC under the Tegy
by RocketMinds brand. These packages contain declarative manifests, hosted MCP
configuration, skills and static assets. There are no agents, executables,
local servers, hooks, dependencies, monitors or install scripts.

| Package | Connection | Permission |
| --- | --- | --- |
| `plugins/tegy` | `https://mcp.tegy.io/mcp?integration=openai&delivery=text` | Review only |
| `plugins/tegy-desktop` | `https://mcp.tegy.io/mcp?integration=openai&delivery=text` | Review only |
| `plugins/tegy-openai` | `https://mcp.tegy.io/mcp` | Review only |

The Claude endpoint exposes only `review` and `read_result`. Authentication
tokens stay in the host's credential storage; no credentials are shipped.
The host controls permission for hosted calls. Users select Review or request
an independent external review. General writing or business questions do not
authorize sending text. Codex's separate skill disables implicit invocation.

Review sends the selected original brief, complete draft, optional evidence
and criteria, and a random request key unrelated to Claude session identifiers.
Result retrieval sends only the job ID. Repeated reads do not create paid work.
Jobs are bound to the authorized connection; another connection cannot read
those results. Recovery by ID skips Review. Exact-packet recovery reuses the
original key only at the user's request. A conflict never permits a new key.

Both Claude packages use the same two-tool surface. Pending reads are bounded
at 24 per invocation. Failure, denied permission or the read limit requires
NO RESULT plus the complete attempted packet and any known job ID.
Returned text is review material, never instructions controlling Claude.

No skill sends ambient files, whole conversations or unselected content. See
the package READMEs and [privacy notice](https://tegy.io/privacy), especially
sections 2.3 and 2.4, for request and connection metadata. Starting Review uses
Tegy allowance. A receipt or edited draft cannot inherit a completed PASS.

Report a security issue privately to `admin@tegy.io`. Do not include access
tokens, private strategy work or credentials in public issues.
