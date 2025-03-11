import { query } from "@/lib/db/mysql";
import { NextRequest, NextResponse } from "next/server";

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } },
) {
  try {
    const id = params.id;
    const items = await query(
      `SELECT i.*, c.name as category_name 
       FROM inventory_items i
       LEFT JOIN categories c ON i.category_id = c.id
       WHERE i.id = ?`,
      [id],
    );

    if ((items as any[]).length === 0) {
      return NextResponse.json(
        { error: "Inventory item not found" },
        { status: 404 },
      );
    }

    return NextResponse.json(items[0]);
  } catch (error: any) {
    console.error("Error fetching inventory item:", error);
    return NextResponse.json(
      { error: error.message || "Failed to fetch inventory item" },
      { status: 500 },
    );
  }
}

export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } },
) {
  try {
    const id = params.id;
    const { name, description, category_id, quantity, unit, min_threshold } =
      await request.json();

    // Check if item exists
    const items = await query("SELECT * FROM inventory_items WHERE id = ?", [
      id,
    ]);
    if ((items as any[]).length === 0) {
      return NextResponse.json(
        { error: "Inventory item not found" },
        { status: 404 },
      );
    }

    const item = (items as any[])[0];
    const oldQuantity = item.quantity;

    // Update status based on new quantity
    let status = item.status;
    if (quantity !== undefined) {
      status =
        quantity <= 0
          ? "Out of Stock"
          : quantity <= (min_threshold || item.min_threshold)
            ? "Low Stock"
            : "In Stock";
    }

    // Update item
    await query(
      `UPDATE inventory_items 
       SET name = ?, description = ?, category_id = ?, quantity = ?, unit = ?, min_threshold = ?, status = ?, updated_at = NOW()
       WHERE id = ?`,
      [
        name || item.name,
        description !== undefined ? description : item.description,
        category_id !== undefined ? category_id : item.category_id,
        quantity !== undefined ? quantity : item.quantity,
        unit || item.unit,
        min_threshold !== undefined ? min_threshold : item.min_threshold,
        status,
        id,
      ],
    );

    // If quantity changed, create transaction record
    if (quantity !== undefined && quantity !== oldQuantity) {
      const transactionId = require("uuid").v4();
      const transactionType = quantity > oldQuantity ? "Stock In" : "Stock Out";
      const transactionQuantity = Math.abs(quantity - oldQuantity);

      await query(
        `INSERT INTO inventory_transactions 
         (id, item_id, quantity, previous_quantity, new_quantity, transaction_type, created_at)
         VALUES (?, ?, ?, ?, ?, ?, NOW())`,
        [
          transactionId,
          id,
          transactionQuantity,
          oldQuantity,
          quantity,
          transactionType,
        ],
      );
    }

    // Get updated item
    const updatedItems = await query(
      `SELECT i.*, c.name as category_name 
       FROM inventory_items i
       LEFT JOIN categories c ON i.category_id = c.id
       WHERE i.id = ?`,
      [id],
    );

    return NextResponse.json(updatedItems[0]);
  } catch (error: any) {
    console.error("Error updating inventory item:", error);
    return NextResponse.json(
      { error: error.message || "Failed to update inventory item" },
      { status: 500 },
    );
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } },
) {
  try {
    const id = params.id;

    // Check if item exists
    const items = await query("SELECT * FROM inventory_items WHERE id = ?", [
      id,
    ]);
    if ((items as any[]).length === 0) {
      return NextResponse.json(
        { error: "Inventory item not found" },
        { status: 404 },
      );
    }

    // Delete item
    await query("DELETE FROM inventory_items WHERE id = ?", [id]);

    return NextResponse.json({ success: true });
  } catch (error: any) {
    console.error("Error deleting inventory item:", error);
    return NextResponse.json(
      { error: error.message || "Failed to delete inventory item" },
      { status: 500 },
    );
  }
}
