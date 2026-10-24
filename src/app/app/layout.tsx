import { redirect } from "next/navigation";
import { requireAuth } from "@/server/auth";
export const ensureStatic = false;
export default async function AppLayout({ children }: LayoutProps<"/app">) { const auth = await requireAuth("app:read"); if (!auth) redirect("/login"); return <main id="main-content" className="app-shell">{children}</main>; }
