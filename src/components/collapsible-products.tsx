"use client";

import { useState } from "react";
import Link from "next/link";
import { ArrowUpRight, ChevronDown } from "lucide-react";
import { Stage } from "@/components/ui";

interface ProductItem {
  slug: string;
  name: string;
  category: string;
  stage: string;
  summary: string;
  index: string;
}

interface CategoryGroup {
  category: string;
  items: ProductItem[];
}

export function CollapsibleProducts({ groups }: { groups: CategoryGroup[] }) {
  // First two categories open by default (e.g. Platform, Cybersecurity), others collapsed
  const [openMap, setOpenMap] = useState<Record<string, boolean>>(() => {
    const init: Record<string, boolean> = {};
    groups.forEach((g, idx) => {
      init[g.category] = idx < 2;
    });
    return init;
  });

  const toggle = (cat: string) => {
    setOpenMap((prev) => ({ ...prev, [cat]: !prev[cat] }));
  };

  return (
    <div className="products-list">
      {groups.map(({ category, items }) => {
        const isOpen = !!openMap[category];
        return (
          <section key={category} className={`product-category-section ${isOpen ? "is-open" : "is-collapsed"}`}>
            <button
              type="button"
              onClick={() => toggle(category)}
              className="product-category-head"
              aria-expanded={isOpen}
            >
              <div className="product-category-meta">
                <h2>{category}</h2>
                <span className="product-category-count">{items.length} {items.length === 1 ? "branch" : "branches"}</span>
              </div>
              <span className={`product-category-toggle ${isOpen ? "rotate" : ""}`}>
                <ChevronDown size={18} />
              </span>
            </button>
            {isOpen && (
              <div className="product-category-body">
                {items.map((product) => (
                  <Link href={`/products/${product.slug}`} key={product.slug} className="product-row">
                    <span className="product-number">{product.index}</span>
                    <div>
                      <h2 style={{ fontSize: 20, fontWeight: 500, margin: "0 0 5px" }}>{product.name}</h2>
                      <p>{product.category}</p>
                    </div>
                    <p className="product-description">{product.summary}</p>
                    <Stage>{product.stage}</Stage>
                    <span className="round-arrow">
                      <ArrowUpRight size={18} />
                    </span>
                  </Link>
                ))}
              </div>
            )}
          </section>
        );
      })}
    </div>
  );
}
