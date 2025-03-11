"use client";

import { useEffect, useState } from "react";
import InventoryTable from "./InventoryTable";
import { useRouter } from "next/navigation";

interface InventoryItem {
  id: string;
  name: string;
  category: string;
  quantity: number;
  unit: string;
  status: "In Stock" | "Low Stock" | "Out of Stock";
  lastUpdated: string;
}

export default function InventoryTableWrapper() {
  const [items, setItems] = useState<InventoryItem[]>([]);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    // Use mock data instead of API call to avoid database connection issues
    const mockItems = [
      {
        id: "1",
        name: "Cement",
        category: "Building Materials",
        quantity: 150,
        unit: "bags",
        status: "In Stock",
        lastUpdated: new Date().toLocaleDateString(),
      },
      {
        id: "2",
        name: "Steel Rebar",
        category: "Structural Materials",
        quantity: 75,
        unit: "pcs",
        status: "In Stock",
        lastUpdated: new Date().toLocaleDateString(),
      },
      {
        id: "3",
        name: "Bricks",
        category: "Building Materials",
        quantity: 12,
        unit: "pallets",
        status: "Low Stock",
        lastUpdated: new Date().toLocaleDateString(),
      },
    ];

    setItems(mockItems);
    setLoading(false);

    // Commented out actual API call until database is properly set up
    /*
    const fetchInventoryItems = async () => {
      try {
        const response = await fetch("/api/inventory/items");
        if (response.ok) {
          const data = await response.json();
          // Transform the data to match the InventoryItem interface
          const formattedItems = data.map((item: any) => ({
            id: item.id,
            name: item.name,
            category: item.category_name || "Uncategorized",
            quantity: item.quantity,
            unit: item.unit,
            status: item.status,
            lastUpdated: new Date(item.updated_at).toLocaleDateString(),
          }));
          setItems(formattedItems);
        }
      } catch (error) {
        console.error("Error fetching inventory items:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchInventoryItems();
    */
  }, []);

  const handleViewItem = (id: string) => {
    // Navigate to item details page
    router.push(`/inventory/items/${id}`);
  };

  const handleEditItem = (id: string) => {
    // Navigate to edit item page
    router.push(`/inventory/items/${id}/edit`);
  };

  const handleDeleteItem = async (id: string) => {
    if (confirm("Are you sure you want to delete this item?")) {
      try {
        const response = await fetch(`/api/inventory/items/${id}`, {
          method: "DELETE",
        });

        if (response.ok) {
          // Remove the item from the state
          setItems(items.filter((item) => item.id !== id));
          alert("Item deleted successfully");
        } else {
          const error = await response.json();
          alert(error.error || "Failed to delete item");
        }
      } catch (error) {
        console.error("Error deleting item:", error);
        alert("An error occurred while deleting the item");
      }
    }
  };

  if (loading) {
    return (
      <div className="w-full bg-white rounded-lg shadow p-4">Loading...</div>
    );
  }

  return (
    <InventoryTable
      items={items}
      onViewItem={handleViewItem}
      onEditItem={handleEditItem}
      onDeleteItem={handleDeleteItem}
    />
  );
}
