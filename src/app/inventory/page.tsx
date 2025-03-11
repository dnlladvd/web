import React from "react";
import DashboardHeader from "@/components/dashboard/DashboardHeader";
import SideNavigation from "@/components/dashboard/SideNavigation";
import InventoryTable from "@/components/dashboard/InventoryTable";

export default function InventoryPage() {
  return (
    <div className="min-h-screen bg-background">
      <div className="flex h-screen overflow-hidden">
        {/* Side Navigation */}
        <SideNavigation activePath="/inventory" />

        {/* Main Content */}
        <div className="flex-1 flex flex-col overflow-hidden">
          {/* Header */}
          <DashboardHeader username="Admin" />

          {/* Main Content */}
          <main className="flex-1 overflow-y-auto p-6">
            <div className="container mx-auto">
              <h1 className="text-2xl font-bold mb-6">Inventory Management</h1>

              {/* Inventory Table */}
              <section>
                <InventoryTable />
              </section>
            </div>
          </main>
        </div>
      </div>
    </div>
  );
}
