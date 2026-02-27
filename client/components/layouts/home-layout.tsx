import React from "react";
import { Header } from "../home/header/header";

export default function HomeLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex flex-col h-screen text-foreground overflow-hidden">
      <section className="w-full h-[10%]">
        <Header />
      </section>

      <main className="container mx-auto h-[90%]">
        {children}
      </main>
    </div>
  );
}
