import React from "react";


const Header = () => {
    return <div>Header</div>;
}

const MobileNav = () => {
    return <div> Mobile Nav </div>
}

export default function HomeLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex flex-col h-screen text-foreground overflow-hidden">
      <Header />

      <div className="flex flex-1 overflow-hidden">
        <div className="container mx-auto flex h-full">
          <aside className="hidden lg:flex lg:w-64 xl:w-72 flex-col border-r shrink-0 h-full">
            Header
          </aside>

          <main className="flex-1 min-w-0 h-full overflow-hidden">
            {children}
          </main>
        </div>
      </div>

      <MobileNav />
    </div>
  );
}
