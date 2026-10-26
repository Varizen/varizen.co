import { InitiativeDetailView } from "@/components/InitiativeDetailView";
import { canonical } from "@/src/lib/domains";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "OIIX — Social, Creator & Video Connection | SohaelTasneem Foundation",
  description: "Social connection and video engagement platform designed for positive community storytelling, cultural documentation, and youth creativity.",
  alternates: {
    canonical: canonical("/initiatives/oiix"),
  },
};

export default function OiixPage() {
  return <InitiativeDetailView slug="oiix" />;
}
