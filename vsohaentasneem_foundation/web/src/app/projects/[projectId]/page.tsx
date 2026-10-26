"use client";

import React, { use } from "react";
import { DemoWorkspace } from "../../demo/DemoWorkspace";

export default function ProjectDetailPage({
  params,
}: {
  params: Promise<{ projectId: string }>;
}) {
  const resolvedParams = use(params);
  return (
    <DemoWorkspace
      initialProjectId={resolvedParams.projectId}
      initialSegment="operations"
    />
  );
}
