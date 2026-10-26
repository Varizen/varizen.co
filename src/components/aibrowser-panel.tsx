"use client";

import { useRef, type PointerEvent as ReactPointerEvent, type ReactNode } from "react";
import { GripVertical, Minus, PanelRight, PictureInPicture2, Pin, X } from "lucide-react";

export type PanelMode = "docked" | "floating" | "min";

export interface PanelState {
  mode: PanelMode;
  autohide: boolean;
  open: boolean;
  /** Left offset while floating. Negative = snapped to the right edge. */
  x: number;
  y: number;
}

export const newPanel = (mode: PanelMode, open: boolean): PanelState => ({ mode, autohide: false, open, x: -1, y: 12 });

/** Toolbar toggle: closed -> open, minimized -> restored, open -> closed. */
export const togglePanel = (s: PanelState): PanelState => {
  if (!s.open) return { ...s, open: true, mode: s.mode === "min" ? "floating" : s.mode };
  if (s.mode === "min") return { ...s, mode: "floating" };
  return { ...s, open: false };
};

interface PanelProps {
  state: PanelState;
  onChange: (patch: Partial<PanelState>) => void;
  title: string;
  badge?: string;
  icon: ReactNode;
  width: number;
  floatHeight?: number;
  /** Position among minimized dots (0 = bottom-most). */
  slot: number;
  children: ReactNode;
}

const clamp = (v: number, lo: number, hi: number) => Math.max(lo, Math.min(hi, v));

const btn =
  "w-[22px] h-[22px] grid place-items-center rounded-[5px] text-[#6e6e7a] hover:bg-white/[0.06] hover:text-[#f0f0f5] transition-colors";
const btnOn = "bg-[#ff762f]/15 !text-[#ff762f]";

export function Panel({ state, onChange, title, badge, icon, width, floatHeight, slot, children }: PanelProps) {
  const ref = useRef<HTMLDivElement>(null);
  const drag = useRef<{ sx: number; sy: number; ox: number; oy: number } | null>(null);

  if (!state.open) return null;
  const { mode, autohide } = state;

  const restore = () => onChange({ mode: "floating", autohide: false });

  /* ---------- Minimized: collapses to a pulsing dot ---------- */
  if (mode === "min") {
    return (
      <div
        ref={ref}
        role="button"
        tabIndex={0}
        title={`Restore ${title}`}
        aria-label={`Restore ${title}`}
        onClick={restore}
        onKeyDown={(e) => {
          if (e.key === "Enter" || e.key === " ") {
            e.preventDefault();
            restore();
          }
        }}
        className="absolute right-3 z-[70] w-11 h-11 rounded-full grid place-items-center cursor-pointer text-[#ff762f] bg-[#13131a] border border-white/[0.12] shadow-[0_6px_20px_rgba(0,0,0,0.4),0_0_0_1px_rgba(255,118,47,0.18)] hover:border-[#ff762f] transition-colors"
        style={{ bottom: 44 + slot * 54 }}
      >
        {icon}
        <span className="absolute inset-[5px] rounded-full border border-[#ff762f]/45 animate-pulse pointer-events-none" />
      </div>
    );
  }

  /* ---------- Drag (floating only) ---------- */
  const onDown = (e: ReactPointerEvent<HTMLDivElement>) => {
    if (mode !== "floating" || (e.target as HTMLElement).closest("button")) return;
    const el = ref.current;
    if (!el) return;
    e.currentTarget.setPointerCapture(e.pointerId);
    drag.current = { sx: e.clientX, sy: e.clientY, ox: el.offsetLeft, oy: el.offsetTop };
  };
  const onMove = (e: ReactPointerEvent<HTMLDivElement>) => {
    const d = drag.current;
    const el = ref.current;
    const parent = el?.parentElement;
    if (!d || !el || !parent) return;
    onChange({
      x: clamp(d.ox + e.clientX - d.sx, 0, parent.clientWidth - el.offsetWidth),
      y: clamp(d.oy + e.clientY - d.sy, 0, parent.clientHeight - el.offsetHeight),
    });
  };
  const onUp = (e: ReactPointerEvent<HTMLDivElement>) => {
    if (!drag.current) return;
    drag.current = null;
    if (e.currentTarget.hasPointerCapture(e.pointerId)) e.currentTarget.releasePointerCapture(e.pointerId);
  };

  /* ---------- Shell per mode ---------- */
  let cls: string;
  let style: React.CSSProperties;
  if (mode === "floating") {
    cls =
      "absolute z-[60] rounded-xl border border-white/[0.12] shadow-[0_20px_60px_rgba(0,0,0,0.6)] overflow-hidden";
    style = {
      width,
      height: floatHeight,
      maxHeight: "calc(100% - 24px)",
      top: state.y,
      ...(state.x < 0 ? { right: 12 } : { left: state.x }),
    };
  } else if (autohide) {
    cls =
      "absolute top-0 bottom-0 right-0 z-[55] border-l border-white/[0.06] shadow-[-8px_0_24px_rgba(0,0,0,0.35)] transition-transform duration-[280ms] translate-x-[calc(100%-6px)] hover:translate-x-0 focus-within:translate-x-0";
    style = { width };
  } else {
    cls = "relative shrink-0 border-l border-white/[0.06]";
    style = { width };
  }

  return (
    <div
      ref={ref}
      className={`flex flex-col bg-gradient-to-br from-[#13131a] to-[#06060a] text-[#f0f0f5] ${cls}`}
      style={style}
    >
      {mode === "docked" && autohide && (
        <span className="absolute left-0 top-0 bottom-0 w-[6px] rounded-l-[3px] bg-gradient-to-b from-[#ff762f] to-[#e85a1a] opacity-85 pointer-events-none" />
      )}

      <div
        onPointerDown={onDown}
        onPointerMove={onMove}
        onPointerUp={onUp}
        onPointerCancel={onUp}
        className={`h-10 shrink-0 flex items-center gap-2 px-3 border-b border-white/[0.06] select-none ${
          mode === "floating" ? "cursor-grab active:cursor-grabbing" : ""
        }`}
      >
        {mode === "floating" && <GripVertical className="w-3 h-3 text-[#4a4a56] shrink-0" />}
        <span className="flex text-[#ff762f] shrink-0">{icon}</span>
        <span className="text-[12px] font-semibold tracking-wide truncate">{title}</span>
        {badge && (
          <span className="text-[9px] font-semibold text-[#13d69a] border border-[#13d69a]/30 rounded px-[5px] py-px bg-[#13d69a]/[0.08]">
            {badge}
          </span>
        )}
        <div className="flex-1" />
        <div className="flex items-center gap-0.5 shrink-0">
          {mode === "floating" ? (
            <button className={btn} title="Dock panel" onClick={() => onChange({ mode: "docked", autohide: false })}>
              <PanelRight className="w-3 h-3" />
            </button>
          ) : (
            <button className={btn} title="Float panel" onClick={() => onChange({ mode: "floating", autohide: false, x: -1, y: 12 })}>
              <PictureInPicture2 className="w-3 h-3" />
            </button>
          )}
          <button
            className={`${btn} ${mode === "docked" && autohide ? btnOn : ""}`}
            title={autohide ? "Pin panel" : "Auto-hide"}
            aria-pressed={mode === "docked" && autohide}
            onClick={() => onChange({ mode: "docked", autohide: !autohide })}
          >
            <Pin className="w-3 h-3" />
          </button>
          <button className={btn} title="Minimize to dot" onClick={() => onChange({ mode: "min", autohide: false })}>
            <Minus className="w-3 h-3" />
          </button>
          <button className={btn} title="Close" onClick={() => onChange({ open: false })}>
            <X className="w-3 h-3" />
          </button>
        </div>
      </div>

      <div className="flex-1 min-h-0 flex flex-col">{children}</div>
    </div>
  );
}
