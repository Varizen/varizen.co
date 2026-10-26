import { InitiativeDetailView } from "@/components/InitiativeDetailView";
import { canonical } from "@/src/lib/domains";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "MaxRemit — Cross-Border Remittance & Financial Opportunity | SohaelTasneem Foundation",
  description: "Cross-border payment and remittance platform focused on reducing extortionate transfer fees and protecting migrant worker earnings.",
  alternates: {
    canonical: canonical("/initiatives/maxremit"),
  },
};

export default function MaxRemitPage() {
  return <InitiativeDetailView slug="maxremit" />;
}
