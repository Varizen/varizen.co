import { InitiativeDetailView } from "@/components/InitiativeDetailView";
import { canonical } from "@/src/lib/domains";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Proiozon (প্রয়োজন) — Bangladesh Digital Marketplace | SohaelTasneem Foundation",
  description: "Bangla-first digital commerce ecosystem empowering local cottage industries, verified merchants, and consumers.",
  alternates: {
    canonical: canonical("/initiatives/proiozon"),
  },
};

export default function ProiozonPage() {
  return <InitiativeDetailView slug="proiozon" />;
}
