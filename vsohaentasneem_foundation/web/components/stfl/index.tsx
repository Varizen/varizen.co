"use client";

import React, { ReactNode } from "react";
import Image from "next/image";
import Link from "next/link";
import {
  NavArrowDown,
  NavArrowRight,
  Check,
  WarningTriangle,
  InfoCircle,
  XmarkCircle,
  Xmark,
  ShieldAlert,
  Bell,
  Globe,
  User,
  Settings,
  Folder,
} from "iconoir-react";

/* =========================================================================
   STFL Brand Design System Tokens & Base Types
   ========================================================================= */

export type STFLSeverity = "clear" | "advisory" | "warning" | "review" | "hold" | "blocked" | "neutral" | "accent";

export interface STFLTranslation {
  bn: string;
  en: string;
}

/* =========================================================================
   1. STFLCard
   ========================================================================= */
export interface STFLCardProps {
  children: ReactNode;
  className?: string;
  accentStripe?: boolean;
  accentColor?: string;
  hoverable?: boolean;
  onClick?: () => void;
  id?: string;
}

export function STFLCard({
  children,
  className = "",
  accentStripe = false,
  accentColor = "#FF6B35",
  hoverable = false,
  onClick,
  id,
}: STFLCardProps) {
  return (
    <div
      id={id}
      onClick={onClick}
      className={`relative bg-white border border-[#E7E7E2] rounded-lg shadow-[0_1px_3px_0_rgba(8,31,45,0.06)] overflow-hidden transition-all ${
        hoverable ? "hover:border-[#081F2D]/30 hover:shadow-[0_4px_12px_rgba(8,31,45,0.08)] cursor-pointer" : ""
      } ${className}`}
    >
      {accentStripe && (
        <div
          className="absolute left-0 top-0 bottom-0 w-1"
          style={{ backgroundColor: accentColor }}
        />
      )}
      <div className={accentStripe ? "pl-2" : ""}>{children}</div>
    </div>
  );
}

/* =========================================================================
   2. STFLButton
   ========================================================================= */
export interface STFLButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "primary" | "secondary" | "subtle" | "danger" | "navy";
  size?: "sm" | "md" | "lg";
  icon?: ReactNode;
  iconPosition?: "left" | "right";
}

export function STFLButton({
  children,
  variant = "primary",
  size = "md",
  icon,
  iconPosition = "left",
  className = "",
  disabled,
  ...props
}: STFLButtonProps) {
  const sizeClasses = {
    sm: "h-8 px-3 text-xs gap-1.5",
    md: "h-10 px-4 text-xs font-semibold gap-2",
    lg: "h-12 px-6 text-sm font-semibold gap-2.5",
  }[size];

  const variantClasses = {
    primary:
      "bg-[#FF6B35] text-white hover:bg-[#E05A28] active:bg-[#CC4F20] shadow-sm disabled:bg-stone-300 disabled:cursor-not-allowed",
    secondary:
      "bg-white border border-[#E7E7E2] text-[#081F2D] hover:bg-[#FAFAF8] hover:border-stone-400 active:bg-stone-100 disabled:opacity-50",
    navy:
      "bg-[#081F2D] text-white hover:bg-[#0B2B43] active:bg-black shadow-sm disabled:bg-stone-300",
    subtle:
      "bg-transparent text-[#081F2D] hover:bg-[#FAFAF8] hover:text-[#FF6B35] active:bg-stone-200 disabled:opacity-40",
    danger:
      "bg-rose-600 text-white hover:bg-rose-700 active:bg-rose-800 shadow-sm disabled:bg-stone-300",
  }[variant];

  return (
    <button
      disabled={disabled}
      className={`inline-flex items-center justify-center rounded-md font-sans tracking-tight transition-colors duration-150 focus:outline-none focus:ring-2 focus:ring-[#FF6B35]/40 ${sizeClasses} ${variantClasses} ${className}`}
      {...props}
    >
      {icon && iconPosition === "left" && <span className="flex-shrink-0">{icon}</span>}
      <span>{children}</span>
      {icon && iconPosition === "right" && <span className="flex-shrink-0">{icon}</span>}
    </button>
  );
}

/* =========================================================================
   3. STFLBadge & STFLStatus
   ========================================================================= */
export interface STFLBadgeProps {
  children: ReactNode;
  severity?: STFLSeverity | "neutral" | "accent";
  size?: "sm" | "md";
  dot?: boolean;
  className?: string;
}

export function STFLBadge({
  children,
  severity = "neutral",
  size = "md",
  dot = true,
  className = "",
}: STFLBadgeProps) {
  const styles = {
    clear: "bg-emerald-50 text-emerald-800 border-emerald-200",
    advisory: "bg-sky-50 text-sky-800 border-sky-200",
    warning: "bg-amber-50 text-amber-800 border-amber-200",
    review: "bg-indigo-50 text-indigo-800 border-indigo-200",
    hold: "bg-stone-100 text-stone-700 border-stone-300",
    blocked: "bg-rose-50 text-rose-800 border-rose-200",
    neutral: "bg-stone-50 text-stone-700 border-stone-200",
    accent: "bg-orange-50 text-[#FF6B35] border-orange-200",
  }[severity];

  const dotColors = {
    clear: "bg-emerald-500",
    advisory: "bg-sky-500",
    warning: "bg-amber-500",
    review: "bg-indigo-500",
    hold: "bg-stone-400",
    blocked: "bg-rose-500",
    neutral: "bg-stone-400",
    accent: "bg-[#FF6B35]",
  }[severity];

  const sizeClass = size === "sm" ? "px-1.5 py-0.5 text-[10px]" : "px-2 py-0.5 text-xs";

  return (
    <span
      className={`inline-flex items-center gap-1.5 font-medium rounded border ${sizeClass} ${styles} ${className}`}
    >
      {dot && <span className={`w-1.5 h-1.5 rounded-full flex-shrink-0 ${dotColors}`} />}
      <span>{children}</span>
    </span>
  );
}

export function STFLStatus({
  status,
  lang = "bn",
}: {
  status: string;
  lang?: "bn" | "en";
}) {
  const norm = status.toUpperCase();
  let severity: STFLSeverity = "neutral";
  let labelBn = status;
  let labelEn = status;

  if (norm.includes("CLEAR") || norm.includes("ACTIVE") || norm.includes("PASS") || norm.includes("VERIFIED") || norm.includes("COMPLETED")) {
    severity = "clear";
    labelBn = "সক্রিয় / যাচাইকৃত";
    labelEn = "Active / Verified";
  } else if (norm.includes("ADVISORY") || norm.includes("IN_PROGRESS") || norm.includes("PROGRESS")) {
    severity = "advisory";
    labelBn = "পরামর্শ / চলমান";
    labelEn = "Advisory / In Progress";
  } else if (norm.includes("WARNING") || norm.includes("WATCH") || norm.includes("PENDING")) {
    severity = "warning";
    labelBn = "সতর্কতা / বিবেচনাধীন";
    labelEn = "Warning / Pending";
  } else if (norm.includes("REVIEW") || norm.includes("EVAL")) {
    severity = "review";
    labelBn = "পর্যালোচনা প্রয়োজন";
    labelEn = "Review Required";
  } else if (norm.includes("HOLD") || norm.includes("WAIT")) {
    severity = "hold";
    labelBn = "স্থগিত";
    labelEn = "On Hold";
  } else if (norm.includes("BLOCK") || norm.includes("FAIL") || norm.includes("CRITICAL")) {
    severity = "blocked";
    labelBn = "অবরুদ্ধ / ঝুঁকিপূর্ণ";
    labelEn = "Blocked / Critical";
  }

  return (
    <STFLBadge severity={severity} size="sm">
      {lang === "bn" ? labelBn : labelEn}
    </STFLBadge>
  );
}

/* =========================================================================
   4. STFLKPI
   ========================================================================= */
export interface STFLKPIProps {
  label: string;
  value: string | number;
  subtext?: string;
  accent?: boolean;
  trend?: string;
  statusBadge?: ReactNode;
  className?: string;
}

export function STFLKPI({
  label,
  value,
  subtext,
  accent = false,
  trend,
  statusBadge,
  className = "",
}: STFLKPIProps) {
  return (
    <STFLCard accentStripe={accent} className={`p-4 ${className}`}>
      <div className="flex items-start justify-between">
        <p className="text-[11px] font-semibold text-[#5A6B75] uppercase tracking-wider">
          {label}
        </p>
        {statusBadge}
      </div>
      <div className="mt-2 flex items-baseline gap-2">
        <span className="text-2xl sm:text-3xl font-bold text-[#081F2D] tracking-tight">
          {value}
        </span>
        {trend && (
          <span className="text-xs font-semibold text-emerald-600 bg-emerald-50 px-1.5 py-0.5 rounded">
            {trend}
          </span>
        )}
      </div>
      {subtext && <p className="mt-1 text-xs text-[#5A6B75] leading-relaxed">{subtext}</p>}
    </STFLCard>
  );
}

/* =========================================================================
   5. STFLSectionHeader
   ========================================================================= */
export interface STFLSectionHeaderProps {
  title: string;
  subtitle?: string;
  number?: string;
  badge?: ReactNode;
  actions?: ReactNode;
  className?: string;
}

export function STFLSectionHeader({
  title,
  subtitle,
  number,
  badge,
  actions,
  className = "",
}: STFLSectionHeaderProps) {
  return (
    <div className={`flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-[#E7E7E2] ${className}`}>
      <div>
        <div className="flex items-center gap-2">
          {number && (
            <span className="text-xs font-bold text-[#FF6B35] tracking-widest font-mono">
              {number}
            </span>
          )}
          <h2 className="text-lg sm:text-xl font-bold text-[#081F2D] tracking-tight">
            {title}
          </h2>
          {badge}
        </div>
        {subtitle && <p className="text-xs text-[#5A6B75] mt-0.5">{subtitle}</p>}
      </div>
      {actions && <div className="flex items-center gap-2">{actions}</div>}
    </div>
  );
}

/* =========================================================================
   6. STFLSelect & STFLInput
   ========================================================================= */
export interface STFLSelectProps extends React.SelectHTMLAttributes<HTMLSelectElement> {
  label?: string;
}

export function STFLSelect({ label, className = "", children, ...props }: STFLSelectProps) {
  return (
    <div className="flex flex-col gap-1">
      {label && <label className="text-[11px] font-semibold text-[#5A6B75]">{label}</label>}
      <div className="relative inline-block">
        <select
          className={`w-full appearance-none bg-white border border-[#E7E7E2] rounded-md px-3 py-1.5 pr-8 text-xs text-[#081F2D] outline-none transition focus:border-[#FF6B35] focus:ring-1 focus:ring-[#FF6B35] ${className}`}
          {...props}
        >
          {children}
        </select>
        <NavArrowDown
          width={14}
          height={14}
          className="pointer-events-none absolute right-2.5 top-1/2 -translate-y-1/2 text-stone-500"
        />
      </div>
    </div>
  );
}

export interface STFLInputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
}

export function STFLInput({ label, className = "", ...props }: STFLInputProps) {
  return (
    <div className="flex flex-col gap-1">
      {label && <label className="text-[11px] font-semibold text-[#5A6B75]">{label}</label>}
      <input
        className={`w-full bg-white border border-[#E7E7E2] rounded-md px-3 py-1.5 text-xs text-[#081F2D] outline-none transition focus:border-[#FF6B35] focus:ring-1 focus:ring-[#FF6B35] ${className}`}
        {...props}
      />
    </div>
  );
}

/* =========================================================================
   7. STFLProgress
   ========================================================================= */
export function STFLProgress({
  value,
  max = 100,
  label,
  color = "#FF6B35",
}: {
  value: number;
  max?: number;
  label?: string;
  color?: string;
}) {
  const pct = Math.min(100, Math.max(0, Math.round((value / max) * 100)));
  return (
    <div className="w-full space-y-1">
      {label && (
        <div className="flex justify-between text-[11px] text-[#5A6B75]">
          <span>{label}</span>
          <span className="font-semibold text-[#081F2D]">{pct}%</span>
        </div>
      )}
      <div className="w-full h-2 bg-[#E7E7E2] rounded-full overflow-hidden">
        <div
          className="h-full rounded-full transition-all duration-300"
          style={{ width: `${pct}%`, backgroundColor: color }}
        />
      </div>
    </div>
  );
}

/* =========================================================================
   8. STFLAlert
   ========================================================================= */
export function STFLAlert({
  severity = "warning",
  title,
  children,
  className = "",
}: {
  severity?: "info" | "warning" | "error" | "success";
  title?: string;
  children: ReactNode;
  className?: string;
}) {
  const styles = {
    info: "bg-sky-50 border-sky-300 text-sky-900",
    warning: "bg-amber-50 border-amber-300 text-amber-900",
    error: "bg-rose-50 border-rose-300 text-rose-900",
    success: "bg-emerald-50 border-emerald-300 text-emerald-900",
  }[severity];

  const icons = {
    info: <InfoCircle width={16} height={16} className="text-sky-700 flex-shrink-0" />,
    warning: <WarningTriangle width={16} height={16} className="text-amber-700 flex-shrink-0" />,
    error: <XmarkCircle width={16} height={16} className="text-rose-700 flex-shrink-0" />,
    success: <Check width={16} height={16} className="text-emerald-700 flex-shrink-0" />,
  }[severity];

  return (
    <div className={`flex items-start gap-3 p-3.5 rounded-md border text-xs leading-relaxed ${styles} ${className}`}>
      {icons}
      <div className="flex-1">
        {title && <p className="font-semibold mb-0.5">{title}</p>}
        <div>{children}</div>
      </div>
    </div>
  );
}

/* =========================================================================
   9. STFLDrawer
   ========================================================================= */
export function STFLDrawer({
  isOpen,
  onClose,
  title,
  subtitle,
  children,
  width = "max-w-md",
}: {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  subtitle?: string;
  children: ReactNode;
  width?: string;
}) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex justify-end">
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-[#081F2D]/40 backdrop-blur-xs transition-opacity"
        onClick={onClose}
      />
      {/* Panel */}
      <div
        className={`relative z-10 w-full ${width} bg-white h-full shadow-2xl flex flex-col border-l border-[#E7E7E2] animate-in slide-in-from-right duration-200`}
      >
        <div className="px-5 py-4 border-b border-[#E7E7E2] flex items-center justify-between bg-[#FAFAF8]">
          <div>
            <h3 className="text-sm font-bold text-[#081F2D]">{title}</h3>
            {subtitle && <p className="text-xs text-[#5A6B75] mt-0.5">{subtitle}</p>}
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded text-stone-500 hover:text-stone-900 hover:bg-stone-200/60 transition"
          >
            <Xmark width={16} height={16} />
          </button>
        </div>
        <div className="flex-1 overflow-y-auto p-5">{children}</div>
      </div>
    </div>
  );
}

/* =========================================================================
   10. STFLDialog
   ========================================================================= */
export function STFLDialog({
  isOpen,
  onClose,
  title,
  children,
  confirmAction,
  confirmLabel = "Confirm",
  cancelLabel = "Cancel",
  variant = "primary",
}: {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  children: ReactNode;
  confirmAction?: () => void;
  confirmLabel?: string;
  cancelLabel?: string;
  variant?: "primary" | "danger";
}) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="fixed inset-0 bg-[#081F2D]/50 backdrop-blur-xs" onClick={onClose} />
      <div className="relative z-10 w-full max-w-lg bg-white rounded-lg border border-[#E7E7E2] shadow-2xl overflow-hidden animate-in fade-in zoom-in-95 duration-150">
        <div className="px-5 py-4 border-b border-[#E7E7E2] flex items-center justify-between bg-[#FAFAF8]">
          <h3 className="text-sm font-bold text-[#081F2D]">{title}</h3>
          <button
            onClick={onClose}
            className="p-1 rounded text-stone-500 hover:text-stone-900 hover:bg-stone-200/60 transition"
          >
            <Xmark width={16} height={16} />
          </button>
        </div>
        <div className="p-5 text-xs text-[#081F2D] space-y-3">{children}</div>
        <div className="px-5 py-3 bg-[#FAFAF8] border-t border-[#E7E7E2] flex items-center justify-end gap-2">
          <STFLButton variant="secondary" size="sm" onClick={onClose}>
            {cancelLabel}
          </STFLButton>
          {confirmAction && (
            <STFLButton variant={variant === "danger" ? "danger" : "primary"} size="sm" onClick={confirmAction}>
              {confirmLabel}
            </STFLButton>
          )}
        </div>
      </div>
    </div>
  );
}

/* =========================================================================
   11. STFLEmptyState
   ========================================================================= */
export function STFLEmptyState({
  title,
  description,
  icon,
  action,
}: {
  title: string;
  description: string;
  icon?: ReactNode;
  action?: ReactNode;
}) {
  return (
    <div className="py-12 px-4 text-center border-2 border-dashed border-[#E7E7E2] rounded-lg bg-white">
      {icon && <div className="mx-auto w-10 h-10 text-stone-400 mb-3 flex items-center justify-center">{icon}</div>}
      <h3 className="text-sm font-semibold text-[#081F2D]">{title}</h3>
      <p className="text-xs text-[#5A6B75] mt-1 max-w-sm mx-auto">{description}</p>
      {action && <div className="mt-4">{action}</div>}
    </div>
  );
}

/* =========================================================================
   12. STFLBreadcrumb
   ========================================================================= */
export function STFLBreadcrumb({
  items,
}: {
  items: { label: string; href?: string }[];
}) {
  return (
    <nav className="flex items-center gap-1.5 text-xs text-[#5A6B75]">
      {items.map((item, idx) => (
        <React.Fragment key={idx}>
          {idx > 0 && <NavArrowRight width={12} height={12} className="text-stone-400 flex-shrink-0" />}
          {item.href ? (
            <Link href={item.href} className="hover:text-[#081F2D] transition">
              {item.label}
            </Link>
          ) : (
            <span className="font-semibold text-[#081F2D]">{item.label}</span>
          )}
        </React.Fragment>
      ))}
    </nav>
  );
}
