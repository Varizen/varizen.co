# STFL AIO — Contextual Attribute-Based Authorization (ABAC) Model

**System:** SohaelTasneem Foundation (STFL) Autonomous Enterprise Platform  
**Document Identity:** `STFL-DOC-2026-AUTH-V2`  
**Date:** 2026-10-15  
**Attribution:** Made with love from Dhaka, Kuala Lumpur, Wyoming and Varizen Inc.

---

## 1. Contextual Decision Vector

Authorization is not a simple role check. The platform policy evaluates a multi-dimensional decision vector:

```
DECISION = EvaluatePolicy(
    Actor,
    ActorClass,
    AssignedRole,
    BusinessUnit,
    ProjectId,
    TargetResource,
    RequestedAction,
    EvaluationScope,
    TransactionAmount,
    DeviceSecurityState,
    SessionRiskScore
)
```

---

## 2. Scope Hierarchy
1. `GLOBAL`: Platform-wide oversight (Class 00/01/02 only).
2. `ORGANIZATION`: Foundation-wide operational unit scope.
3. `UNIT`: Specific department (Finance, Property, Microfinance).
4. `REGION`: Geographic division (Dhaka, Sylhet, Chittagong, etc.).
5. `PROJECT`: Bounded project boundary (zero cross-project leakage).
6. `PROPERTY`: Bounded physical real estate asset or cluster.
7. `PORTFOLIO`: Bounded loan or asset portfolio.
8. `ASSIGNED_RECORD`: Specific assigned record for field workers.
