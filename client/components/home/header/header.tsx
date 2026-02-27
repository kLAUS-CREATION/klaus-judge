"use client";

import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {  Bell } from "lucide-react";
import { Search } from "./search";
import { ThemeToggle } from "./theme-toggle";
import { ProfileDropdown } from "./profile-dropdown";
import { Button } from "@/components/ui/button";
import { HomeSidebarLinks } from "@/constants/home-sidebar-links";
import Logo from "@/components/shared/logo";


export function Header() {
  const pathname = usePathname();

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container mx-auto flex h-14 items-center justify-between">

        <div className="flex items-center gap-6">
          <Logo />

          <nav className="hidden md:flex items-center space-x-1 text-sm font-medium">
            {HomeSidebarLinks.map((item) => (
              <Link
                key={item.link}
                href={item.link}
                className={`transition-colors hover:text-foreground/80 px-3 py-2 rounded-md ${
                  pathname === item.link
                  ? "text-foreground font-semibold  rounded-none"
                  : "text-foreground/60"
                }`}
              >
                {item.name}
              </Link>
            ))}
          </nav>
        </div>

        <div className="flex items-center gap-3">
          <Search />

          <div className="flex items-center border-l ml-2 pl-4 gap-1">
            <Button variant="ghost" size="icon" className="relative text-muted-foreground">
                <Bell className="h-5 w-5" />
                <span className="absolute top-2 right-2.5 h-2 w-2 rounded-full bg-red-600 border-2 border-background" />
            </Button>


            <ThemeToggle />
            <ProfileDropdown />
          </div>
        </div>
      </div>
    </header>
  );
}
