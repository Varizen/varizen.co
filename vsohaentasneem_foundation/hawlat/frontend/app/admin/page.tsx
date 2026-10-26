"use client";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useCallback, useEffect, useState } from "react";
import { api, explain, getToken } from "@/lib/api";

type Gate = { feature: string; status: string; required: string[]; satisfied: string[]; approvals: string[] };
type Unverified = { id: string; display_name: string };
type Appeal = { id: string; reason: string; event: { reason_code: string; delta: number } };
type Cfg = { version: number; values: Record<string, string | number> };

const NEXT: Record<string, string> = {
  PLANNED: "LEGAL_REVIEW", LEGAL_REVIEW: "PARTNER_REQUIRED", PARTNER_REQUIRED: "PARTNER_CONNECTED",
  PARTNER_CONNECTED: "COMPLIANCE_APPROVED", COMPLIANCE_APPROVED: "ENABLED",
};

export default function Admin() {
  const router = useRouter();
  const [gates, setGates] = useState<Gate[]>([]);
  const [people, setPeople] = useState<Unverified[]>([]);
  const [appeals, setAppeals] = useState<Appeal[]>([]);
  const [cfg, setCfg] = useState<Cfg | null>(null);
  const [edit, setEdit] = useState<Record<string, string>>({});
  const [msg, setMsg] = useState<{ kind: "err" | "ok"; text: string } | null>(null);

  const load = useCallback(async () => {
    try {
      const me = await api<{ role: string }>("/participants/me");
      if (me.role === "participant") { router.push("/dashboard"); return; }
      const [g, u, a, c] = await Promise.all([
        api<Gate[]>("/admin/gates"), api<Unverified[]>("/admin/participants/unverified"),
        api<Appeal[]>("/admin/reputation/appeals"), api<Cfg>("/admin/config"),
      ]);
      setGates(g); setPeople(u); setAppeals(a); setCfg(c);
    } catch (e) {
      if (!getToken()) router.push("/login"); else setMsg({ kind: "err", text: explain(e) });
    }
  }, [router]);
  useEffect(() => { load(); }, [load]);

  async function run(fn: () => Promise<unknown>, ok: string) {
    setMsg(null);
    try { await fn(); setMsg({ kind: "ok", text: ok }); await load(); }
    catch (e) { setMsg({ kind: "err", text: explain(e) }); }
  }

  return (
    <>
      <header className="top"><img src="/wordmark.png" alt="STFL" /><nav><Link href="/dashboard">Marketplace</Link></nav></header>
      <div className="notice">Compliance console. Every action here is recorded in the tamper-evident audit log.</div>
      <main>
        {msg && <p className={msg.kind === "err" ? "err" : "okmsg"} role={msg.kind === "err" ? "alert" : "status"}>{msg.text}</p>}

        <section className="card">
          <h2>Regulatory gates</h2>
          <p className="muted">All regulated capabilities are blocked until every requirement is satisfied and two different approvers enable them.</p>
          {gates.map((g) => (
            <div className="item" key={g.feature}>
              <strong>{g.feature}</strong> <span className={`badge ${g.status === "ENABLED" ? "good" : g.status === "SUSPENDED" ? "bad" : ""}`}>{g.status}</span>
              <p className="muted">Requires: {g.required.map((r) => `${g.satisfied.includes(r) ? "✓" : "✗"} ${r}`).join(", ")}
                {g.approvals.length > 0 && ` · approvals so far: ${g.approvals.length}/2`}</p>
              <div className="row">
                {g.required.filter((r) => !g.satisfied.includes(r)).map((r) => (
                  <button key={r} onClick={() => run(() => api(`/admin/gates/${g.feature}/satisfy`, { method: "POST", body: { requirement: r } }), `${r} recorded.`)}>Mark {r} satisfied</button>))}
                {NEXT[g.status] && (
                  <button className="solid" onClick={() => run(() => api(`/admin/gates/${g.feature}/advance`, { method: "POST", body: { to: NEXT[g.status] } }), `Moved toward ${NEXT[g.status]}.`)}>
                    {NEXT[g.status] === "ENABLED" ? "Approve enabling" : `Advance to ${NEXT[g.status]}`}</button>)}
                {g.status !== "SUSPENDED" && (
                  <button onClick={() => window.confirm(`Suspend ${g.feature} immediately?`) && run(() => api(`/admin/kill-switches/${g.feature}`, { method: "POST" }), "Suspended.")}>Kill switch</button>)}
              </div>
            </div>
          ))}
        </section>

        <div className="grid2">
          <section className="card">
            <h2>Pending verification</h2>
            {people.length === 0 && <p className="muted">None.</p>}
            {people.map((p) => (
              <div className="item" key={p.id}>{p.display_name}
                <div className="row"><button onClick={() => run(() => api(`/admin/participants/${p.id}/verify`, { method: "POST" }), "Participant verified.")}>Mark verified</button></div>
              </div>))}
          </section>
          <section className="card">
            <h2>Reputation appeals</h2>
            {appeals.length === 0 && <p className="muted">None open.</p>}
            {appeals.map((a) => (
              <div className="item" key={a.id}>
                <strong>{a.event.reason_code}</strong> ({a.event.delta > 0 ? "+" : ""}{a.event.delta})
                <p className="muted">{a.reason}</p>
                <div className="row">
                  <button className="solid" onClick={() => run(() => api(`/admin/reputation/appeals/${a.id}/decide`, { method: "POST", body: { uphold: true } }), "Appeal upheld; compensating event recorded.")}>Uphold</button>
                  <button onClick={() => run(() => api(`/admin/reputation/appeals/${a.id}/decide`, { method: "POST", body: { uphold: false } }), "Appeal rejected.")}>Reject</button>
                </div>
              </div>))}
          </section>
        </div>

        {cfg && (
          <section className="card">
            <h2>Platform configuration · version {cfg.version}</h2>
            <p className="muted">Changes create a new version; existing quotes and agreements keep the version they used.</p>
            <table><tbody>{Object.entries(cfg.values).map(([k, v]) => (
              <tr key={k}><td>{k}</td><td><input aria-label={k} value={edit[k] ?? String(v)} onChange={(e) => setEdit({ ...edit, [k]: e.target.value })} /></td></tr>))}</tbody></table>
            <div className="row"><button className="solid" disabled={Object.keys(edit).length === 0} onClick={() => {
              const values: Record<string, string | number> = {};
              for (const [k, v] of Object.entries(edit)) values[k] = typeof cfg.values[k] === "number" ? Number(v) : v;
              run(async () => { await api("/admin/config", { method: "POST", body: { values } }); setEdit({}); }, "New configuration version published.");
            }}>Publish changes</button></div>
          </section>
        )}

        <section className="card">
          <h2>Operations</h2>
          <div className="row">
            <button onClick={() => run(async () => { const r = await api<{ chain_valid: boolean }>("/admin/audit/verify"); if (!r.chain_valid) throw new Error("Audit chain broken"); }, "Audit chain is intact.")}>Verify audit chain</button>
            <button onClick={() => run(() => api("/admin/outbox/dispatch", { method: "POST" }), "Outbox dispatched.")}>Dispatch events</button>
          </div>
        </section>
      </main>
    </>
  );
}
