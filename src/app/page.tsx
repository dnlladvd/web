import React from "react";
import DashboardHeader from "@/components/dashboard/DashboardHeader";
import StockSummary from "@/components/dashboard/StockSummary";
import LowStockAlertsWrapper from "@/components/dashboard/LowStockAlertsWrapper";
import InventoryTable from "@/components/dashboard/InventoryTable";
import SideNavigation from "@/components/dashboard/SideNavigation";
import RecentActivity from "@/components/dashboard/RecentActivity";

export default function Home() {
  return (
    <div className="min-h-screen bg-background">
      <div className="flex h-screen overflow-hidden">
        {/* Side Navigation */}
        <SideNavigation activePath="/" />

        {/* Main Content */}
        <div className="flex-1 flex flex-col overflow-hidden">
          {/* Header */}
          <DashboardHeader username="Admin" />

          {/* Main Dashboard Content */}
          <main className="flex-1 overflow-y-auto p-6">
            <div className="container mx-auto">
              <div className="flex justify-between items-center mb-6">
                <h1 className="text-2xl font-bold">Dashboard</h1>
                <a href="/auth/login" className="text-primary hover:underline">
                  Login
                </a>
              </div>

              {/* Stock Summary Cards */}
              <section className="mb-6">
                <StockSummary />
              </section>

              {/* Two Column Layout for Alerts and Recent Activity */}
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
                {/* Low Stock Alerts */}
                <div className="lg:col-span-1">
                  <LowStockAlertsWrapper />
                </div>

                {/* Recent Activity */}
                <div className="lg:col-span-2">
                  <RecentActivity />
                </div>
              </div>

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
