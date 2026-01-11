"use client";

import { ReactNode } from "react";
import { ReactQueryProvider } from "./tanstack-provider";
import { ThemeProvider } from "./theme-provider";

interface AppProvidersProps {
  children: ReactNode;
}

export function AppProviders({ children }: AppProvidersProps) {
  return (
    <ReactQueryProvider>
        <ThemeProvider>{children}</ThemeProvider>
    </ReactQueryProvider>
  );
}
