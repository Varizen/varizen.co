import { InitiativeDetailView } from "@/components/InitiativeDetailView";
import { canonical } from "@/src/lib/domains";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "SkillConnect — Workforce & Opportunity Platform | SohaelTasneem Foundation",
  description: "Decentralized workforce registration, credential management, ethical recruitment matching, and migration guidance.",
  alternates: {
    canonical: canonical("/initiatives/skillconnect"),
  },
};

export default function SkillConnectPage() {
  return <InitiativeDetailView slug="skillconnect" />;
}
