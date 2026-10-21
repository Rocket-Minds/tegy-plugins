# Tegy for Claude Code

Tegy helps you solve business decisions, independently review a supplied plan,
and write executive briefs. The service is operated by **MGMJ Innovation Group
LLC**, under the Tegy by RocketMinds brand. It requires a Tegy account with
eligible access and an internet connection.

## Connect and use

Install this package from the Rocket-Minds/tegy-plugins marketplace and connect
its Tegy server through OAuth. Select Solve, Review, or Brief from the command
menu or explicitly ask Claude to use Tegy. Ordinary business questions, emails,
and summaries do not activate Tegy. An explicit independent external review
request can select Review. The host controls permission for hosted calls.

Solve interviews you locally and asks before sending its frozen candidate to
Tegy. Review uses Tegy allowance. Brief requires eligible Tegy access but does
not consume a session. Both send only your selected request. A receipt is not
a completed result. The completed result returns
through the normal tool response. Claude can present and discuss it naturally.

## Data sent to Tegy

OAuth and MCP connection requests carry the authentication and connection
metadata needed to connect and discover tools. Hosted calls send:

- Review: original brief, candidate and unknowns, evidence, optional criteria,
  and a random opaque request key.
- Brief: source text, optional audience, purpose, format and constraints,
  and a random opaque request key.
- Solve: the Review packet after you approve sending it.

There are no hooks. The plugin does not send Claude session IDs, an entire
conversation, or ambient files. Include only the file or link content you want
Tegy to process. The hosted tools cannot fetch it independently. Tegy also
processes account, connection and request identifiers, IP addresses, timing,
usage and error metadata as described in privacy sections 2.3 and 2.4.

If permission is denied or the connection fails, Claude is instructed to return
the complete attempted packet and key as JSON. Keep it and ask to retry with
that exact object and key to recover the same work. Changing the packet needs
a new key and may start paid work.
The tools do not make payments, send messages, or execute your business plan.

## Help and privacy

See the [connection guide](https://app.tegy.io/mcp),
[help center](https://help.tegy.io), [privacy notice](https://tegy.io/privacy),
and [terms](https://tegy.io/terms).
