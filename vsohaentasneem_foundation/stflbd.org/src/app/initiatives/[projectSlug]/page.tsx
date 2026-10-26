import { InitiativeDetailView } from "@/components/InitiativeDetailView";
import { getPublicInitiatives, getInitiativeBySlug } from "@/src/lib/initiativesRegistry";
import { canonical } from "@/src/lib/domains";
import { Metadata } from "next";

export function generateStaticParams() {
  const initiatives = getPublicInitiatives();
  return initiatives.map((p) => ({
    projectSlug: p.slug,
  }));
}

interface PageProps {
  params: Promise<{ projectSlug: string }>;
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { projectSlug } = await params;
  const project = getInitiativeBySlug(projectSlug);
  if (!project) {
    return {
      title: "Initiative | SohaelTasneem Foundation",
    };
  }
  return {
    title: `${project.displayNameEn} | SohaelTasneem Foundation`,
    description: project.shortDescriptionEn,
    alternates: {
      canonical: canonical(`/initiatives/${project.slug}`),
    },
  };
}

export default async function DynamicInitiativePage({ params }: PageProps) {
  const { projectSlug } = await params;
  return <InitiativeDetailView slug={projectSlug} />;
}
