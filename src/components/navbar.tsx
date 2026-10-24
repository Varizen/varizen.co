"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { ArrowUpRight, ChevronDown, Menu, X } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { nav, products, solutions } from "@/content/site";
import { Brand } from "./brand";
import { ThemeToggle } from "./theme-toggle";
import { AiBrowserTrigger } from "./aibrowser-trigger";

export function Navbar() {
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const pathname = usePathname();
  const menu = useRef<HTMLButtonElement>(null);
  useEffect(() => {
    const frame = requestAnimationFrame(() => setScrolled(window.scrollY > 20));
    const scroll = () => setScrolled(window.scrollY > 20);
    const key = (event: KeyboardEvent) => {
      if (event.key === "Escape") { setOpen(false); menu.current?.focus(); }
      if (event.key === "Tab" && open) {
        const items = document.querySelectorAll<HTMLElement>(".mobile-menu a, .mobile-menu button");
        const first = items[0]; const last = items[items.length - 1];
        if (event.shiftKey && document.activeElement === first) { event.preventDefault(); last?.focus(); }
        if (!event.shiftKey && document.activeElement === last) { event.preventDefault(); first?.focus(); }
      }
    };
    window.addEventListener("scroll", scroll, { passive: true }); document.addEventListener("keydown", key);
    document.body.style.overflow = open ? "hidden" : "";
    return () => { cancelAnimationFrame(frame); window.removeEventListener("scroll", scroll); document.removeEventListener("keydown", key); document.body.style.overflow = ""; };
  }, [open]);
  return <>
    <a href="#main-content" className="skip-link">Skip to content</a>
    <header className={`site-header ${scrolled ? "is-scrolled" : ""}`}>
      <div className="container nav-inner">
        <Brand />
        <nav className="desktop-nav" aria-label="Main navigation">
          {nav.map((item, i) => <div className="nav-item" key={item.href}><Link className={pathname.startsWith(item.href) ? "active" : ""} href={item.href}>{item.label}{(i === 0 || i === 1 || i === 2) && <ChevronDown size={12} aria-hidden="true" />}</Link>{i < 3 && <div className="nav-dropdown"><p>{i === 0 ? "THE OPERATING SYSTEM" : i === 1 ? "START WITH A CHALLENGE" : "A COHERENT PORTFOLIO"}</p>{i === 0 ? <><Link href="/platform">Varizen Platform<small>One governed operating experience</small></Link><Link href="/platform#enos">ENOS<small>360° cloud operating architecture</small></Link><Link href="/platform#ai">Varizen AI<small>Controlled intelligence, human approval</small></Link></> : (i === 1 ? solutions : products).slice(0, 6).map((entry) => <Link key={entry.slug} href={`/${i === 1 ? "solutions" : "products"}/${entry.slug}`}>{entry.name}<small>{entry.summary}</small></Link>)}</div>}</div>)}
        </nav>
        <div className="nav-actions">
          <AiBrowserTrigger />
          <ThemeToggle />
          <Link className="button button-small nav-cta" href="/contact">Talk to Varizen <ArrowUpRight size={15} /></Link>
          <button ref={menu} className="icon-button menu-toggle" aria-expanded={open} aria-controls="mobile-menu" aria-label={open ? "Close menu" : "Open menu"} onClick={() => setOpen(!open)}>{open ? <X /> : <Menu />}</button>
        </div>
      </div>
    </header>
    {open && <div className="mobile-menu" id="mobile-menu" role="dialog" aria-modal="true" aria-label="Navigation"><nav className="container">{nav.map((item, i) => <Link key={item.href} href={item.href} onClick={() => setOpen(false)}><span>0{i + 1}</span>{item.label}<ArrowUpRight /></Link>)}<div style={{ margin: "20px 0" }}><AiBrowserTrigger /></div><Link href="/contact" className="button" onClick={() => setOpen(false)}>Talk to Varizen <ArrowUpRight /></Link><div className="mobile-menu-foot"><span>Digital trust, made operational.</span><a href="mailto:hi@varizen.co">hi@varizen.co</a></div></nav></div>}
  </>;
}
