import { products } from "@/content/site";
export function GET() { return Response.json({ data: products.map(({ slug, name, category, stage, summary, status }) => ({ slug, name, category, stage, summary, status })) }, { headers: { "Cache-Control": "public, max-age=300, stale-while-revalidate=3600" } }); }
