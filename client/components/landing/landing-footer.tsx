import React from 'react';
import { Code2, Github, Twitter } from 'lucide-react';

const Footer = () => {
  return (
    <footer className="border-t border-border py-12 bg-background">
      <div className="max-w-7xl mx-auto px-4 flex flex-col md:flex-row justify-between items-center gap-8">
        <div className="flex items-center gap-2">
          <Code2 className="w-6 h-6 text-primary" />
          <span className="text-lg font-bold text-foreground">CodeQuest</span>
        </div>

        <div className="flex gap-8 text-sm text-foreground-secondary">
          <a href="#" className="hover:text-primary">Privacy</a>
          <a href="#" className="hover:text-primary">Terms</a>
          <a href="#" className="hover:text-primary">Discord</a>
        </div>

        <div className="flex gap-4">
          <Twitter className="w-5 h-5 text-foreground-quaternary hover:text-primary cursor-pointer" />
          <Github className="w-5 h-5 text-foreground-quaternary hover:text-primary cursor-pointer" />
        </div>
      </div>
      <div className="text-center mt-8 text-xs text-foreground-quaternary">
        © {new Date().getFullYear()} CodeQuest Inc. All rights reserved.
      </div>
    </footer>
  );
};

export default Footer;
