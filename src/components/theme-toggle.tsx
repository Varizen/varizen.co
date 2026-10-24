"use client";
import { Moon, Sun } from "lucide-react";
import { useEffect, useState } from "react";

export function ThemeToggle() {
  const [dark, setDark] = useState(false);
  useEffect(() => {
    const timer = setTimeout(() => setDark(document.documentElement.dataset.theme === "dark"), 0);
    return () => clearTimeout(timer);
  }, []);
  function toggle() {
    const next = !dark;
    document.documentElement.dataset.theme = next ? "dark" : "light";
    try { localStorage.setItem("vz-theme", next ? "dark" : "light"); } catch { /* Storage is optional. */ }
    setDark(next);
  }
  return <button className="icon-button theme-toggle" onClick={toggle} aria-label={dark ? "Use light theme" : "Use dark theme"}>{dark ? <Sun size={17} /> : <Moon size={17} />}</button>;
}
