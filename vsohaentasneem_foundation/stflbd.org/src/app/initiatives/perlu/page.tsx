import { InitiativeDetailView } from "@/components/InitiativeDetailView";
import { canonical } from "@/src/lib/domains";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Perlu — Malaysia Digital Marketplace & SME Platform | SohaelTasneem Foundation",
  description: "Malaysia-focused localized commerce platform designed for small merchants, neighborhood food businesses, and regional artisans.",
  alternates: {
    canonical: canonical("/initiatives/perlu"),
  },
};

export default function PerluPage() {
  return <InitiativeDetailView slug="perlu" />;
}
