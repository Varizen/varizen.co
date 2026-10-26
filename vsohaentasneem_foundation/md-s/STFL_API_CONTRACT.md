# STFL AIO — Canonical API Contract Specification

**System:** SohaelTasneem Foundation (STFL) Autonomous Enterprise Platform  
**Document Identity:** `STFL-DOC-2026-API-V1`  
**Date:** 2026-10-15  
**Canonical Base URL:** `https://stflbd.app/api/v1`  
**Status:** SPECIFICATION — RATIFIED (PHASE 0)  
**Security Level:** INTERNAL USE ONLY

---

## 1. Global API Standards & Envelope

All API endpoints follow the established STFL response envelope pattern:

### 1.1 Success Response Envelope
```json
{
  "success": true,
  "data": { ... },
  "error": null,
  "meta": {
    "requestId": "9b1deb4d-3b7d-4bad-9bdd-2b0d7b3dcb6d",
    "timestamp": "2026-10-15T07:42:19Z"
  }
}
```

### 1.2 Error Response Envelope
```json
{
  "success": false,
  "data": null,
  "error": {
    "code": "insufficient_permission",
    "message": "Action requires Level 4 Human Approval",
    "details": { "ticketId": "STFL-APP-2026-000492" }
  },
  "meta": {
    "requestId": "9b1deb4d-3b7d-4bad-9bdd-2b0d7b3dcb6d",
    "timestamp": "2026-10-15T07:42:19Z"
  }
}
```

---

## 2. Master Endpoint Catalogue

### 2.1 Parties & Relationship Engine

#### `POST /api/v1/parties`
* **Method**: `POST`
* **Authorization**: Bearer JWT (Class 00, 02, 03, 08, 09)
* **RBAC Permission**: `party.create`
* **Audit Event**: `party.create`
* **Idempotency**: Supported via `Idempotency-Key` header
* **Cache Policy**: `no-store`
* **Request**:
  ```json
  {
    "partyType": "PERSON",
    "legalNameBn": "মোঃ রফিকুল ইসলাম",
    "legalNameEn": "Md. Rafiqul Islam",
    "nationalId": "1982736451",
    "primaryPhone": "+8801711000000",
    "primaryEmail": "rafiq@example.com",
    "address": { "district": "Dhaka", "thana": "Mirpur", "addressLine": "House 12, Road 4" }
  }
  ```
* **Response (201 Created)**: Returns Party entity with assigned `party_id` (e.g. `STFL-PER-000021`).

#### `POST /api/v1/relationships`
* **Method**: `POST`
* **Authorization**: Bearer JWT (Class 00, 02, 03, 04, 08)
* **RBAC Permission**: `relationship.create`
* **Audit Event**: `relationship.create`
* **Cache Policy**: `no-store`
* **Request**:
  ```json
  {
    "partyAId": "c4b3... (UUID)",
    "partyBId": "e8f1... (UUID)",
    "relationshipType": "BORROWER",
    "resourceType": "microfinance_loan",
    "resourceId": "STFL-LON-2026-000089",
    "startAt": "2026-10-15T00:00:00Z",
    "endAt": "2027-10-14T23:59:59Z",
    "sourceDocumentId": "STFL-DOC-2026-000012-K7M2"
  }
  ```
* **Response (201 Created)**: Returns Relationship entity with assigned `relationship_id` (`STFL-REL-2026-000492`).

---

### 2.2 Property, First-Class Leases & Occupancy

#### `POST /api/v1/leases`
* **Method**: `POST`
* **Authorization**: Bearer JWT (Class 03, 04 in Property Unit)
* **RBAC Permission**: `lease.create`
* **Audit Event**: `lease.create`
* **Cache Policy**: `no-store`
* **Request**:
  ```json
  {
    "unitId": "uuid-unit-4a",
    "lessorPartyId": "uuid-stfl-foundation",
    "lesseePartyId": "uuid-merchant-corp",
    "tenancyClass": "COMMERCIAL",
    "occupancyType": "CORPORATE",
    "propertyUseClause": "Boutique textile retail and craft showroom",
    "startDate": "2026-11-01",
    "endDate": "2028-10-31",
    "rentAmount": 45000.00,
    "securityDeposit": 135000.00,
    "paymentCycle": "MONTHLY",
    "dueDayOfMonth": 5
  }
  ```
* **Response (201 Created)**: Returns staged Lease in `PENDING` state with assigned `lease_code` (`STFL-LSE-2026-000001-X8P4`).

#### `POST /api/v1/occupancies`
* **Method**: `POST`
* **Authorization**: Bearer JWT (Property Unit Officers)
* **RBAC Permission**: `occupancy.register`
* **Audit Event**: `occupancy.register`
* **Request**: Registers physical occupants (`occupancy_role: PRIMARY_TENANT | CO_TENANT | AUTHORIZED_OCCUPANT`).

---

### 2.3 Identity, Scopes & Approval Engine

#### `POST /api/v1/iam/scopes/assign`
* **Method**: `POST`
* **Authorization**: Bearer JWT (Class 00 Super Admin, Class 07 Security)
* **RBAC Permission**: `user.scope.manage`
* **Audit Event**: `user.scope.assign`
* **Request**:
  ```json
  {
    "userId": "uuid-user",
    "scopeCode": "SCP-REG-DHK-NORTH-01",
    "roleId": 3,
    "validUntil": "2026-12-31T23:59:59Z"
  }
  ```

#### `POST /api/v1/approvals/:ticketId/decide`
* **Method**: `POST`
* **Authorization**: Bearer JWT (Class 01, 02, 03 Approver)
* **RBAC Permission**: `approval.decide`
* **Audit Event**: `approval.decision`
* **Anti-Collusion**: Server verifies caller $\ne$ ticket initiator.
* **Request**:
  ```json
  {
    "decision": "APPROVE",
    "comments": "Verified bank statement and board resolution. Approved."
  }
  ```

---

### 2.4 Controlled Printing & Forensic Export

#### `POST /api/v1/documents/print/request`
* **Method**: `POST`
* **Authorization**: Bearer JWT with active attested device
* **RBAC Permission**: `document.print`
* **Audit Event**: `document.print.request`
* **Request**: `{ "documentUuid": "uuid-doc", "reason": "Audit filing" }`
* **Response (200 OK)**:
  ```json
  {
    "printToken": "otpt_8f31a2...256bit",
    "copyId": "CP-000004",
    "expiresInSeconds": 60,
    "watermarkProfile": "CONFIDENTIAL_DIAGONAL"
  }
  ```

#### `POST /api/v1/documents/print/render`
* **Method**: `POST`
* **Authorization**: Single-use `printToken`
* **Audit Event**: `document.print.executed`
* **Response**: Binary watermarked raster PDF stream (`Content-Type: application/pdf`).

---

### 2.5 Public Digital Document Verification

#### `GET /api/v1/verify/:documentId` (Public - No Auth Required)
* **Method**: `GET`
* **Rate Limit**: 60 requests / minute / IP
* **Cache Policy**: `public, max-age=300, stale-while-revalidate=600`
* **Response (200 OK)**:
  ```json
  {
    "success": true,
    "data": {
      "verificationStatus": "VERIFIED_AUTHENTIC",
      "organization": "SohaelTasneem Foundation",
      "documentId": "STFL-CER-2026-000002-K7M2",
      "documentType": "Digital Certificate",
      "title": "Vocational Training Completion",
      "issuedDate": "2026-10-15",
      "status": "ACTIVE",
      "integrityHash": "e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855"
    }
  }
  ```
