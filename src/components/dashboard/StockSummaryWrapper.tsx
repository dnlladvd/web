"use client";

import { useEffect, useState } from "react";
import StockSummary from "./StockSummary";

export default function StockSummaryWrapper() {
  const [summaryData, setSummaryData] = useState({
    totalItems: 0,
    inStockItems: 0,
    lowStockItems: 0,
    outOfStockItems: 0,
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Use mock data instead of API call to avoid database connection issues
    const mockData = {
      totalItems: 7,
      inStockItems: 4,
      lowStockItems: 2,
      outOfStockItems: 1,
    };

    setSummaryData(mockData);
    setLoading(false);

    // Commented out actual API call until database is properly set up
    /*
    const fetchSummaryData = async () => {
      try {
        const response = await fetch("/api/dashboard/summary");
        if (response.ok) {
          const data = await response.json();
          setSummaryData({
            totalItems: data.totalItems || 0,
            inStockItems: data.inStockItems || 0,
            lowStockItems: data.lowStockItems || 0,
            outOfStockItems: data.outOfStockItems || 0,
          });
        }
      } catch (error) {
        console.error("Error fetching summary data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchSummaryData();
    */
  }, []);

  if (loading) {
    return (
      <div className="w-full bg-background p-4 rounded-lg">Loading...</div>
    );
  }

  return (
    <StockSummary
      totalItems={summaryData.totalItems}
      inStockItems={summaryData.inStockItems}
      lowStockItems={summaryData.lowStockItems}
      outOfStockItems={summaryData.outOfStockItems}
    />
  );
}
