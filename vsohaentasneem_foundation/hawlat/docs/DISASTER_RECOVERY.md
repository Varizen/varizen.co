# HAWLAT — Disaster Recovery

| Item | Target |
|---|---|
| RPO | ≤ 5 min (PITR + WAL archiving) |
| RTO | ≤ 4 h |

- Backups: continuous WAL, daily snapshots, encrypted, cross-region copy; quarterly restore drills with evidence.
- Ledger/audit/reputation integrity verified after restore (balance + hash-chain checks) before reopening writes.
- Failure runbooks: DB loss, region loss, provider outage, corrupted deploy (rollback), key compromise (rotate + revoke), suspected fraud (kill switches).
- Degraded mode: read-only marketplace if writes unsafe; settlement stays blocked.
- Reconciliation after any incident before resuming settlement.
- Communication plan and post-incident review within 5 business days.
