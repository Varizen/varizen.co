"use client";

/**
 * STFL — Central Iconoir Configuration
 *
 * ALL interface icons must come from Iconoir.
 *
 * Do not introduce another icon library.
 */

import React from "react";
import { IconoirProvider } from "iconoir-react";

export const STFLIconoirProvider = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  return (
    <IconoirProvider
      iconProps={{
        color: "currentColor",
        width: "1em",
        height: "1em",
        strokeWidth: 1.5,
      }}
    >
      {children}
    </IconoirProvider>
  );
};
