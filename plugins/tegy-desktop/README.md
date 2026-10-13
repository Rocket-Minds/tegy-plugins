# Tegy for Cowork

Tegy helps you solve business decisions, independently review a supplied plan,
and write executive briefs. The service is operated by **MGMJ Innovation Group
LLC**, under the Tegy by RocketMinds brand. It requires a Tegy account with
available allowance and an internet connection.

## Connect and use

Install this package from the Rocket-Minds/tegy-plugins marketplace and connect
its Tegy server through OAuth. Select Solve, Review, or Brief from the command
menu or explicitly ask Claude to use Tegy. Ordinary business questions, emails,
and summaries do not activate Tegy. An explicit independent external review
request can select Review. The host controls permission for hosted calls.

Solve interviews you locally and asks before sending its frozen candidate to
Tegy. Review and Brief send your selected request to Tegy and consume Tegy
allowance. A receipt is not a completed result. The live result card shows
progress and the completed result. Select **Discuss result** to bring it into
this task, then send the draft if it appears in the composer. If unavailable,
select **View Markdown** and paste the result. No hook resumes a task
automatically.

## Data sent to Tegy

OAuth and MCP connection requests carry the authentication and connection
metadata needed to connect and discover tools. Hosted calls send:

- Review: original brief, candidate and unknowns, evidence, optional criteria,
  and a random opaque request key.
- Brief: source text, optional audience, purpose, format and constraints,
  and a random opaque request key.
- Solve: the Review packet after you approve sending it.
- Live result card: the accepted job ID when reading progress and the result.

There are no hooks. The plugin does not send Claude session IDs, an entire
conversation, or ambient files. Include only the file or link content you want
Tegy to process. The hosted tools cannot fetch it independently. Tegy also
processes account, connection and request identifiers, IP addresses, timing,
usage and error metadata as described in privacy sections 2.3 and 2.4.

If the connection fails, keep the packet and key. A user-requested retry uses
both unchanged to recover the same work; changing either may start paid work.
The tools do not make payments, send messages, or execute your business plan.

## Help and privacy

See the [connection guide](https://app.tegy.io/mcp),
[help center](https://help.tegy.io), [privacy notice](https://tegy.io/privacy),
and [terms](https://tegy.io/terms).
