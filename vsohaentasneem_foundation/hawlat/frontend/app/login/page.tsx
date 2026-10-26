"use client";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { api, explain, setToken } from "@/lib/api";

export default function Login() {
  const router = useRouter();
  const [mode, setMode] = useState<"login" | "register">("login");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setBusy(true);
    setError("");
    try {
      if (mode === "register") await api("/auth/register", { method: "POST", body: { email, password, display_name: name } });
      const t = await api<{ access_token: string }>("/auth/login", { method: "POST", body: { email, password } });
      setToken(t.access_token);
      const me = await api<{ role: string }>("/participants/me");
      router.push(me.role === "participant" ? "/dashboard" : "/admin");
    } catch (err) {
      setError(explain(err));
    } finally {
      setBusy(false);
    }
  }

  return (
    <main style={{ maxWidth: 440 }}>
      <img src="/mark.png" alt="STFL" height={48} style={{ width: "auto" }} />
      <form className="card" onSubmit={submit}>
        <h1>{mode === "login" ? "Sign in" : "Create account"}</h1>
        {mode === "register" && (<><label htmlFor="n">Name</label><input id="n" value={name} onChange={(e) => setName(e.target.value)} required /></>)}
        <label htmlFor="e">Email</label>
        <input id="e" type="email" autoComplete="email" value={email} onChange={(e) => setEmail(e.target.value)} required />
        <label htmlFor="p">Password (10+ characters)</label>
        <input id="p" type="password" autoComplete={mode === "login" ? "current-password" : "new-password"} minLength={10}
          value={password} onChange={(e) => setPassword(e.target.value)} required />
        {error && <p className="err" role="alert">{error}</p>}
        <div className="row">
          <button className="solid" disabled={busy}>{mode === "login" ? "Sign in" : "Create account"}</button>
          <button type="button" onClick={() => setMode(mode === "login" ? "register" : "login")}>
            {mode === "login" ? "New here? Register" : "Have an account? Sign in"}
          </button>
        </div>
        <p className="muted">By continuing you understand HAWLAT is a technology marketplace and not a party to any transaction.</p>
      </form>
    </main>
  );
}
