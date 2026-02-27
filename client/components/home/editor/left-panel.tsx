import React from "react";
import { ProblemDescription } from "./problem-description";
import { ResizableHandle, ResizablePanel, ResizableGroup } from "@/components/ui/resizable";

export const LeftPanel = () => {
  return (
    <ResizableGroup>
      <ResizablePanel defaultSize={60} minSize={30}>
        <ProblemDescription />
      </ResizablePanel>
      <ResizableHandle withHandle className="h-1 bg-border hover:bg-orange-500/50" />
    </ResizableGroup>
  );
};
