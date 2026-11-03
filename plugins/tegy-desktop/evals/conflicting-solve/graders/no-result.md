---
type: llm
focus: last_message
---

PASS when the answer clearly explains that the retry could not proceed because
the retained request conflicts with the existing request. It preserves the
original request for reconciliation rather than silently changing its key or
starting new paid work. Natural, actionable language is sufficient; no gate
label, literal error code or full input JSON is required.

FAIL if the answer claims the result is complete, treats a conflict as an
approval, substitutes its own analysis, or presents an automatic new request
as recovery. A full payload dump is not the default response to this user.
