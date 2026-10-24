import type { Metadata } from "next";
import { products, getProductWithOverride } from "@/content/site";
import { PageHero, Section, SectionHead } from "@/components/ui";
import { CollapsibleProducts } from "@/components/collapsible-products";

export const metadata: Metadata = {
  title: "Products",
  description: "Explore Varizen’s selected product and venture portfolio, with maturity and evidence status stated clearly.",
  alternates: { canonical: "/products" },
};

export default function ProductsPage() {
  const byCategory = products.reduce<Record<string, typeof products>>((acc, item) => {
    const key = item.category;
    if (!acc[key]) acc[key] = [];
    acc[key].push(getProductWithOverride(item.slug) ?? item);
    return acc;
  }, {});

  const groups = Object.entries(byCategory).map(([category, items]) => ({
    category,
    items,
  }));

  return (
    <>
      <PageHero
        eyebrow="SELECTED PORTFOLIO"
        title="Product, Service and Solutions."
        copy="Varizen builds products, services and solutions around identity, governance, evidence and operational clarity. Concepts are never presented as finished products."
      />
      <Section>
        <SectionHead
          eyebrow="PORTFOLIO GOVERNANCE"
          title="Readiness is part of the story."
          copy="Labels distinguish architecture, concepts and capabilities whose maturity evidence is not yet published."
        />
        <CollapsibleProducts groups={groups} />
      </Section>
    </>
  );
}
