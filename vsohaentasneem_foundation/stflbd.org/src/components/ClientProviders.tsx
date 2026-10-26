"use client";

import React, { ReactNode } from "react";
import { LanguageProvider } from "@/src/context/LanguageContext";

export function ClientProviders({ children }: { children: ReactNode }) {
  return <LanguageProvider>{children}</LanguageProvider>;
}
