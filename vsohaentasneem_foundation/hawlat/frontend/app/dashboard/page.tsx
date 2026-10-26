"use client";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useCallback, useEffect, useState } from "react";
import { api, explain, getToken, setToken, taka } from "@/lib/api";

type Passport = {
  reputation: { score: number; tier: string; completed_count: number; marketplace_privileges: string; note: string };
  net_obligation_balance: string; statement_type: string;
};
type Req = { id: string; amount: string; tenor_weeks: number; purpose: string; state: string };
type Offer = { id: string; min_amount: string; max_amount: string; max_tenor_weeks: number; charge_bps_per_week: number; state: string };
type Counterparty = { display_name: string; verified: boolean; tier: string; completed_count: number };
type Match = { match_id: string; counterparty: Counterparty; charge_bps_per_week?: number; amount?: string; tenor_weeks?: number; purpose?: string };
type Quote = {
  id: string; principal: string; tenor_weeks: number; party_charge: string; platform_fee: string;
  total_due_to_funder: string; schedule: { week: number; due: string }[]; terms_hash: string; notice: string;
};
type Tx = { id: string; state: string; principal: string; total_due: string; repaid: string; platform_fee: string; my_role: string };
type Step = { previous_state: string; new_state: string; actor: string; reason: string; at: string };
type Note = { id: string; body: string };

export default function Dashboard() {
  const router = useRouter();
  const [passport, setPassport] = useState<Passport | null>(null);
  const [name, setName] = useState("");
  const [reqs, setReqs] = useState<Req[]>([]);
  const [offers, setOffers] = useState<Offer[]>([]);
  const [txs, setTxs] = useState<Tx[]>([]);
  const [notes, setNotes] = useState<Note[]>([]);
  const [matches, setMatches] = useState<Record<string, Match[]>>({});
  const [quote, setQuote] = useState<Quote | null>(null);
  const [timeline, setTimeline] = useState<Record<string, Step[]>>({});
  const [msg, setMsg] = useState<{ kind: "err" | "ok"; text: string } | null>(null);

  const [amount, setAmount] = useState("1000");
  const [tenor, setTenor] = useState("10");
  const [purpose, setPurpose] = useState("");
  const [oMin, setOMin] = useState("100");
  const [oMax, setOMax] = useState("5000");
  const [oTenor, setOTenor] = useState("20");
  const [oBps, setOBps] = useState("50");
  const [repay, setRepay] = useState<Record<string, string>>({});

  const load = useCallback(async () => {
    try {
      const [me, pp, rq, of, tx, nt] = await Promise.all([
        api<{ display_name: string }>("/participants/me"), api<Passport>("/passport/me"), api<Req[]>("/requests"),
        api<Offer[]>("/offers"), api<Tx[]>("/transactions"), api<Note[]>("/notifications"),
      ]);
      setName(me.display_name); setPassport(pp); setReqs(rq); setOffers(of); setTxs(tx); setNotes(nt);
    } catch (e) {
      if (!getToken() || (e as { status?: number }).status === 401) { router.push("/login"); return; }
      setMsg({ kind: "err", text: explain(e) });
    }
  }, [router]);

  useEffect(() => { load(); }, [load]);

  async function run(fn: () => Promise<unknown>, ok?: string) {
    setMsg(null);
    try { await fn(); if (ok) setMsg({ kind: "ok", text: ok }); await load(); }
    catch (e) { setMsg({ kind: "err", text: explain(e) }); }
  }

  const findMatches = (kind: "requests" | "offers", id: string) =>
    run(async () => { setMatches((m) => ({ ...m, [id]: [] })); const r = await api<Match[]>(`/${kind}/${id}/matches`); setMatches((m) => ({ ...m, [id]: r })); });

  const getQuote = (matchId: string) =>
    run(async () => setQuote(await api<Quote>(`/matches/${matchId}/quotes`, { method: "POST" })));

  const [delPw, setDelPw] = useState("");
  const deleteAccount = () => {
    if (!window.confirm("Permanently delete your account? This cannot be undone.")) return;
    run(async () => { await api("/participants/me", { method: "DELETE", body: { password: delPw } }); setToken(null); router.push("/"); });
  };

  const signOut = () => { setToken(null); router.push("/login"); };

  return (
    <>
      <header className="top">
        <img src="/wordmark.png" alt="STFL" />
        <div>{name}<button className="link" onClick={signOut}>Sign out</button></div>
      </header>
      <div className="notice">
        HAWLAT is a neutral technology marketplace. It is not a party to any transaction, does not provide financing, and does not hold your money.
      </div>
      <main>
        {msg && <p className={msg.kind === "err" ? "err" : "okmsg"} role={msg.kind === "err" ? "alert" : "status"}>{msg.text}</p>}

        {passport && (
          <section className="card" aria-label="Financial passport">
            <h2>Financial Passport</h2>
            <div className="grid2">
              <div><div className="stat">{passport.reputation.score}</div><span className="badge gold">{passport.reputation.tier}</span>
                <p className="muted">{passport.reputation.completed_count} completed · {passport.reputation.marketplace_privileges.toLowerCase()} privileges</p></div>
              <div><div className="stat">{taka(passport.net_obligation_balance)}</div>
                <p className="muted">Net amount you owe on record. {passport.statement_type}.</p></div>
            </div>
            <p className="muted">{passport.reputation.note}</p>
          </section>
        )}

        <div className="grid2">
          <form className="card" onSubmit={(e) => { e.preventDefault(); run(() => api("/requests", { method: "POST", body: { amount, tenor_weeks: Number(tenor), purpose } }), "Request published."); }}>
            <h2>I need financing</h2>
            <label htmlFor="a">Amount (BDT)</label><input id="a" inputMode="decimal" value={amount} onChange={(e) => setAmount(e.target.value)} required />
            <label htmlFor="t">Weeks</label><input id="t" type="number" min={1} max={50} value={tenor} onChange={(e) => setTenor(e.target.value)} required />
            <label htmlFor="pu">Purpose</label><input id="pu" value={purpose} onChange={(e) => setPurpose(e.target.value)} maxLength={200} />
            <div className="row"><button className="primary">Publish request</button></div>
          </form>
          <form className="card" onSubmit={(e) => { e.preventDefault(); run(() => api("/offers", { method: "POST", body: { min_amount: oMin, max_amount: oMax, max_tenor_weeks: Number(oTenor), charge_bps_per_week: Number(oBps) } }), "Offer published."); }}>
            <h2>I can offer financing</h2>
            <label htmlFor="mn">Minimum (BDT)</label><input id="mn" inputMode="decimal" value={oMin} onChange={(e) => setOMin(e.target.value)} required />
            <label htmlFor="mx">Maximum (BDT)</label><input id="mx" inputMode="decimal" value={oMax} onChange={(e) => setOMax(e.target.value)} required />
            <label htmlFor="ot">Longest term (weeks)</label><input id="ot" type="number" min={1} max={50} value={oTenor} onChange={(e) => setOTenor(e.target.value)} required />
            <label htmlFor="ob">Charge per week (basis points; 50 = 0.50%)</label><input id="ob" type="number" min={0} value={oBps} onChange={(e) => setOBps(e.target.value)} required />
            <div className="row"><button className="solid">Publish offer</button></div>
          </form>
        </div>

        <section className="card">
          <h2>My requests and offers</h2>
          {reqs.length + offers.length === 0 && <p className="muted">Nothing published yet.</p>}
          {reqs.map((r) => (
            <div className="item" key={r.id}>
              <strong>Request {taka(r.amount)}</strong> · {r.tenor_weeks} weeks <span className="badge">{r.state}</span> <span className="muted">{r.purpose}</span>
              <div className="row"><button onClick={() => findMatches("requests", r.id)}>Find funders</button></div>
              <MatchList list={matches[r.id]} label="Funder" onQuote={getQuote} />
            </div>
          ))}
          {offers.map((o) => (
            <div className="item" key={o.id}>
              <strong>Offer {taka(o.min_amount)}–{taka(o.max_amount)}</strong> · up to {o.max_tenor_weeks} weeks · {(o.charge_bps_per_week / 100).toFixed(2)}%/week <span className="badge">{o.state}</span>
              <div className="row"><button onClick={() => findMatches("offers", o.id)}>Find requests</button></div>
              <MatchList list={matches[o.id]} label="Requester" onQuote={getQuote} />
            </div>
          ))}
        </section>

        {quote && (
          <section className="card" aria-label="Quote">
            <h2>Terms for review</h2>
            <table><tbody>
              <tr><td>Amount</td><td>{taka(quote.principal)}</td></tr>
              <tr><td>Agreed charge between the two parties</td><td>{taka(quote.party_charge)}</td></tr>
              <tr><td>Total payable to the funder ({quote.tenor_weeks} weekly instalments)</td><td><strong>{taka(quote.total_due_to_funder)}</strong></td></tr>
              <tr><td>Separate HAWLAT platform service fee</td><td>{taka(quote.platform_fee)}</td></tr>
            </tbody></table>
            <p className="muted">{quote.notice} Terms fingerprint: {quote.terms_hash.slice(0, 12)}…</p>
            <div className="row">
              <button className="primary" onClick={() => run(async () => { const r = await api<{ state: string }>(`/quotes/${quote.id}/accept`, { method: "POST" }); setQuote(null); setMsg({ kind: "ok", text: r.state === "AGREED" ? "Both parties signed. Agreement recorded." : "You signed. Waiting for the other party." }); })}>Accept and sign</button>
              <button onClick={() => setQuote(null)}>Dismiss</button>
            </div>
          </section>
        )}

        <section className="card">
          <h2>Transactions</h2>
          {txs.length === 0 && <p className="muted">No transactions yet.</p>}
          {txs.map((t) => (
            <div className="item" key={t.id}>
              <strong>{taka(t.principal)}</strong> as <span className="badge">{t.my_role}</span> <span className={`badge ${t.state === "COMPLETED" ? "good" : t.state === "DISPUTED" || t.state === "DEFAULTED" ? "bad" : ""}`}>{t.state}</span>
              <p className="muted">Repaid {taka(t.repaid)} of {taka(t.total_due)} · platform fee {taka(t.platform_fee)} (separate)</p>
              <div className="row">
                {t.my_role === "FUNDER" && t.state === "AGREED" && (
                  <button className="primary" onClick={() => run(() => api(`/transactions/${t.id}/settle`, { method: "POST" }), "Settlement recorded (simulation only, no real money moved).")}>Confirm disbursement</button>)}
                {t.my_role === "FUNDER" && (t.state === "ACTIVE" || t.state === "PARTIALLY_REPAID") && (<>
                  <input aria-label="Repayment amount" style={{ width: 140 }} inputMode="decimal" placeholder="Amount received" value={repay[t.id] ?? ""} onChange={(e) => setRepay({ ...repay, [t.id]: e.target.value })} />
                  <button onClick={() => run(() => api(`/transactions/${t.id}/repayments`, { method: "POST", body: { amount: repay[t.id] } }), "Repayment recorded.")}>Record repayment</button></>)}
                {["AGREED", "ACTIVE", "PARTIALLY_REPAID"].includes(t.state) && (
                  <button onClick={() => { const reason = window.prompt("Describe the issue"); if (reason) run(() => api("/disputes", { method: "POST", body: { transaction_id: t.id, reason } }), "Dispute opened."); }}>Open dispute</button>)}
                <button onClick={() => run(async () => { const r = await api<Step[]>(`/transactions/${t.id}/timeline`); setTimeline((m) => ({ ...m, [t.id]: r })); })}>History</button>
              </div>
              {timeline[t.id] && (
                <table><tbody>{timeline[t.id].map((s, i) => (
                  <tr key={i}><td>{new Date(s.at).toLocaleString()}</td><td>{s.previous_state} → {s.new_state}</td><td className="muted">{s.reason}</td></tr>))}</tbody></table>)}
            </div>
          ))}
        </section>

        <section className="card" aria-label="Delete account">
          <h2>Delete account</h2>
          <p className="muted">Erases your personal data and signs you out. Anonymised financial records are retained as required by law.</p>
          <label htmlFor="dp">Confirm password</label>
          <input id="dp" type="password" autoComplete="current-password" value={delPw} onChange={(e) => setDelPw(e.target.value)} />
          <div className="row"><button disabled={!delPw} onClick={deleteAccount}>Delete my account</button></div>
        </section>

        <nav className="muted"><Link href="/legal/privacy">Privacy</Link> · <Link href="/legal/terms">Terms</Link></nav>

        {notes.length > 0 && (
          <section className="card"><h2>Notifications</h2>{notes.map((n) => <p key={n.id} className="muted">{n.body}</p>)}</section>
        )}
      </main>
    </>
  );
}

function MatchList({ list, label, onQuote }: { list?: Match[]; label: string; onQuote: (id: string) => void }) {
  if (!list) return null;
  if (list.length === 0) return <p className="muted">No compatible matches yet.</p>;
  return (
    <table><tbody>{list.map((m) => (
      <tr key={m.match_id}>
        <td>{label}: {m.counterparty.display_name} {m.counterparty.verified && <span className="badge good">Verified</span>} <span className="badge gold">{m.counterparty.tier}</span></td>
        <td>{m.charge_bps_per_week !== undefined ? `${(m.charge_bps_per_week / 100).toFixed(2)}%/week` : `${taka(m.amount ?? 0)} · ${m.tenor_weeks} wks`}</td>
        <td><button onClick={() => onQuote(m.match_id)}>View terms</button></td>
      </tr>))}</tbody></table>
  );
}
