import React from 'react';
import Logo from '../shared/logo';
import { Menu } from 'lucide-react';
import { Button } from '../ui/button';
import Link from 'next/link';

const Navbar = () => {
  return (
    <nav className="fixed top-0 w-full z-50 border-b border-border bg-background/80 backdrop-blur-md ">
      <div className=" container mx-auto">
        <div className="flex justify-between items-center h-16">
          <Logo />

          <div className="hidden md:flex items-center space-x-8">
            <a href="#features" className="text-sm font-medium text-foreground-secondary hover:text-primary transition-colors">Features</a>
            <a href="#problems" className="text-sm font-medium text-foreground-secondary hover:text-primary transition-colors">Problems</a>
            <a href="#leaderboard" className="text-sm font-medium text-foreground-secondary hover:text-primary transition-colors">Leaderboard</a>

            <Button variant={"btn"}>
                <Link href={'/auth/sign-up'}>Sign Up </Link>
            </Button>
          </div>

          <div className="md:hidden">
            <Menu className="w-6 h-6 text-foreground" />
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
