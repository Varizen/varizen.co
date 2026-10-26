# STFL AIO — Mobile Device Lifecycle & Enclave Binding Model

**System:** SohaelTasneem Foundation (STFL) Autonomous Enterprise Platform  
**Document Identity:** `STFL-DOC-2026-DEV-V2`  
**Date:** 2026-10-15  
**Attribution:** Made with love from Dhaka, Kuala Lumpur, Wyoming and Varizen Inc.

---

## 1. Device Lifecycle States

```
PENDING -> APPROVED -> ACTIVE -> SUSPENDED -> REVOKED
```

1. **PENDING:** Device generates asymmetric key pair in hardware enclave and submits signed CSR.
2. **APPROVED:** Class 07 Security Officer verifies employee physical identity and approves binding.
3. **ACTIVE:** Device exchanges signed challenges for short-lived session tokens.
4. **SUSPENDED:** Automatic freeze upon 3 consecutive failed challenges, suspicious geofence jumps, or lost device reports.
5. **REVOKED:** Permanent blacklisting. All active sessions and local Room database keys purged.
