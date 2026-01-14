"use client"

import * as React from "react"
import {
  BookOpen,
  Bot,
  Frame,
  GalleryVerticalEnd,
  Map,
  PieChart,
  Settings2,
  SquareTerminal,
} from "lucide-react"

import { NavMain } from "@/components/nav-main"
import { NavProjects } from "@/components/nav-projects"
import { NavUser } from "@/components/nav-user"
import { TeamSwitcher } from "@/components/team-switcher"
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarRail,
} from "@/components/ui/sidebar"

// This is sample data.
const data = {
  user: {
    name: "Admin User",
    email: "admin@klausjudge.com",
    avatar: "/avatars/admin.jpg",
  },
  teams: [
    {
      name: "Klaus Judge",
      logo: GalleryVerticalEnd,
      plan: "Platform Admin",
    },
  ],
  navMain: [
    {
      title: "Dashboard",
      url: "/admin/dashboard",
      icon: SquareTerminal,
      isActive: true,
    },
    {
      title: "Problem Set",
      url: "#",
      icon: BookOpen,
      items: [
        {
          title: "All Problems",
          url: "/admin/problems",
        },
        {
          title: "Create Problem",
          url: "/admin/problems/create",
        },
        {
          title: "Tags & Categories",
          url: "/admin/problems/tags",
        },
      ],
    },
    {
      title: "Users",
      url: "/admin/users",
      icon: Bot,
      items: [
        {
          title: "User List",
          url: "/admin/users",
        },
        {
          title: "Roles & Permissions",
          url: "/admin/users/roles",
        },
      ],
    },
    {
      title: "Contests",
      url: "/admin/contests",
      icon: PieChart,
      items: [
        {
          title: "All Contests",
          url: "/admin/contests",
        },
        {
          title: "Create Contest",
          url: "/admin/contests/create",
        },
      ],
    },
  ],
  projects: [
    {
      name: "Submissions",
      url: "/admin/submissions",
      icon: Frame,
    },
    {
      name: "System Settings",
      url: "/admin/settings",
      icon: Settings2,
    },
    {
      name: "Analytics",
      url: "#",
      icon: Map,
    },
  ],
}

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  return (
    <Sidebar collapsible="icon" {...props}>
      <SidebarHeader>
        <TeamSwitcher />
      </SidebarHeader>
      <SidebarContent>
        <NavMain items={data.navMain} />
        <NavProjects projects={data.projects} />
      </SidebarContent>
      <SidebarFooter>
        <NavUser user={data.user} />
      </SidebarFooter>
      <SidebarRail />
    </Sidebar>
  )
}
