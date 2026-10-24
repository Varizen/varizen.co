import type { Metadata } from "next";
import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import { products, getProductWithOverride } from "@/content/site";
import { PageHero, Section, SectionHead, Stage } from "@/components/ui";
export const metadata: Metadata = { title: "Products", description: "Explore Varizen’s selected product and venture portfolio, with maturity and evidence status stated clearly.", alternates: { canonical: "/products" } };
export default function ProductsPage() {
  const byCategory = products.reduce<Record<string, typeof products>>((acc, item) => {
    const key = item.category;
    if (!acc[key]) acc[key] = [];
    acc[key].push(item);
    return acc;
  }, {});
  return <><PageHero eyebrow="SELECTED PORTFOLIO" title="Product, Service and Solutions." copy="Varizen builds products, services and solutions around identity, governance, evidence and operational clarity. Concepts are never presented as finished products." /><Section><SectionHead eyebrow="PORTFOLIO GOVERNANCE" title="Readiness is part of the story." copy="Labels distinguish architecture, concepts and capabilities whose maturity evidence is not yet published." /><div className="products-list">{Object.entries(byCategory).map(([category, items]) => <section key={category}><h2 style={{ fontSize: 20, fontWeight: 550, margin: "30px 0 15px" }}>{category}</h2>{items.map((item) => { const product = getProductWithOverride(item.slug) ?? item; return <Link href={`/products/${product.slug}`} key={product.slug} className="product-row"><span className="product-number">{product.index}</span><div><h2 style={{ fontSize: 20, fontWeight: 500, margin: "0 0 5px" }}>{product.name}</h2><p>{product.category}</p></div><p className="product-description">{product.summary}</p><Stage>{product.stage}</Stage><span className="round-arrow"><ArrowUpRight size={18} /></span></Link>; })}</section>)}</div></Section></>; }
