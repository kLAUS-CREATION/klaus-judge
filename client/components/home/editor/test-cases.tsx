"use client";

import React from "react";

export const TestcasePanel = () => {
  return (
    <div className="h-full flex flex-col bg-background">
      <div className="h-10 border-b px-4 flex items-center bg-muted/10">
        <span className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground">Testcases</span>
      </div>
      <div className="flex-1 p-4 space-y-4 overflow-auto">
        <div className="flex gap-2">
           {[1, 2, 3].map(i => (
             <button key={i} className="px-3 py-1 text-xs bg-muted hover:bg-muted/80 rounded font-medium border border-transparent active:border-orange-500">
               Case {i}
             </button>
           ))}
        </div>
        <div className="space-y-3">
           <div className="space-y-1">
             <label className="text-[10px] font-bold text-muted-foreground">nums</label>
             <div className="p-2 bg-muted/50 rounded-md font-mono text-sm">[2, 7, 11, 15]</div>
           </div>
           <div className="space-y-1">
             <label className="text-[10px] font-bold text-muted-foreground">target</label>
             <div className="p-2 bg-muted/50 rounded-md font-mono text-sm">9</div>
           </div>
        </div>
      </div>
    </div>
  );
};
