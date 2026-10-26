import Link from "next/link";

export function LegalShell({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <>
      <header className="top">
        <img src="/wordmark.png" alt="STFL" />
        <nav><Link href="/login">Sign in</Link></nav>
      </header>
      <main style={{ maxWidth: 760 }}>
        <p className="err" role="note">
          Draft for review. This text must be approved by qualified legal counsel before public release or store submission.
        </p>
        <article className="card"><h1>{title}</h1>{children}</article>
        <nav className="muted">
          <Link href="/legal/privacy">Privacy</Link> · <Link href="/legal/terms">Terms</Link> ·{" "}
          <Link href="/legal/delete-account">Delete account</Link>
        </nav>
      </main>
    </>
  );
}
