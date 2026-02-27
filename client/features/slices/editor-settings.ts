import { create } from "zustand";

interface CodeState {
  language: string;
  code: string;
  theme: string;
  setLanguage: (lang: string) => void;
  setCode: (code: string) => void;
}

const getDefaultCode = (language: string) => {
  switch (language) {
    case "python":
      return `def solution():\n    # Write your code here\n    pass`;
    case "cpp":
      return `#include <iostream>\n#include <vector>\nusing namespace std;\n\nint main() {\n    // Write your code here\n    return 0;\n}`;
    case "javascript":
      return `function solution() {\n    // Write your code here\n}`;
    default:
      return `// Write your code here`;
  }
};

export const useCodeStore = create<CodeState>((set, get) => ({
  language: "python",
  code: getDefaultCode("python"),
  theme: "vs-dark",
  setLanguage: (language) => set({ 
    language, 
    code: getDefaultCode(language) 
  }),
  setCode: (code) => set({ code }),
}));
