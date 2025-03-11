import React from "react";
import DashboardHeader from "@/components/dashboard/DashboardHeader";
import SideNavigation from "@/components/dashboard/SideNavigation";

export default function ReportsPage() {
  return (
    <div className="min-h-screen bg-background">
      <div className="flex h-screen overflow-hidden">
        {/* Side Navigation */}
        <SideNavigation activePath="/reports" />

        {/* Main Content */}
        <div className="flex-1 flex flex-col overflow-hidden">
          {/* Header */}
          <DashboardHeader username="Admin" />

          {/* Main Content */}
          <main className="flex-1 overflow-y-auto p-6">
            <div className="container mx-auto">
              <h1 className="text-2xl font-bold mb-6">Reports</h1>

              <div className="bg-background rounded-lg border shadow-sm p-6">
                <p className="text-muted-foreground">
                  Reports page content will be implemented here.
                </p>
              </div>
            </div>
          </main>
        </div>
      </div>
    </div>
  );
}
