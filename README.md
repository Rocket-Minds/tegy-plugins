# Tegy plugins

Tegy provides three operations on material you explicitly supply:

| Operation | Input | Result |
| --- | --- | --- |
| Review | Original brief and complete draft; optional evidence and criteria | Independent verdict and findings |
| Solve | Business problem; optional context, constraints and success criteria | Recommendation, fact base, risks, assumptions and next steps |
| Executive Summary (`brief`) | Source text; optional audience, purpose, format and constraints | Finished communication |

The service is operated by **MGMJ Innovation Group LLC**, under the Tegy by
RocketMinds brand. A Tegy account with eligible access is required. Review and
Solve use the account's applicable allowance. Executive Summary does not consume
a customer session allowance. The host controls permission for each hosted call.
The packages do not execute plans, run local code, install hooks, or use result cards.

## Claude Code

```text
/plugin marketplace add Rocket-Minds/tegy-plugins
/plugin install tegy@tegy
/reload-plugins
```

Open `/mcp`, select the plugin's `tegy` server and authenticate. Use
`/tegy:review`, `/tegy:solve`, or `/tegy:brief`, or explicitly ask Tegy for that
operation with its required material. Ordinary questions and writing requests
stay in Claude. The [app connection guide](https://app.tegy.io/mcp) points
Claude terminal and Claude Code in the desktop app to this package.

## Cowork

1. Open **Customize > Plugins > Add > Add marketplace**.
2. Add `https://github.com/Rocket-Minds/tegy-plugins` and install **Tegy for Cowork**.
3. Connect its `Tegy_Strategy` connector through OAuth.
4. Start a new task and choose Review, Solve, or Brief (Executive Summary).

On Team and Enterprise, an Owner or Primary Owner may need to register the
plugin's connector first. Use its supplied name to distinguish it from older
Tegy connections. Update through **Add > Manage marketplaces > tegy-plugins >
Check for updates** and disable overlapping uploaded copies.

## Codex

```text
codex plugin marketplace add Rocket-Minds/tegy-plugins
codex plugin add tegy-openai@tegy
```

Use `$tegy-review`, `$tegy-solve`, or `$tegy-brief`, or explicitly ask Tegy for
that operation in ordinary language. Requests that do not ask for Tegy stay
in Codex. The bundled `tegy-mcp` connection provides the same three operations;
it does not depend on the older registered Review app.

## Permissions and upgrades

All packages connect to
`https://mcp.tegy.io/mcp?integration=openai&delivery=text`. This text profile
is host independent. It exposes `review`, `solve`, `brief`, and `read_result`
according to consent and excludes Execute. The requested permissions are exactly
`tegy:review:run`, `tegy:brief:run`, and `tegy:solve:run`.

Updating a package does not expand an existing Review-only grant. Reauthenticate
the plugin's connection and confirm all three permissions on Tegy's consent
screen. In Claude Code, use `/mcp` or `claude mcp login plugin:tegy:tegy`.
Cowork now uses `Tegy_Strategy`, separate from the old `Tegy_Review_Only`
connection. Keep old accepted jobs on their original connection for recovery;
reconnecting as a new grant does not transfer those jobs.

A direct Claude or ChatGPT connector does not install these skills. GitHub
marketplace installation is separate from Anthropic directory approval and
OpenAI's directory package; no publication or acceptance is implied here.

## Results and recovery

Review and Solve can take several minutes. The host retrieves the same accepted
job and presents Tegy's completed answer faithfully. If work is still running
when waiting pauses, it explains the status briefly; ask to continue the same
Tegy request later. A pending receipt is not failure or a completed answer.
Retrieval does not start or charge for another operation. The host keeps the
accepted job ID for recovery; it does not replace Tegy's result with its own.

Executive Summary returns its finished text directly, without `read_result`.
After an interruption, an explicit retry uses the complete retained packet and
identical key to recover that operation.

If permission is denied or a request cannot complete, the host explains what
happened and the next step without automatically resubmitting. It retains the
exact packet, key and any accepted job ID for recovery; a full technical payload
is available when requested rather than displayed by default. A conflict stops
an automatic retry. Changed input is new work, not recovery. Editing a draft
does not carry forward an earlier Review assessment. Solve and Executive Summary
do not imply Review approval or execution of a plan.

## What is sent

Each operation sends only its selected input fields and a random request key.
Result retrieval sends only the accepted job ID. The plugins do not send the
whole conversation, ambient files, or a host session ID. Include selected file
or link content in the packet yourself; Tegy cannot retrieve it independently.
OAuth and discovery exchange the metadata needed to authenticate and find tools.
Account, connection and request identifiers, IP addresses, timing, usage and
error metadata are described in [privacy sections 2.3 and 2.4](https://tegy.io/privacy).

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
synthetic MCP responses and the three-operation text catalog. They check
activation, missing inputs, exact packets, pending results, recovery, denial,
conflicts, verdict handling and untrusted result instructions. Mocked tools
are automatically permitted by the harness. Cowork's package runs in Claude
Code's harness; this does not verify the Cowork host or real OAuth permissions.

Before release, run `tests/decision-gate-eval-cases.json` in each target host
with synthetic material. Record fresh OAuth, approval and denial, each completed
operation, exact-key replay, recovery and isolation between connections. Audit
that denied calls create no work and recovery creates no duplicate paid job.
Directory acceptance and installation require their own evidence.

## License and help

The public manifests, skills and documentation use the [MIT License](LICENSE).
Tegy's hosted backend, private methods and knowledge sources remain outside
this distribution and subject to the [service terms](https://tegy.io/terms)
and account allowances. See [help.tegy.io](https://help.tegy.io).
