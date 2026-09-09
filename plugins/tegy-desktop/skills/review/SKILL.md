---
name: review
description: Use Tegy to independently check an existing business decision, strategy, or plan before it is shared or acted on. Not for creating a plan or editing its wording.
hooks:
  PostToolUse:
    - matcher: "^mcp__Tegy_Cowork__(review|brief)$"
      hooks:
        - type: mcp_tool
          server: Tegy_Cowork
          tool: receive_result
          input:
            event: PostToolUse
            session_id: "${session_id}"
            receipt: "${tool_response}"
          timeout: 270
  Stop:
    - hooks:
        - type: mcp_tool
          server: Tegy_Cowork
          tool: receive_result
          input:
            event: Stop
            session_id: "${session_id}"
          timeout: 270
---

Send the original brief, current candidate, and relevant supplied evidence to
`mcp__Tegy_Cowork__review` with a fresh idempotency key. Use this plugin's
connection, not another Tegy connector. Preserve
the candidate and evidence; include known gaps. Ask for the brief or candidate
if absent. Tegy cannot read this conversation, attachments, or links unless
you supply their relevant contents.

Cowork's hooks return the completed review into this task. A receipt is not a
passed review. Apply supported findings to strengthen the candidate and explain
what changed. Do not claim the corrected candidate passed another review. Ask
for missing evidence if blocked. Do not poll, start another review, or invent
findings. If delivery fails, preserve the packet and key for recovery; do not
present an unreviewed candidate as approved.
