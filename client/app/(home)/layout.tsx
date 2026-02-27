import React from "react";
import HomeLayout from "@/components/layouts/home-layout";
import { ProtectedRoute } from "@/components/protected-route";

export default function Layout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <ProtectedRoute>
      <HomeLayout>{children}</HomeLayout>
    </ProtectedRoute>
  );
}
