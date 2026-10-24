"use client";
import Link from "next/link";
import { useEffect, useState } from "react";
import { X } from "lucide-react";

export function CookieConsent() {
  const [visible, setVisible] = useState(false);
  useEffect(() => {
    const timer = setTimeout(() => {
      try { setVisible(localStorage.getItem("vz-consent") === null); } catch { /* Ignore unavailable storage. */ }
    }, 0);
    return () => clearTimeout(timer);
  }, []);
  function choose(value: string) { try { localStorage.setItem("vz-consent", value); } catch { /* Consent is not persisted without storage. */ } setVisible(false); }
  if (!visible) return null;
  return <aside className="cookie-notice" aria-label="Cookie notice"><button className="icon-button" onClick={() => choose("essential")} aria-label="Dismiss cookie notice"><X size={17} /></button><p><strong>Your privacy matters.</strong> We use essential storage for site preferences. Optional analytics stay disabled until enabled by a configured, consented provider. <Link href="/trust/cookies">Learn more</Link>.</p><div><button className="button button-ghost" onClick={() => choose("essential")}>Essential only</button><button className="button" onClick={() => choose("all")}>Allow optional</button></div></aside>;
}
