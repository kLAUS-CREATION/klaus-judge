import {
  LayoutDashboard,
  Package,
  Tags,
  Store,
  Receipt,
  Wallet,
  LucideIcon,
  ShoppingBag,
  History,
  Users,
  Truck,
  CreditCard,
  MessageCircleCode,
  MessageSquare,
} from "lucide-react";

export interface ISidebarLink {
  name: string;
  link: string;
  icon: LucideIcon;
  roles: ("admin" | "moderator")[];
}

export const sidebarLinks: ISidebarLink[] = [
  {
    name: "Dashboard",
    link: "dashboard",
    icon: LayoutDashboard,
    roles: ["moderator"],
  },
  {
    name: "Store",
    link: "store",
    icon: Store,
    roles: ["admin", "moderator"],
  },
  {
    name: "Shop",
    link: "shop",
    icon: ShoppingBag,
    roles: ["admin", "moderator"],
  },
  {
    name: "Sales History",
    link: "sales",
    icon: History,
    roles: ["moderator", "admin"],
  },
  {
    name: "Products",
    link: "products",
    icon: Package,
    roles: ["admin", "moderator"],
  },
  {
    name: "Categories",
    link: "categories",
    icon: Tags,
    roles: ["moderator", "admin"],
  },

  {
    name: "Customers",
    link: "customers",
    icon: Users,
    roles: ["admin", "moderator"],
  },
  {
    name: "Expenses",
    link: "expenses",
    icon: Receipt,
    roles: ["moderator"],
  },
  {
    name: "Suppliers",
    link: "suppliers",
    icon: Truck,
    roles: ["admin", "moderator"],
  },

  {
    name: "Credits",
    link: "credits",
    icon: CreditCard,
    roles: ["admin", "moderator"],
  },
  {
    name: "Accounts",
    link: "accounts",
    icon: Wallet,
    roles: ["moderator", "admin"],
  },
  {
    name: "Notes",
    link: "notes",
    icon: MessageCircleCode,
    roles: ["moderator"],
  },
  {
    name: "Testimonials",
    link: "testimonials",
    icon: MessageSquare,
    roles: ["moderator"],
  },
  {
    name: "Credit History",
    link: "credits-history",
    icon: History,
    roles: ["admin", "moderator"],
  },
];
