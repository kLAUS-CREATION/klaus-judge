import React from "react";

const LandingHeader = () => {
    return <div>Header</div>;
}

export default function LandingLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="size-full  flex flex-col text-foreground overflow-y-auto">
      <LandingHeader />
      {children}
    </div>
  );
}
