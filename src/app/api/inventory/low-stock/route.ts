import { query } from "@/lib/db/mysql";
import { NextResponse } from "next/server";

export async function GET() {
  try {
    const items = await query(
      `SELECT i.*, c.name as category_name 
       FROM inventory_items i
       LEFT JOIN categories c ON i.category_id = c.id
       WHERE i.quantity <= i.min_threshold AND i.quantity > 0
       ORDER BY i.quantity / i.min_threshold ASC`,
      [],
    );

    return NextResponse.json(items);
  } catch (error: any) {
    console.error("Error fetching low stock items:", error);
    return NextResponse.json(
      { error: error.message || "Failed to fetch low stock items" },
      { status: 500 },
    );
  }
}
