import React from "react";
import DashboardHeader from "@/components/dashboard/DashboardHeader";
import StockSummaryWrapper from "@/components/dashboard/StockSummaryWrapper";
import LowStockAlertsWrapper from "@/components/dashboard/LowStockAlertsWrapper";
import InventoryTableWrapper from "@/components/dashboard/InventoryTableWrapper";
import SideNavigation from "@/components/dashboard/SideNavigation";
import RecentActivityWrapper from "@/components/dashboard/RecentActivityWrapper";

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
                <StockSummaryWrapper />
              </section>

              {/* Two Column Layout for Alerts and Recent Activity */}
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
                {/* Low Stock Alerts */}
                <div className="lg:col-span-1">
                  <LowStockAlertsWrapper />
                </div>

                {/* Recent Activity */}
                <div className="lg:col-span-2">
                  <RecentActivityWrapper />
                </div>
              </div>

              {/* Inventory Table */}
              <section>
                <InventoryTableWrapper />
              </section>
            </div>
          </main>
        </div>
      </div>
    </div>
  );
}
