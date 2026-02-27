"use client";

import {
  ResizableHandle,
  ResizablePanel,
  ResizableGroup,
} from "@/components/ui/resizable";
import { ProblemDescription } from "./problem-description";
import { MonacoWrapper } from "./monaco-editor";

export default function ProblemWorkspace() {
  return (
    <div className="size-full">
      <ResizableGroup
        orientation="horizontal"
        className="w-full rounded-none border-none"
      >
        <ResizablePanel defaultSize={40} minSize={20}>
          <ProblemDescription />
        </ResizablePanel>

        <ResizableHandle withHandle className="bg-border hover:bg-orange-500/50 transition-colors w-1.5" />

        <ResizablePanel defaultSize={60} minSize={30}>
          <ResizableGroup orientation="vertical">
            <ResizablePanel defaultSize={70} minSize={20}>
              <MonacoWrapper />
            </ResizablePanel>
            <ResizableHandle withHandle className="bg-border hover:bg-orange-500/50 transition-colors h-1.5" />
          </ResizableGroup>
        </ResizablePanel>
      </ResizableGroup>
    </div>
  );
}
