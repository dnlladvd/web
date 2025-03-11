import { query } from "@/lib/db/mysql";
import { NextResponse } from "next/server";

export async function GET() {
  try {
    // Get total items count
    const totalItemsResult = await query(
      "SELECT COUNT(*) as count FROM inventory_items",
      [],
    );
    const totalItems = (totalItemsResult as any[])[0].count;

    // Get in stock items count
    const inStockItemsResult = await query(
      "SELECT COUNT(*) as count FROM inventory_items WHERE status = 'In Stock'",
      [],
    );
    const inStockItems = (inStockItemsResult as any[])[0].count;

    // Get low stock items count
    const lowStockItemsResult = await query(
      "SELECT COUNT(*) as count FROM inventory_items WHERE status = 'Low Stock'",
      [],
    );
    const lowStockItems = (lowStockItemsResult as any[])[0].count;

    // Get out of stock items count
    const outOfStockItemsResult = await query(
      "SELECT COUNT(*) as count FROM inventory_items WHERE status = 'Out of Stock'",
      [],
    );
    const outOfStockItems = (outOfStockItemsResult as any[])[0].count;

    // Get recent transactions
    const recentTransactions = await query(
      `SELECT t.*, i.name as item_name, i.unit, u.full_name as user_name
       FROM inventory_transactions t
       JOIN inventory_items i ON t.item_id = i.id
       LEFT JOIN users u ON t.created_by = u.id
       ORDER BY t.created_at DESC LIMIT 5`,
      [],
    );

    // Get low stock items
    const lowStockItems = await query(
      `SELECT i.*, c.name as category_name 
       FROM inventory_items i
       LEFT JOIN categories c ON i.category_id = c.id
       WHERE i.quantity <= i.min_threshold AND i.quantity > 0
       ORDER BY i.quantity / i.min_threshold ASC
       LIMIT 5`,
      [],
    );

    return NextResponse.json({
      totalItems,
      inStockItems,
      lowStockItems,
      outOfStockItems,
      recentTransactions,
      lowStockItems,
    });
  } catch (error: any) {
    console.error("Error fetching dashboard summary:", error);
    return NextResponse.json(
      { error: error.message || "Failed to fetch dashboard summary" },
      { status: 500 },
    );
  }
}
