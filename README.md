# Tegy plugins

Tegy independently reviews a supplied business decision. The Claude packages
provide one Review command and return text results in the conversation. They
request only Review permission. Solve, Brief, Execute and result cards are not
part of these packages.

The service is operated by **MGMJ Innovation Group LLC**, under the Tegy by
RocketMinds brand. A Tegy account with eligible access is required. Starting a
review uses Tegy allowance. The host controls approval for hosted tool calls.

## Claude Code

```text
/plugin marketplace add Rocket-Minds/tegy-plugins
/plugin install tegy@tegy
/reload-plugins
```

Open `/mcp`, select the plugin-provided Tegy server and complete OAuth. Use
`/tegy:review` or explicitly request an independent external review. Supply the
original brief and complete draft, plus any evidence and criteria you select.
An ordinary business question or writing request stays in Claude.

The server exposes only `review` and `read_result`. The completed assessment
returns through the normal tool response. Select the plugin-provided server
if you also have a manually configured Tegy connection.

## Claude Cowork

1. Open **Customize > Plugins > Add > Add marketplace**.
2. Add `https://github.com/Rocket-Minds/tegy-plugins` and install **Tegy for Cowork**.
3. Open its **Connectors** tab, select **Connect** and complete Tegy OAuth.
4. Start a new task and choose Review, or explicitly request an independent
   external review of the supplied brief and draft.

For Team and Enterprise, an Owner or Primary Owner must first register the
plugin's Review-only endpoint:
`https://mcp.tegy.io/mcp?integration=openai&delivery=text`.
The profile is host independent; `integration=openai` selects the existing
Review-only text surface. Both Claude packages use this same endpoint.

Update through **Add > Manage marketplaces > tegy-plugins > Check for updates**.
Disable older uploaded copies to avoid overlapping commands. No automatic
hook or Receive Tegy result permission is required.

## Results and recovery

A review can take several minutes. The tool returns either a completed review
or an accepted receipt with a job ID. For a receipt, Claude uses `read_result`
with that ID until completion, up to 24 reads per invocation. A read waits on
the server and does not start or charge for a second review. There is no card
or manual result handoff. A receipt must never be reported as a passed review.

If the result remains pending, ask to retrieve the same ID later. For explicit
recovery by job ID, Claude skips Review entirely. Recovery must use the same
Tegy connection; jobs are isolated to their authorized connection.

A failed or denied call returns the complete attempted packet and random key,
plus any accepted job ID. Keep it. If no job ID is known, ask to retry with the
identical packet and key. Do not reconstruct it from a summary. An idempotency
conflict stops the retry; a changed packet requires a new request and may use
more allowance. A revised draft does not inherit a previous review's PASS.

## What is sent

OAuth and MCP discovery send the connection information needed to authenticate
and discover tools. Review sends only the selected original brief, complete
draft and supplied unknowns, optional evidence and criteria, and a random
request key. Reading the result sends only the accepted job ID.

The plugin does not send an entire conversation, ambient files, or a Claude
session ID. Selected file or link content must be included in the packet;
Tegy cannot retrieve it independently. Account, connection and request
identifiers, IP addresses, timing, usage and error metadata are described in
[privacy sections 2.3 and 2.4](https://tegy.io/privacy).

## Other clients

The existing Codex package provides the explicit `$tegy-review` command. Add
this marketplace with `codex plugin marketplace add Rocket-Minds/tegy-plugins`,
then install `tegy-openai@tegy`. It requests only Review permission. Its package
is maintained separately from the Claude packages in this change.

A direct Claude or ChatGPT connector does not install these skills. See the
[connection guide](https://app.tegy.io/mcp) for supported setup paths.

## Validation

```bash
claude plugin validate . --strict
claude plugin validate ./plugins/tegy --strict
claude plugin validate ./plugins/tegy-desktop --strict
node tests/validate-structure.mjs
node tests/validate-desktop.mjs
claude plugin eval ./plugins/tegy --tag submission --ablation none --trust-plugin --no-publish --keep-temp
claude plugin eval ./plugins/tegy-desktop --tag submission --ablation none --trust-plugin --no-publish --keep-temp
```

The [native plugin evals](https://code.claude.com/docs/en/plugin-evals) use
synthetic MCP responses with the two-tool Review-only catalog. They check
ordinary requests, missing inputs, removed commands, exact packet replay,
pending-result retrieval, recovery by ID, conflicts, denied calls, and verdict
handling. Mocked tools are permitted automatically by the eval harness. A pass
proves these instruction behaviors; OAuth, real host permissions and live
result delivery require separate checks. The Cowork package is evaluated in
Claude Code's harness, not the Cowork host. Inspect reports and retained traces.

Before release, run `tests/decision-gate-eval-cases.json` in each real target
host with synthetic material. Record first-time OAuth, permission approval or
denial, completed results, identical-key replay and recovery by ID. Confirm
that retrieval creates no additional paid job and cannot cross connections.

[Manufact publishing checks](https://docs.manufact.com/dashboard/publish-checks)
can audit the live MCP server independently. Record the exact endpoint, tool
catalog, policy-review completeness and run time. A checklist score is separate
from native client delivery and directory acceptance.

For account or installation help, visit [help.tegy.io](https://help.tegy.io).

## License and scope

The public plugin manifests, skills and documentation are available under the
[MIT License](LICENSE). Tegy's separately hosted backend, private runtime and
private knowledge sources are outside this distribution and remain subject to
the [service terms](https://tegy.io/terms) and account allowances. Keep private
strategy methods and detailed review criteria in the hosted service.
