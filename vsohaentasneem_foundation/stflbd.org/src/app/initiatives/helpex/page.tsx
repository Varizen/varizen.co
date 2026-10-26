import { InitiativeDetailView } from "@/components/InitiativeDetailView";
import { canonical } from "@/src/lib/domains";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Helpex — Collateral Finance & Asset Liquidity | SohaelTasneem Foundation",
  description: "Ethical collateral finance and transparent pawn service model designed to protect vulnerable households from predatory loan sharks.",
  alternates: {
    canonical: canonical("/initiatives/helpex"),
  },
};

export default function HelpexPage() {
  return <InitiativeDetailView slug="helpex" />;
}
