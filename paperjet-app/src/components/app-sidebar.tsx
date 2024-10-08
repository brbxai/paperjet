"use client";

import {
  Box,
  FileText,
  Frame,
  LifeBuoy,
  Map,
  PieChart,
  Send,
  SendIcon,
  Settings2,
  User,
} from "lucide-react";

import { NavMain } from "@/components/nav-main";
import { NavSecondary } from "@/components/nav-secondary";
import { NavUser } from "@/components/nav-user";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarItem,
  SidebarLabel,
} from "@/components/ui/sidebar";
import Link from "next/link";
import { CUSTOM_TABLES_ROUTE, CUSTOMERS_ROUTE, INVOICES_ROUTE, ITEMS_ROUTE } from "@/lib/config/routes";
const data = {
  user: {
    name: "Daan",
    email: "daan@brbx.ai",
  },
  navMain: [
    {
      title: "Customers",
      url: CUSTOMERS_ROUTE,
      icon: User,
    },
    {
      title: "Items",
      url: ITEMS_ROUTE,
      icon: Box,
    },
    {
      title: "Invoices",
      url: INVOICES_ROUTE,
      icon: FileText,
    },
    {
      title: "Settings",
      url: "#",
      icon: Settings2,
      items: [
        {
          title: "General",
          url: "#",
        },
        {
          title: "Users",
          url: "#",
        },
        {
          title: "Custom tables",
          url: CUSTOM_TABLES_ROUTE,
        }
      ],
    },
  ],

  navSecondary: [
    {
      title: "Support",
      url: "#",
      icon: LifeBuoy,
    },
    {
      title: "Feedback",
      url: "#",
      icon: Send,
    },
  ],
  projects: [
    {
      name: "Design Engineering",
      url: "#",
      icon: Frame,
    },
    {
      name: "Sales & Marketing",
      url: "#",
      icon: PieChart,
    },
    {
      name: "Travel",
      url: "#",
      icon: Map,
    },
  ],
};

export function AppSidebar({}) {
  return (
    <Sidebar>
      <SidebarHeader>
        <Link href="/">
          <div className="flex items-center gap-1.5 overflow-hidden px-2 py-1.5 text-left text-sm transition-all">
            <div className="flex h-5 w-5 items-center justify-center rounded-sm">
              <SendIcon className="h-3.5 w-3.5 shrink-0" />
            </div>
            <div className="line-clamp-1 flex-1 pr-2 font-medium">Paperjet</div>
          </div>
        </Link>
      </SidebarHeader>
      <SidebarContent>
        <SidebarItem>
          <SidebarLabel>Invoicing</SidebarLabel>
          <NavMain items={data.navMain} />
        </SidebarItem>
        <SidebarItem>
          <SidebarLabel>Custom records</SidebarLabel>
          <p className="text-xs ml-4 italic">Coming soon</p>
        </SidebarItem>
        <SidebarItem className="mt-auto">
          <SidebarLabel>Help</SidebarLabel>
          <NavSecondary items={data.navSecondary} />
        </SidebarItem>
      </SidebarContent>
      <SidebarFooter>
        <NavUser user={data.user} />
      </SidebarFooter>
    </Sidebar>
  );
}
