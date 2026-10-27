# Tegy for Cowork

Tegy independently reviews a supplied business decision. It returns a verdict
and findings about the original brief, complete draft and selected evidence.
The service is operated by **MGMJ Innovation Group LLC**, under the Tegy by
RocketMinds brand. A Tegy account with eligible access and an internet
connection are required. Starting a review uses Tegy allowance.

## Connect and use

Claude Code installation: `/plugin install tegy-cowork --marketplace Rocket-Minds/tegy-plugins`.

Install this package from the Rocket-Minds/tegy-plugins marketplace and connect
its Tegy server through OAuth. Choose Review or explicitly request an independent
external review. Supply the original brief and complete draft; evidence and
criteria are optional. Ordinary business questions and writing requests stay
in Claude. The host controls permission for hosted calls.

The connection requests only `tegy:review:run` and exposes two tools: `review`
and `read_result`. It uses `https://mcp.tegy.io/mcp?integration=openai&delivery=text`. This is the existing host-independent
Review-only text profile; the `integration` parameter selects that tool surface.
The package includes no Solve, Brief or Execute commands and needs no result card.

A review can take several minutes. An accepted receipt is not a completed review.
Claude retrieves the accepted job by its ID, up to 24 reads per invocation,
and presents the completed result in the conversation. Reads wait on the server
and do not start or charge for a second review. If the result is still pending,
ask to retrieve the same job ID later. Keep using the same authenticated Tegy
connection; another connection cannot read that connection's job.

## Data and recovery

A new request sends the selected original brief, complete draft (including any
supplied unknowns), optional evidence and criteria, and a random request key.
Result retrieval sends only the returned job ID. OAuth and MCP discovery carry
the authentication and connection metadata needed to connect. The plugin does
not send an entire conversation, ambient files, or a Claude session ID. Include
selected file or link content in the packet yourself; Tegy cannot fetch it.
Account and request identifiers, IP addresses, timing, usage and error metadata
are covered by privacy sections 2.3 and 2.4.

If permission is denied or a call fails, Claude is instructed to return the
complete attempted packet and key, plus any accepted job ID. Keep this JSON.
An explicit retry must use the identical packet and key, or retrieve the known
job ID without starting Review. A changed packet needs a new key and may use
more allowance. A conflict stops recovery; it does not authorize a new key.
A revised draft does not inherit a prior review's PASS.

## Help and privacy

See the [connection guide](https://app.tegy.io/mcp),
[help center](https://help.tegy.io), [privacy notice](https://tegy.io/privacy),
and [terms](https://tegy.io/terms).
