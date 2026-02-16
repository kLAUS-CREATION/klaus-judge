import React from 'react';
import Logo from '../shared/logo';
import { Github, Twitter } from 'lucide-react';

const Footer = () => {
  return (
    <footer className="border-t border-border py-12 bg-background">
      <div className="container  mx-auto px-4 flex flex-col md:flex-row justify-between items-center gap-8">
       <Logo />

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
