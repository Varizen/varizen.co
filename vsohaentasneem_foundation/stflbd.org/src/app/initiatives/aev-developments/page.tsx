import { InitiativeDetailView } from "@/components/InitiativeDetailView";
import { canonical } from "@/src/lib/domains";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "AEV Developments — Real Estate & Infrastructure | SohaelTasneem Foundation",
  description: "Sustainable physical development, resilient community facilities, rural health centers, and low-cost ecological housing.",
  alternates: {
    canonical: canonical("/initiatives/aev-developments"),
  },
};

export default function AevDevelopmentsPage() {
  return <InitiativeDetailView slug="aev-developments" />;
}
