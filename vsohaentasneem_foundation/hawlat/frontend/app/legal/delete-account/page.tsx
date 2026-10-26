import Link from "next/link";
import { LegalShell } from "@/components/Legal";
import { SUPPORT_EMAIL } from "@/lib/config";

export default function DeleteAccountInfo() {
  return (
    <LegalShell title="Delete your HAWLAT account">
      <ol>
        <li><Link href="/login">Sign in</Link> to HAWLAT (web or app).</li>
        <li>Open the Dashboard and choose <strong>Delete account</strong> at the bottom of the page.</li>
        <li>Enter your password to confirm.</li>
      </ol>
      <p>Your name, email and profile are erased immediately and you are signed out everywhere. Open requests and offers are cancelled. If you have an unfinished transaction you must complete or resolve it first.</p>
      <p>Anonymised financial and audit records of past agreements are retained as required by law; they can no longer be linked to you.</p>
      <p>Cannot sign in? Email <a href={`mailto:${SUPPORT_EMAIL}`}>{SUPPORT_EMAIL}</a> from your registered address.</p>
    </LegalShell>
  );
}
