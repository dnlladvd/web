"use client";

import { useEffect, useState } from "react";
import LowStockAlerts from "./LowStockAlerts";
import { useRouter } from "next/navigation";

interface LowStockItem {
  id: string;
  name: string;
  currentStock: number;
  minThreshold: number;
  category: string;
}

export default function LowStockAlertsWrapper() {
  const router = useRouter();
  const [items, setItems] = useState<LowStockItem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Use mock data instead of API call to avoid database connection issues
    const mockItems = [
      {
        id: "1",
        name: "Bricks",
        currentStock: 12,
        minThreshold: 15,
        category: "Building Materials",
      },
      {
        id: "2",
        name: "Electrical Wire",
        currentStock: 8,
        minThreshold: 10,
        category: "Electrical",
      },
    ];

    setItems(mockItems);
    setLoading(false);

    // Commented out actual API call until database is properly set up
    /*
    const fetchLowStockItems = async () => {
      try {
        const response = await fetch("/api/inventory/low-stock");
        if (response.ok) {
          const data = await response.json();
          // Transform the data to match the LowStockItem interface
          const formattedItems = data.map((item: any) => ({
            id: item.id,
            name: item.name,
            currentStock: item.quantity,
            minThreshold: item.min_threshold,
            category: item.category_name || "Uncategorized",
          }));
          setItems(formattedItems);
        }
      } catch (error) {
        console.error("Error fetching low stock items:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchLowStockItems();
    */
  }, []);

  const handleProcurementNavigate = () => {
    router.push("/procurement");
  };

  if (loading) {
    return (
      <div className="w-full h-full bg-white overflow-hidden">Loading...</div>
    );
  }

  return (
    <LowStockAlerts
      items={items}
      onProcurementNavigate={handleProcurementNavigate}
    />
  );
}
