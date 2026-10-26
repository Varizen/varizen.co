/**
 * Domain constants for STFL Foundation Web (stflbd.org).
 * Binding spec: STFL_DOMAIN_SEPARATION_ARCHITECTURE.md §3.4
 */

export const FOUNDATION_ORIGIN = "https://stflbd.org";
export const APP_ORIGIN = "https://stflbd.app";

export const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_BASE_URL ||
  process.env.NEXT_PUBLIC_API_URL ||
  "https://stflbd.app/api/v1";

export const VERIFY_ORIGIN = APP_ORIGIN;
export const SITE_ORIGIN = FOUNDATION_ORIGIN;
export const WORKSPACE_BASE = "/admin";

/**
 * Returns canonical URL for a given path on stflbd.org
 */
export function canonical(path: string = "/"): string {
  const clean = path.startsWith("/") ? path : `/${path}`;
  return `${SITE_ORIGIN}${clean === "/" ? "" : clean}`;
}
