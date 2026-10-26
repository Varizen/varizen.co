# HAWLAT — Google Play and Apple App Store Readiness

Status: **mobile projects generated, store submission NOT ready.** Policy text below is from memory of the guidelines; re-read the current Apple App Review Guidelines and Google Play Developer Policy (Financial Services) before submitting.

## 1. What exists
| Item | State |
|---|---|
| Capacitor 7 wrapper (`frontend/`, appId `com.stfl.hawlat`, name HAWLAT) | Done |
| Static mobile export (`npm run build:mobile`) | Built and synced |
| Android project (`frontend/android`, target/compile SDK 36, min 24, backups off) | Generated; **not compiled** (disk was full, see §5) |
| iOS project (`frontend/ios`) | Generated; needs a Mac with Xcode |
| Icons and splash from the STFL mark (navy background) | Generated; **placeholder quality**: the only mark file is 232×200 px, so supply a vector/1024 px master |
| Account deletion in app + public web page `/legal/delete-account/` + `DELETE /api/v1/participants/me` | Done, tested |
| Draft Privacy Policy and Terms (`/legal/privacy/`, `/legal/terms/`) | Draft only, **needs counsel** |
| CORS allow-list for native webviews (`HAWLAT_CORS_ORIGINS`) | Done |

## 2. Build
```
cd frontend
$env:NEXT_PUBLIC_API_URL="https://<production-api-host>"   # HTTPS only, cleartext is disabled
$env:NEXT_PUBLIC_SUPPORT_EMAIL="<real support email>"
npm run build:mobile            # next export + cap sync
npx cap open android            # Android Studio: Build > Generate Signed App Bundle (AAB)
npx cap open ios                # Xcode on macOS: Product > Archive > Distribute
```
Release signing: create the upload keystore yourself (`keytool -genkeypair -v -keystore hawlat-upload.jks -alias hawlat -keyalg RSA -keysize 4096 -validity 10000`), keep it and its passwords out of the repo, and enrol in Play App Signing. The bundle ID `com.stfl.hawlat` is permanent once published; change it in `capacitor.config.json` before the first upload if needed.

## 3. Blocking issues (must be resolved by people)
1. **Regulatory standing.** Both stores require licences/credentials for financial and lending apps. Apple (5.1.1 / lending rules) and Google (Financial Services declaration, personal-loan policy) expect proof that the operator or partner is authorised. This is the same `[LEGAL_REVIEW_REQUIRED]` gate as production enablement.
2. **Short-term lending rules.** As I recall them, Apple limits personal-loan apps to a maximum APR of 36% and forbids required repayment in 60 days or less; Google restricts short-term personal loans (≤60 days) in several regions. HAWLAT's design (1–50 weeks, up to 500 bps/week) can breach this. Config levers exist: set `MIN_TENOR` ≥ 9 weeks and `MAX_CHARGE_BPS_PER_WEEK` ≤ 69 (≈36% APR) for the store profile, or ship the store apps as read-only/record-only until counsel confirms. Disclose the equivalent APR in the terms screen if required.
3. **Not a custodian/lender positioning.** Keep the marketplace disclosure visible on every screen (already present). Store reviewers will check it matches the declarations.
4. **Apple 4.2 (minimum functionality).** A thin web wrapper can be rejected. Plan native value: secure storage of the session token (Keychain/Keystore via a Capacitor plugin instead of `sessionStorage`), push notifications, biometric unlock. These are not built.
5. **Apple Sign in / login rules.** Only email+password is offered, so Sign in with Apple is not required; adding Google/social login would trigger it.
6. **Real support email, privacy policy URL, terms URL, company/D-U-N-S details** (Apple requires an organisation account for financial apps; D-U-N-S number needed).
7. **Counsel-approved Privacy Policy and Terms** hosted at stable public HTTPS URLs.

## 4. Store listing inputs
- **Name:** HAWLAT · **Subtitle/short description:** "Know who you deal with. Agree and record short-term financing between people."
- **Category:** Finance. **Age rating:** 17+/Mature (financial content); no ads, no user-generated public content.
- **Do not claim:** loans from HAWLAT, guaranteed approval, instant cash, "get rich", bank/MFI status.
- **Required disclosure in description:** "HAWLAT/STFL is a technology marketplace. It does not lend, take deposits, hold funds or guarantee repayment."
- **Review notes (both stores):** supply a demo participant account and explain that regulated gates (matching, settlement) are disabled by default; give a staging environment with gates enabled and the mock payment adapter so reviewers can walk the full flow. Never give real credentials in the repo.

### Google Play Data safety (draft answers)
Collected: name, email, user IDs, in-app activity (requests, offers, agreements), purchase-like financial info (agreed amounts, repayment records), app diagnostics. Not collected: location, contacts, photos, SMS, device sensors. Shared with third parties: no (counterparty sees name/tier only). Encrypted in transit: yes (TLS). Deletion: yes, in-app and via web link. Not sold.

### Apple Privacy Nutrition Label (draft)
Contact info (name, email), User ID, Financial info (transaction records), Usage data, Diagnostics: all "linked to user, used for app functionality / security". No tracking, no ATT prompt needed.

## 5. Verification gaps
- Android Gradle build failed to start: the machine's C: drive had ~0.3 GB free and Gradle 8.14 could not unzip. Free ≥ 5 GB, then run `cd frontend/android; .\gradlew.bat assembleDebug` and `bundleRelease`.
- iOS cannot be built on Windows; use a Mac or a cloud build service.
- No device/emulator testing, accessibility audit, or screenshots yet. Stores need phone screenshots (and a 512×512 Play icon, 1024×1024 App Store icon, 1024×500 Play feature graphic).
