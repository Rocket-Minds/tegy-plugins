---
type: fixed
expect:
  problem: ["Choose the €6,000 pilot — without assuming demand."]
  context: ["Twelve branches are live.\nEight await security review."]
  constraints: ["Keep cash above €50,000.\nNo new funding is committed."]
  success_criteria: ["Name the owner, gates and reversal conditions."]
  idempotency_key: ["solve-fidelity-20261102-4v8t1p6z"]
---

{"ok": true, "status": "completed", "data": {"solve_id": "solve_synthetic_20261102", "status": "completed", "solution": "# Context\n\nTwo launch options under a €6,000 cap.\n\n# TL;DR\n\nRun the staged pilot only if finance confirms the cap. Demand remains unverified.\n\n## Next Steps\n\nMaya confirms cash before launch and stops the pilot at the cap.\n\n# Fact Base\n\nThe supplied cap is €6,000.\n\n# Risks\n\nDemand and payment timing are uncertain.\n\n# Key Assumptions\n\nNo further funding is assumed."}}
