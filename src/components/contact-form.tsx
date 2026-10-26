"use client";
import { useRef, useState } from "react";
import Link from "next/link";
import { User, Building, Briefcase, Mail, Phone, AlertCircle } from "lucide-react";
import { ArrowUpRight, CheckCircle2 } from "lucide-react";
import { contactSchema } from "@/lib/validation";

export function ContactForm({ initialReason = "business", capability = "", project = "" }: { initialReason?: string; capability?: string; project?: string }) {
  const form = useRef<HTMLFormElement>(null);
  const idempotency = useRef(crypto.randomUUID());
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [status, setStatus] = useState<{ kind: string; message: string; reference?: string } | null>(null);
  const [sending, setSending] = useState(false);
  async function submit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault(); setSending(true); setStatus(null);
    const raw = new FormData(event.currentTarget);
    const data = Object.fromEntries(raw.entries());
    const parsed = contactSchema.safeParse({ ...data, consent: raw.get("consent") === "on" });
    if (!parsed.success) { const next: Record<string, string> = {}; parsed.error.issues.forEach((issue) => { next[String(issue.path[0])] = issue.message; }); setErrors(next); setSending(false); (event.currentTarget.querySelector(`[name="${Object.keys(next)[0]}"]`) as HTMLElement)?.focus(); return; }
    setErrors({});
    try {
      const response = await fetch("/api/v1/contact", { method: "POST", headers: { "Content-Type": "application/json", "Idempotency-Key": idempotency.current }, body: JSON.stringify(parsed.data) });
      const result = await response.json() as { message?: string; reference?: string };
      if (!response.ok) { setStatus({ kind: "error", message: result.message ?? "We could not submit your enquiry. Please email hi@varizen.co." }); return; }
      setStatus({ kind: "success", message: result.message ?? "Your enquiry has been received.", reference: result.reference });
      form.current?.reset(); idempotency.current = crypto.randomUUID();
    } catch { setStatus({ kind: "error", message: "The connection could not be completed. Please try again or email hi@varizen.co." }); }
    finally { setSending(false); }
  }
  const error = (key: string) => errors[key] ? <span className="field-error" id={`${key}-error`}>{errors[key]}</span> : null;
  const invalid = (key: string) => errors[key] ? { "aria-invalid": true, "aria-describedby": `${key}-error` } : {};
  return <form className="contact-form" ref={form} onSubmit={submit} noValidate>
    <div aria-live="polite">{status && <div className={`form-status ${status.kind}`} role={status.kind === "error" ? "alert" : "status"}>{status.kind === "success" && <CheckCircle2 size={19} color="var(--green)" />}<strong>{status.kind === "success" ? "Enquiry received." : "Submission not completed."}</strong><p>{status.message}</p>{status.reference && <p>Reference: <code>{status.reference}</code></p>}</div>}</div>
    <div className="form-grid"><div className="field"><label htmlFor="reason">Reason for contact</label><select id="reason" name="reason" defaultValue={initialReason} {...invalid("reason")}><option value="business">Business</option><option value="security">Security</option><option value="privacy">Privacy</option><option value="support">Support</option><option value="partnerships">Partnerships</option><option value="investment">Investment / Portfolio</option><option value="product">Product</option></select>{error("reason")}</div><div className="field"><label htmlFor="name">Name</label><input id="name" name="name" autoComplete="name" required maxLength={100} {...invalid("name")} />{error("name")}</div><div className="field"><label htmlFor="organization">Organization</label><input id="organization" name="organization" autoComplete="organization" required maxLength={150} {...invalid("organization")} />{error("organization")}</div><div className="field"><label htmlFor="role">Role</label><input id="role" name="role" autoComplete="organization-title" required maxLength={100} {...invalid("role")} />{error("role")}</div><div className="field"><label htmlFor="email">Work email</label><input id="email" name="email" type="email" autoComplete="email" required maxLength={254} {...invalid("email")} />{error("email")}</div><div className="field"><label htmlFor="phone">Phone <span style={{ color: "var(--muted)", fontWeight: 400 }}>(optional)</span></label><input id="phone" name="phone" type="tel" autoComplete="tel" maxLength={30} {...invalid("phone")} />{error("phone")}</div></div>
    <input type="hidden" name="capability" value={capability} /><input type="hidden" name="project" value={project} />
    <div className="field"><label htmlFor="message">How can we help?</label><textarea id="message" name="message" required minLength={20} maxLength={4000} placeholder="Tell us about the system, challenge or idea you want to discuss." {...invalid("message")} />{error("message")}</div>
    <div className="honeypot" aria-hidden="true"><label htmlFor="website">Leave this field empty</label><input id="website" name="website" type="text" tabIndex={-1} autoComplete="off" /></div>
    <div className="field"><label style={{ display: "flex", gap: 9, fontWeight: 400, alignItems: "flex-start" }}><input style={{ width: 16, minHeight: 16, marginTop: 3 }} type="checkbox" name="consent" required {...invalid("consent")} /><span>I agree that Varizen may review this enquiry as described in the <Link href="/trust/privacy" style={{ textDecoration: "underline" }}>privacy notice</Link>.</span></label>{error("consent")}</div>
    <div className="form-foot"><p>Please do not include passwords, confidential documents or sensitive personal information.</p><button type="submit" className="button" disabled={sending}>{sending ? "Submitting…" : "Send enquiry"}{!sending && <ArrowUpRight size={16} />}</button></div>
  </form>;
}

// Icons added for better visual recognition
