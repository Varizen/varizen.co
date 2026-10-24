"use client";
import { useEffect, useRef, type ReactNode } from "react";

export function Reveal({ children, className = "" }: { children: ReactNode; className?: string }) {
  const ref = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const node = ref.current;
    if (!node || matchMedia("(prefers-reduced-motion: reduce)").matches) { node?.classList.add("revealed"); return; }
    const observer = new IntersectionObserver(([entry]) => { if (entry.isIntersecting) { node.classList.add("revealed"); observer.disconnect(); } }, { threshold: 0.08 });
    observer.observe(node); return () => observer.disconnect();
  }, []);
  return <div ref={ref} className={`reveal ${className}`}>{children}</div>;
}
