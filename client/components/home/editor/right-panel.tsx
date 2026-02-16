"use client";

import React from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { MonacoWrapper } from "./monaco-editor";
import { Code2, Lightbulb, BarChart3 } from "lucide-react";

export const RightPanel = () => {
  return (
    <Tabs defaultValue="editor" className="h-full flex flex-col">
      <div className="h-10 border-b bg-muted/30 px-4 flex items-center justify-between">
        <TabsList className="bg-transparent h-full p-0 gap-4">
          <TabsTrigger value="editor" className="tab-trigger">
            <Code2 className="w-4 h-4 mr-2" /> Code
          </TabsTrigger>
          <TabsTrigger value="solution" className="tab-trigger">
            <Lightbulb className="w-4 h-4 mr-2" /> Solution
          </TabsTrigger>
          <TabsTrigger value="results" className="tab-trigger">
            <BarChart3 className="w-4 h-4 mr-2" /> Results
          </TabsTrigger>
        </TabsList>
      </div>

      <div className="flex-1 relative overflow-hidden">
        <TabsContent value="editor" className="h-full m-0 p-0">
          <MonacoWrapper />
        </TabsContent>

        <TabsContent value="solution" className="h-full m-0 bg-background flex items-center justify-center">
          <div className="text-center space-y-2">
             <div className="text-4xl">🚧</div>
             <p className="font-semibold text-muted-foreground">No official solution available yet.</p>
             <p className="text-xs text-muted-foreground/60">Check the community discussion for hints!</p>
          </div>
        </TabsContent>

        <TabsContent value="results" className="h-full m-0 p-8 bg-zinc-50 dark:bg-zinc-950 flex flex-col items-center justify-center text-muted-foreground italic">
            <p>Run your code to see results and performance benchmarks.</p>
        </TabsContent>
      </div>
    </Tabs>
  );
};
