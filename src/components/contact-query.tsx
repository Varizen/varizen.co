"use client";
import { useSearchParams } from "next/navigation";
import { ContactForm } from "./contact-form";
const reasons = ["business", "security", "privacy", "support", "partnerships", "investment", "product"];
export function ContactQuery() { const params = useSearchParams(); const reason = params.get("reason") ?? "business"; return <ContactForm initialReason={reasons.includes(reason) ? reason : "business"} capability={params.get("capability")?.slice(0, 100) ?? ""} project={params.get("project")?.slice(0, 100) ?? ""} />; }
