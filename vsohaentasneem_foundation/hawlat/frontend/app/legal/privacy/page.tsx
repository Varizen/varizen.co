import { LegalShell } from "@/components/Legal";
import { SUPPORT_EMAIL } from "@/lib/config";

export default function Privacy() {
  return (
    <LegalShell title="Privacy Policy">
      <p><strong>Who we are.</strong> HAWLAT is a technology marketplace operated by STFL. HAWLAT is not a lender, bank, payment institution or deposit-taker and is not a party to transactions between users.</p>
      <h2>Data we collect</h2>
      <ul>
        <li><strong>Account:</strong> name, email address, password (stored only as a salted Argon2id hash).</li>
        <li><strong>Marketplace activity:</strong> requests, offers, agreed terms, repayment records, disputes.</li>
        <li><strong>Reputation:</strong> events derived from your completed or defaulted transactions.</li>
        <li><strong>Verification:</strong> verification status and, when enabled, identity documents handled by an approved verification provider.</li>
        <li><strong>Technical:</strong> security and audit logs needed to protect the service.</li>
      </ul>
      <h2>How we use it</h2>
      <p>To operate the marketplace, show counterparties your name, verification badge and reputation tier, prevent fraud, meet legal duties and keep an accurate record of agreements. We do not sell personal data and do not show advertising. Your contact details are never shared with other users.</p>
      <h2>Sharing</h2>
      <p>With the counterparty to a transaction you agree to (limited to what the transaction needs), with service providers acting on our instructions, and with authorities where required by law.</p>
      <h2>Retention and deletion</h2>
      <p>You can delete your account in the app (Dashboard → Delete account) or via <a href="/legal/delete-account">this page</a>. Personal data is erased. Financial and audit records of agreements are kept in anonymised form for the period required by law.</p>
      <h2>Your rights and contact</h2>
      <p>Contact <a href={`mailto:${SUPPORT_EMAIL}`}>{SUPPORT_EMAIL}</a> to access, correct or delete your data.</p>
    </LegalShell>
  );
}
