"use client";

import { ReactNode } from "react";
import { ReactQueryProvider } from "./tanstack-provider";
import { ThemeProvider } from "./theme-provider";
import { AuthProvider } from "@/lib/context/auth-context";

interface AppProvidersProps {
  children: ReactNode;
}

export function AppProviders({ children }: AppProvidersProps) {
  return (
    <ReactQueryProvider>
      <ThemeProvider>
        <AuthProvider>{children}</AuthProvider>
      </ThemeProvider>
    </ReactQueryProvider>
  );
}
