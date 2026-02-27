"use client";

import React, { useState } from "react";
import Editor from "@monaco-editor/react";
import { useTheme } from "@/features/slices/theme";
import { useCodeStore } from "@/features/slices/editor-settings";
import { Play, Send, Terminal, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { LanguageSelector } from "./language-selector";
import { useSubmitSolution } from "@/lib/hooks/use-submissions";
import { useParams } from "next/navigation";
import {
  ResizableHandle,
  ResizablePanel,
  ResizableGroup,
} from "@/components/ui/resizable";

export const MonacoWrapper = () => {
  const isDarkMode = useTheme((state) => state.isDarkMode);
  const { language, code, setCode } = useCodeStore();
  const { mutate: submitSolution, isPending } = useSubmitSolution();
  const params = useParams();
  const [output, setOutput] = useState<string[]>([
    "Ready for execution...",
    "Success: Compiled successfully in 42ms."
  ]);

  const handleSubmit = () => {
    const problemSlug = params.problemId as string;
    
    if (!code.trim()) {
      setOutput(prev => [...prev, "Error: Please write some code before submitting."]);
      return;
    }

    setOutput(prev => [...prev, "Submitting solution..."]);
    
    submitSolution({
      slug: problemSlug,
      code: code,
      language: language
    });
  };

  const handleRun = () => {
    setOutput(prev => [...prev, "Running code locally...", "Feature coming soon!"]);
  };

  return (
    <div className="flex flex-col h-full overflow-hidden">
      <div className="h-10 flex items-center justify-between px-4 border-b">
        <LanguageSelector />
        <Button variant="ghost" size="sm" className="text-zinc-500 text-[10px] uppercase font-bold tracking-widest">
          Auto-Save
        </Button>
      </div>

      <ResizableGroup orientation="vertical"  className="flex-1 min-h-0">

        <ResizablePanel defaultSize={70} minSize={20} className="relative flex flex-col min-h-0">
          <div className="flex-1">
            <Editor
              height="100%"
              language={language}
              theme={isDarkMode ? "vs-dark" : "light"}
              value={code}
              onChange={(value) => setCode(value || "")}
              options={{
                minimap: { enabled: false },
                fontSize: 16,
                padding: { top: 20 },
                lineNumbers: "on",
                scrollBeyondLastLine: false,
                cursorSmoothCaretAnimation: "on",
                fontFamily: "'Fira Code', monospace",
              }}
            />
          </div>

        </ResizablePanel>

        <ResizableHandle withHandle className="h-1 bg-zinc-800 hover:bg-orange-500/50 transition-colors cursor-row-resize" />

        <ResizablePanel defaultSize={30} minSize={10} className=" min-h-0">
            <div className="flex items-center gap-2 p-1.5 b border border-white/10  shadow-2xl">
              <Button
                size="sm"
                className="h-8 px-5 text-white"
                onClick={handleSubmit}
                disabled={isPending}
              >
                {isPending ? (
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                ) : (
                  <Send className="w-4 h-4 mr-2" />
                )}
                Submit
              </Button>
              <Button
                variant="outline"
                size="sm"
                className="h-8 px-5"
                onClick={handleRun}
              >
                <Play className="w-4 h-4 mr-2" /> Run
              </Button>
            </div>
          <div className="h-full flex flex-col">
            <div className="flex items-center gap-2 px-4 h-9 border-b border-zinc-800/50 bg-zinc-900/20">
              <Terminal className="w-3.5 h-3.5 text-zinc-600" />
              <span className="text-[10px] font-black uppercase tracking-[0.2em] text-zinc-500">
                Console Output
              </span>
            </div>

            <div className="flex-1 p-5 font-mono text-sm overflow-auto text-zinc-400">
              <div className="space-y-2">
                {output.map((line, index) => (
                  <div key={index} className="flex gap-4">
                    <span className="text-zinc-700 select-none">{index + 1}</span>
                    <p className={`${
                      line.includes('Error:') ? 'text-red-400' : 
                      line.includes('Success:') ? 'text-emerald-500' :
                      line.includes('Submitting') ? 'text-blue-400' :
                      'text-zinc-500 italic'
                    }`}>
                      {line}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </ResizablePanel>

      </ResizableGroup>
    </div>
  );
};
