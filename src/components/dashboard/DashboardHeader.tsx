"use client";

import { ThemeSwitcher } from "@/components/theme-switcher";
import { Bell, HelpCircle, Search } from "lucide-react";
import { Button } from "../ui/button";
import { Input } from "../ui/input";

interface DashboardHeaderProps {
  username?: string;
}

const DashboardHeader = ({ username = "Admin" }: DashboardHeaderProps) => {
  return (
    <header className="h-16 border-b bg-background flex items-center justify-between px-6 sticky top-0 z-10">
      <div className="flex items-center gap-4">
        <h1 className="text-xl font-bold hidden md:block">Construction IMS</h1>
        <div className="relative max-w-md hidden md:block">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            type="search"
            placeholder="Search inventory..."
            className="pl-8 w-[250px] bg-background"
          />
        </div>
      </div>

      <div className="flex items-center space-x-3">
        <Button variant="ghost" size="icon" className="relative">
          <Bell className="h-5 w-5 text-muted-foreground" />
          <span className="absolute top-1 right-1 h-2 w-2 rounded-full bg-red-500"></span>
        </Button>
        <Button variant="ghost" size="icon">
          <HelpCircle className="h-5 w-5 text-muted-foreground" />
        </Button>
        <ThemeSwitcher />
        <div className="flex items-center gap-2">
          <span className="text-sm font-medium hidden sm:inline-block">
            Welcome, {username}
          </span>
          <div className="h-8 w-8 rounded-full bg-primary/10 text-primary flex items-center justify-center font-medium">
            {username.charAt(0)}
          </div>
        </div>
      </div>
    </header>
  );
};

export default DashboardHeader;
