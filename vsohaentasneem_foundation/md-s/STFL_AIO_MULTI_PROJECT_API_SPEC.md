# STFL AIO — Multi-Project API Interface Specification
**Document Identity:** `STFL-DOC-2026-MP-API-V1`  
**Phase:** Prompt 12.5 (Multi-Project Architecture & Feature Control Map)  
**Status:** SPECIFICATION ONLY — RATIFIED (READ-ONLY ARCHITECTURE PHASE)  
**Security Classification:** INTERNAL ENTERPRISE SPECIFICATION  
**Authoritative Precedent:** Extends `STFL_API_CONTRACT.md`

---

## 1. Global Multi-Project API Directives

All multi-project endpoints adhere to the standard STFL Hono REST conventions under the canonical base:

`https://stflbd.app/api/v1`

> [!WARNING]
> **SPECIFICATION DIRECTIVE**  
> This document specifies the future API routes, request/response schemas, and header contracts. It **must not be implemented** during Prompt 12.5.

### Mandatory Request Headers:
- `Authorization: Bearer <Contextual_JWT>` — Cryptographically verified access token.
- `X-Project-Context: <project_id>` — Declares active project context (e.g. `STFL-PRJ-2026-0001`). Must match the claims inside the verified JWT unless caller holds `ORGANIZATION_WIDE` scope.
- `X-Device-Fingerprint: <device_id>` — Hardware device identifier (e.g. `STFL-DVC-8F31A2`). Mandatory for non-public operational endpoints.
- `Content-Type: application/json`

---

## 2. Core Project Management Endpoints

### 2.1 List Projects
- **Route:** `GET /api/v1/projects`
- **Access Authority:** Authenticated users. Returns only projects where the caller holds active membership, OR all projects if the caller holds `CLASS_01` (Trustee) or `CLASS_02` (Executive).
- **Query Parameters:** `type`, `status`, `portfolioId`, `limit`, `offset`
- **Response `200 OK`:**
  ```json
  {
    "success": true,
    "projects": [
      {
        "projectId": "STFL-PRJ-2026-0001",
        "projectCode": "AGRO_TECH_01",
        "nameEn": "Agro-Tech Social Enterprise",
        "nameBn": "এগ্রো-টেক সোশ্যাল এন্টারপ্রাইজ",
        "projectType": "SOCIAL_ENTERPRISE",
        "lifecycleState": "ACTIVE",
        "startDate": "2026-01-01",
        "endDate": "2028-12-31",
        "callerRole": "PROJECT_DIRECTOR"
      }
    ],
    "total": 1
  }
  ```

### 2.2 Instantiate Project via Factory
- **Route:** `POST /api/v1/projects/factory`
- **Access Authority:** Restricted to `CLASS_01` (Trustee) or `CLASS_02` (Executive). Requires Level 4 authority.
- **Payload:** Project Creation Factory Manifest (as specified in `STFL_AIO_PROJECT_FACTORY_SPECIFICATION.md`).
- **Response `201 Created`:**
  ```json
  {
    "success": true,
    "projectId": "STFL-PRJ-2026-0005",
    "projectCode": "AGRO_DAIRY_02",
    "lifecycleState": "PLANNING",
    "createdAt": "2026-10-15T14:30:00Z"
  }
  ```

### 2.3 Transition Project Lifecycle
- **Route:** `POST /api/v1/projects/:projectId/lifecycle`
- **Access Authority:** Evaluated dynamically via the Lifecycle Transition Matrix (e.g. `T-02` requires Trustee approval).
- **Payload:**
  ```json
  {
    "targetState": "APPROVED",
    "transitionCode": "T-02",
    "reason": "Board of Trustees Resolution #2026-14 ratified",
    "governanceDocId": "STFL-LET-2026-000412"
  }
  ```
- **Response `200 OK`:**
  ```json
  {
    "success": true,
    "projectId": "STFL-PRJ-2026-0005",
    "previousState": "PLANNING",
    "currentState": "APPROVED",
    "transitionedAt": "2026-10-15T14:35:00Z"
  }
  ```

---

## 3. Project Membership & Stakeholder Endpoints

### 3.1 List & Assign Project Members
- **Route:** `GET /api/v1/projects/:projectId/members`
- **Route:** `POST /api/v1/projects/:projectId/members`
- **Access Authority:** Project Director (`CLASS_02`), Project Admin (`CLASS_04`), or HR Lead (`CLASS_06`).
- **Assignment Payload:**
  ```json
  {
    "partyId": "STFL-PER-000088",
    "roleCode": "FIELD_AGRONOMIST",
    "membershipType": "DIRECT_HIRE",
    "startDate": "2026-11-01",
    "endDate": "2027-10-31"
  }
  ```

### 3.2 List & Register External Stakeholders
- **Route:** `GET /api/v1/projects/:projectId/stakeholders`
- **Route:** `POST /api/v1/projects/:projectId/stakeholders`
- **Access Authority:** Project Director or Executive Directorate.

---

## 4. Project Finance & Sub-Ledger Endpoints

### 4.1 Get Project Financial Summary
- **Route:** `GET /api/v1/projects/:projectId/finance/summary`
- **Access Authority:** Project Finance Officer (`CLASS_03`), Project Director (`CLASS_02`), or Central Audit (`CLASS_08`).
- **Response `200 OK`:**
  ```json
  {
    "success": true,
    "projectId": "STFL-PRJ-2026-0001",
    "currency": "BDT",
    "budgetLimit": "1500000.00",
    "totalDisbursed": "342500.00",
    "committedPayables": "45000.00",
    "remainingBudget": "1112500.00",
    "restrictedFundType": "COMMERCIAL_EQUITY"
  }
  ```

### 4.2 Create Project Voucher
- **Route:** `POST /api/v1/projects/:projectId/finance/vouchers`
- **Payload:**
  ```json
  {
    "voucherType": "PAYMENT",
    "voucherDate": "2026-10-15",
    "totalAmount": "25000.00",
    "payeePartyId": "STFL-CMP-000012",
    "description": "Organic Seed Procurement Batch #4",
    "entries": [
      { "accountCode": "51100", "description": "Seed Inventory Expense", "debit": "25000.00", "credit": "0.00" },
      { "accountCode": "11110", "description": "Islami Bank Operating A/C", "debit": "0.00", "credit": "25000.00" }
    ]
  }
  ```

### 4.3 Approve & Disburse Voucher (Enforcing Anti-Collusion SoD)
- **Route:** `POST /api/v1/projects/:projectId/finance/vouchers/:voucherId/approve`
- **Route:** `POST /api/v1/projects/:projectId/finance/vouchers/:voucherId/disburse`
- **Security Check:** Evaluates `creator_id != approver_id` and `approver_id != disburser_id`. Rejects with `403 Forbidden` if violated.

---

## 5. Project Agent Sandbox Endpoints

### 5.1 List Active Project Agents
- **Route:** `GET /api/v1/projects/:projectId/agents`
- **Response `200 OK`:**
  ```json
  {
    "success": true,
    "agents": [
      {
        "agentId": "STFL-AGT-AGRO-001",
        "agentName": "Agro Supply Chain Agent",
        "status": "ACTIVE",
        "dailyTokenLimit": 500000,
        "maxAuthorityLevel": 3,
        "minConfidenceFloor": "0.9800",
        "killSwitchActive": false
      }
    ]
  }
  ```

### 5.2 Trigger Emergency Project Agent Kill Switch
- **Route:** `POST /api/v1/projects/:projectId/agents/:agentId/kill`
- **Access Authority:** Project Director (`CLASS_02`) or Central Security Officer (`CLASS_08`).
- **Response `200 OK`:**
  ```json
  {
    "success": true,
    "agentId": "STFL-AGT-AGRO-001",
    "status": "TERMINATED",
    "killedAt": "2026-10-15T14:40:12Z",
    "latencyMs": 14
  }
  ```
