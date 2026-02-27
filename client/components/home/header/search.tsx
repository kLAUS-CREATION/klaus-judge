import React from "react";
import { SearchIcon } from "lucide-react";
import { Input } from "@/components/ui/input";

export const Search = () => {
  return (
    <div className="relative group hidden md:block">
      <SearchIcon className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground group-focus-within:text-primary transition-colors" />
      <Input
        type="search"
        placeholder="Search..."
        className="w-64 pl-9 bg-muted/50 border-transparent focus-visible:ring-primary focus-visible:bg-background transition-all"
      />
      <div className="absolute right-2 top-2 hidden lg:flex items-center gap-1 pointer-events-none">
        <kbd className="h-5 select-none items-center gap-1 rounded border bg-muted px-1.5 font-mono text-[10px] font-medium text-muted-foreground opacity-100">
          <span className="text-xs">⌘</span>K
        </kbd>
      </div>
    </div>
  );
};
