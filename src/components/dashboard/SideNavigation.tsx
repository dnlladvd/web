"use client";

import React from "react";
import Link from "next/link";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import {
  LayoutDashboard,
  Package,
  ShoppingCart,
  BarChart3,
  Settings,
  HelpCircle,
  LogOut,
} from "lucide-react";
import { useAuth } from "../auth/auth-provider";

interface SideNavigationProps {
  className?: string;
  activePath?: string;
}

const navigationItems = [
  {
    title: "Dashboard",
    icon: <LayoutDashboard className="h-5 w-5" />,
    href: "/",
  },
  {
    title: "Inventory",
    icon: <Package className="h-5 w-5" />,
    href: "/inventory",
  },
  {
    title: "Procurement",
    icon: <ShoppingCart className="h-5 w-5" />,
    href: "/procurement",
  },
  {
    title: "Reports",
    icon: <BarChart3 className="h-5 w-5" />,
    href: "/reports",
  },
  {
    title: "Settings",
    icon: <Settings className="h-5 w-5" />,
    href: "/settings",
  },
];

const SideNavigation = ({
  className,
  activePath = "/",
}: SideNavigationProps) => {
  const { signOut, user } = useAuth();

  return (
    <div
      className={cn(
        "flex h-full w-64 flex-col bg-background border-r",
        className,
      )}
    >
      <div className="flex flex-col flex-1 p-4">
        <div className="mb-8 px-2">
          <h2 className="text-xl font-bold">Construction IMS</h2>
          <p className="text-sm text-muted-foreground">Inventory Management</p>
        </div>

        <nav className="space-y-1 flex-1">
          {navigationItems.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "flex items-center gap-3 rounded-md px-3 py-2 text-sm font-medium transition-colors",
                activePath === item.href
                  ? "bg-primary/10 text-primary"
                  : "text-muted-foreground hover:bg-muted hover:text-foreground",
              )}
            >
              {item.icon}
              {item.title}
            </Link>
          ))}
        </nav>

        <div className="mt-auto space-y-2 pt-6">
          <Button variant="ghost" className="w-full justify-start gap-3">
            <HelpCircle className="h-5 w-5" />
            Help & Support
          </Button>
          <Button
            variant="ghost"
            className="w-full justify-start gap-3 text-muted-foreground"
            onClick={signOut}
          >
            <LogOut className="h-5 w-5" />
            Logout
          </Button>
        </div>
      </div>
    </div>
  );
};

export default SideNavigation;
