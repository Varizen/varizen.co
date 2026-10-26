# STFL VI — Secret & Sensitive Credential Location Register
**Platform Name:** STFL VI  
**Institution:** SohaelTasneem Foundation (সোহেল তাসনীম ফাউন্ডেশন)  
**Security Policy:** Strict Zero-Secret-Disclosure Standard. Zero actual secrets, passwords, or tokens documented.  
**Date:** 2026-10-16  
**Status:** AUDITED & SANITIZED  

---

## 1. Compliance & Security Classification Notice

> [!CAUTION]
> **STRICT SECURITY INVARIANT:**  
> This register documents the **existence**, **storage location**, **operational owner**, **environment**, and **rotation lifecycle** of platform secrets. Under no circumstances are raw values, passwords, private keys, or API tokens committed to this file or repository tracking.

---

## 2. Institutional Secret Inventory & Lifecycle Register

| Secret Type / Identifier | Storage Location / Mechanism | Value Handling | Operational Owner | Environment | Rotation Cadence | Verified Status |
|---|---|---|---|---|---|---|
| **Cloudflare Workers API Token** | Cloudflare Dashboard Secret Store (`wrangler secret`) | `NOT DOCUMENTED` (Encrypted at rest) | Infrastructure / DevSecOps | Production (`stflbd.app`) | 90 Days | Configured on Cloudflare Edge |
| **Cloudflare R2 Access Key ID** | Cloudflare Workers Environment Binding (`R2_ACCESS_KEY_ID`) | `NOT DOCUMENTED` (Worker binding) | Infrastructure / DevSecOps | Production (`stflbd.app`) | 180 Days | Bound in production environment |
| **Cloudflare R2 Secret Access Key** | Cloudflare Workers Encrypted Binding (`R2_SECRET_ACCESS_KEY`) | `NOT DOCUMENTED` (Encrypted at rest) | Infrastructure / DevSecOps | Production (`stflbd.app`) | 180 Days | Bound in production environment |
| **PostgreSQL Ledger Database URL** | Production Secret Manager (`DATABASE_URL`) | `NOT DOCUMENTED` (SSL forced) | Data / Ledger Architecture | Production | 90 Days | Configured via TLS 1.3 socket |
| **PostgreSQL Read-Replica Credential** | Production Secret Manager (`DATABASE_READ_URL`) | `NOT DOCUMENTED` (SSL forced) | Data / Ledger Architecture | Production | 90 Days | Configured via TLS 1.3 socket |
| **JWT Session Signing Key (HS256/RS256)**| Cloudflare Workers Key Vault (`JWT_SECRET`) | `NOT DOCUMENTED` (High entropy) | IAM / Core Security | Production | 60 Days | Configured on Cloudflare Edge |
| **Controlled Print HMAC Signing Key** | Worker Secure Context (`PRINT_HMAC_SECRET`) | `NOT DOCUMENTED` (SHA-256 HMAC) | Document Engine Architect | Production | 90 Days | Internal worker memory only |
| **SMS Gateway API Key (Bangladesh Telco)**| Cloudflare Workers Secret Store (`SMS_GATEWAY_KEY`)| `NOT DOCUMENTED` | Communications Gateway | Production | 180 Days | Configured via Provider Dashboard |
| **Android Play Store Upload Keystore** | Secure Offline Hardware Key / CI Vault (`stfl-release.keystore`) | `NOT DOCUMENTED` (Password protected) | Release Engineer / Mobile Lead | Release Build Pipeline | Annual / Cert Expiry | Keystore properties in `.gitignore` |
| **Android Keystore Password** | Environment Variable (`KEYSTORE_PASSWORD`) in Secure Runner | `NOT DOCUMENTED` | Release Engineer | Release Build Pipeline | Annual | Never committed to git |
| **Android Key Alias & Password** | Environment Variable (`KEY_ALIAS_PASSWORD`) in Secure Runner | `NOT DOCUMENTED` | Release Engineer | Release Build Pipeline | Annual | Never committed to git |
| **Development Test Harness Tokens** | Local Sandbox Harness (`main/api/test/harness.ts`) | Isolated static mock tokens (`dev-mock-token-01`) | QA / Test Harness | Development / Local Test Only | Non-Production | Verified: Zero production access |

---

## 3. Secret Rotation Protocols

1. **Edge Worker Secrets (Cloudflare):**
   - Execute secret rotation using Cloudflare CLI: `npx wrangler secret put <SECRET_NAME>`.
   - Never write secret strings to `wrangler.toml` or version control.
2. **Database Credentials (PostgreSQL):**
   - Provision new database user with identical role grants.
   - Update `DATABASE_URL` in Workers environment.
   - Terminate active sessions for deprecated database user after 15-minute grace period.
3. **Android Release Keys:**
   - Keystores are protected under FIPS 140-2 Level 2 hardware or isolated build agent secret vaults.
   - Keystore files (`*.keystore`, `*.jks`, `keystore.properties`) are strictly excluded in `.gitignore`.

---

## 4. Repository Scan Verification Evidence

- **Files Scanned for Leaked Secrets:** **610 files** across `main/web`, `main/api`, `main/app`, `main/core`, `main/security`, `scripts/`, `migrations/`.
- **Verified Findings:**
  - Zero AWS access keys found (`AKIA...`).
  - Zero private RSA/EC keys found (`BEGIN [RSA/EC/PRIVATE] KEY` headers).
  - Zero live database connection strings with production passwords found.
  - Zero third-party payment/telephony live API tokens found.
- **Repository Secret Audit Status:** **CLEAN / ZERO EXPOSURES**.
