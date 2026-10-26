import Link from "next/link";

export default function Home() {
  return (
    <>
      <header className="top">
        <img src="/wordmark.png" alt="STFL" />
        <nav><Link href="/login">Sign in</Link></nav>
      </header>
      <section className="hero">
        <h1>Know who you are dealing with before you agree.</h1>
        <p>
          HAWLAT is a neutral marketplace where independent people and organisations find each other, compare
          transparent terms, agree, and keep a clear record of short-term financing between themselves.
        </p>
        <p className="muted">
          HAWLAT/STFL does not lend, borrow, take deposits, hold your money, or guarantee repayment. Every
          transaction is directly between the two parties. Availability depends on legal and regulatory approval.
        </p>
        <div className="row"><Link href="/login"><button className="primary">Get started</button></Link></div>
        <div className="grid2" style={{ marginTop: "2rem" }}>
          <div className="card"><h3>Identity &amp; reputation</h3><p className="muted">Verified participants, an explainable reputation you can appeal.</p></div>
          <div className="card"><h3>Transparent terms</h3><p className="muted">Every charge and fee shown before you sign. No hidden costs.</p></div>
          <div className="card"><h3>A trusted record</h3><p className="muted">An immutable audit trail of what both sides agreed.</p></div>
        </div>
      </section>
      <footer className="hero muted"><Link href="/legal/privacy">Privacy</Link> · <Link href="/legal/terms">Terms</Link> · <Link href="/legal/delete-account">Delete account</Link></footer>
    </>
  );
}
