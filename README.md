# Tegy plugins

Tegy provides three consulting commands backed by [Tegy](https://app.tegy.io/mcp):

- **Solve**: work through a business decision in Claude, then approve sending a
  finished candidate to Tegy for an independent review.
- **Review**: ask Tegy for an independent review of a supplied decision packet.
- **Brief**: ask Tegy to turn selected source text into an executive brief.

Use a command or explicitly ask for Tegy. A request for an independent external
review can also select Review. Ordinary business questions, emails, summaries,
and status updates do not call Tegy. Hosted Review uses Tegy allowance; Brief
requires eligible Tegy access but does not consume a session. Claude's local
interview does not use Tegy allowance. The host controls tool approval.

The hosted service is operated by **MGMJ Innovation Group LLC**, under the
Tegy by RocketMinds brand. See the [privacy notice](https://tegy.io/privacy).

## Claude Cowork

1. Open **Customize > Plugins > Add > Add marketplace** in Claude Cowork.
2. Add `https://github.com/Rocket-Minds/tegy-plugins` and install **Tegy for Cowork**.
3. Open its **Connectors** tab, select **Connect**, and complete Tegy OAuth.
4. Start a new task and choose Solve, Review, or Brief from the slash menu,
   or explicitly ask Claude to use Tegy.

The plugin sends one approved request. Its live result card shows progress and
then the completed result. Select **Discuss result** to bring that result back
into the task; send the draft if Claude places it in the composer. You can also
use **View Markdown** and paste the result. Claude can then discuss the brief
or apply the review findings. A receipt is not a completed review.

There are no automatic hooks. Finishing an unrelated task sends nothing to
Tegy, and a server response cannot restart the task. The result card reads only
its accepted job through the authenticated connection; it does not send the
conversation or a Claude session ID.

To update, use **Add > Manage marketplaces > tegy-plugins > Check for updates**.
Disable any earlier uploaded ZIP to avoid running an old copy alongside this
plugin. Remove any earlier Always allow rule for Receive Tegy result; this
version does not use that tool.

For Team and Enterprise, an Owner or Primary Owner first registers **Tegy
Cowork** at `https://mcp.tegy.io/mcp?delivery=app&integration=cowork`.

## Claude Code

```text
/plugin marketplace add Rocket-Minds/tegy-plugins
/plugin install tegy@tegy
/reload-plugins
```

Open `/mcp`, select the plugin-provided Tegy server, and complete OAuth. Use
`/tegy:solve`, `/tegy:review`, or `/tegy:brief`, or explicitly ask for Tegy.
Review and Brief use isolated tool runners and return the completed response
through the normal tool call. They do not pre-approve hosted calls or suppress
Claude's own explanation. Solve asks one decision-changing question at a time
and confirms the frozen packet with you before requesting Review.

### Older setup instructions

A manually added MCP server named `tegy` can hide the plugin's connection.
Remove that older entry with `claude mcp remove tegy` in its original scope,
reload plugins, and authenticate the plugin-provided server in `/mcp`.

## What is sent and when

Connecting sends OAuth and MCP connection information needed to authenticate
and discover tools. A hosted call then sends only the selected request fields:

- Review: original brief, candidate and unknowns, supplied evidence, optional
  criteria, and a random request key.
- Brief: source text, optional purpose, audience, format and constraints, and
  a random request key.
- Solve: the same Review packet, after the user approves sending it.
- Cowork result card: the accepted job ID when reading progress or the result.

No skill sends an entire conversation, ambient files, or a Claude session ID.
Source from a file or link must be selected for the request and included in the
packet. Tegy cannot fetch that material itself. Authentication, connection and
request identifiers, IP addresses, timing, usage and errors are processed as
described in [privacy sections 2.3 and 2.4](https://tegy.io/privacy).

If permission is denied or a connection stops before the result arrives, the
instructions ask Claude to return the complete attempted packet and key as
JSON. Keep it for recovery. Ask to retry with that exact object and key to
recover the same work. A changed packet needs a new key and may use more
allowance. Never claim a recommendation passed Review unless its completed
result says so.

## Other clients

The Codex package provides the explicit `$tegy-review` command. Add this
marketplace with `codex plugin marketplace add Rocket-Minds/tegy-plugins`, then
install `tegy-openai@tegy`. It requests only Review permission.

A direct Claude or ChatGPT connector does not install these client skills.
See [app.tegy.io/mcp](https://app.tegy.io/mcp) for supported setup paths.

## Validation

```bash
claude plugin validate . --strict
claude plugin validate ./plugins/tegy --strict
claude plugin validate ./plugins/tegy-desktop --strict
node tests/validate-structure.mjs
node tests/validate-desktop.mjs
```

Run the native [Claude plugin evals](https://code.claude.com/docs/en/plugin-evals)
with synthetic tool responses:

```bash
claude plugin eval ./plugins/tegy --tag submission --ablation none --trust-plugin --no-publish
claude plugin eval ./plugins/tegy-desktop --tag submission --ablation none --trust-plugin --no-publish
```

The fixtures expose all six tools using recorded public server definitions.
They check ordinary requests, explicit Brief and external Review requests,
Solve consent, exact packet recovery, and stopping after an idempotency
conflict. Mocked calls are automatically permitted by the eval harness:
these runs prove instruction behavior, not OAuth or the real approval prompt.
The Cowork package runs in Claude Code's harness here, not the Cowork host.
Inspect the generated report and traces; do not rely only on its score.
Refresh `evals/mocks/*/_tools.json` from `tools/list` when the server changes.

Before release, run `tests/decision-gate-eval-cases.json` in each target host
with synthetic material. Verify first-time OAuth and tool approval, completed
results, the Cowork card's user-initiated return, and identical-key recovery.
Record the package version and host; a fixture pass does not prove delivery.

[Manufact publishing checks](https://manufact.com/platform/publishing-checks)
provide an independent audit of the live MCP endpoint. Connect a dedicated
synthetic-test account, run the checklist for the target clients, and inspect
its protocol, schema, resource, CSP and compatibility findings. Record the
endpoint and run time. Its MCP audit does not inspect these installed skill
instructions or replace the target-host journeys. Policy review is a separate
check. A scanner pass does not guarantee directory acceptance.

For account or installation help, visit [help.tegy.io](https://help.tegy.io).

## License and scope

The plugin code, client-side skills, and documentation in this repository are
available under the [MIT License](LICENSE), including commercial reuse under
its terms.

This license applies to the material in this repository. Tegy's separately
hosted backend, private strategy runtime, and private knowledge sources are
not part of this distribution. Access to the hosted Tegy service remains
subject to its [service terms](https://tegy.io/terms) and account allowances.

Keep this public package focused on installation, connections, and client
interaction instructions. Substantive proprietary strategy methods, detailed
review criteria, and private knowledge sources belong in the hosted service.
Do not add those materials to this repository.
