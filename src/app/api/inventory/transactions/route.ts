import { query } from "@/lib/db/mysql";
import { NextRequest, NextResponse } from "next/server";
import { v4 as uuidv4 } from "uuid";

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const itemId = searchParams.get("item_id");
    const limit = searchParams.get("limit") || "50";

    let sql = `
      SELECT t.*, i.name as item_name, i.unit, u.full_name as user_name
      FROM inventory_transactions t
      JOIN inventory_items i ON t.item_id = i.id
      LEFT JOIN users u ON t.created_by = u.id
      WHERE 1=1
    `;
    const params: any[] = [];

    if (itemId) {
      sql += ` AND t.item_id = ?`;
      params.push(itemId);
    }

    sql += ` ORDER BY t.created_at DESC LIMIT ?`;
    params.push(parseInt(limit));

    const transactions = await query(sql, params);
    return NextResponse.json(transactions);
  } catch (error: any) {
    console.error("Error fetching transactions:", error);
    return NextResponse.json(
      { error: error.message || "Failed to fetch transactions" },
      { status: 500 },
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const { item_id, quantity, transaction_type, notes, created_by } =
      await request.json();

    if (!item_id || quantity === undefined || !transaction_type) {
      return NextResponse.json(
        { error: "Item ID, quantity, and transaction type are required" },
        { status: 400 },
      );
    }

    // Get current item quantity
    const items = await query("SELECT * FROM inventory_items WHERE id = ?", [
      item_id,
    ]);
    if ((items as any[]).length === 0) {
      return NextResponse.json(
        { error: "Inventory item not found" },
        { status: 404 },
      );
    }

    const item = (items as any[])[0];
    const previousQuantity = item.quantity;
    let newQuantity = previousQuantity;

    // Calculate new quantity based on transaction type
    if (transaction_type === "Stock In") {
      newQuantity = previousQuantity + quantity;
    } else if (transaction_type === "Stock Out") {
      newQuantity = Math.max(0, previousQuantity - quantity);
    } else if (transaction_type === "Adjustment") {
      newQuantity = quantity;
    }

    // Update item quantity and status
    const status =
      newQuantity <= 0
        ? "Out of Stock"
        : newQuantity <= item.min_threshold
          ? "Low Stock"
          : "In Stock";
    await query(
      "UPDATE inventory_items SET quantity = ?, status = ?, updated_at = NOW() WHERE id = ?",
      [newQuantity, status, item_id],
    );

    // Create transaction record
    const id = uuidv4();
    await query(
      "INSERT INTO inventory_transactions (id, item_id, quantity, previous_quantity, new_quantity, transaction_type, notes, created_by) VALUES (?, ?, ?, ?, ?, ?, ?, ?)",
      [
        id,
        item_id,
        quantity,
        previousQuantity,
        newQuantity,
        transaction_type,
        notes || null,
        created_by || null,
      ],
    );

    const transactions = await query(
      "SELECT * FROM inventory_transactions WHERE id = ?",
      [id],
    );
    return NextResponse.json(transactions[0], { status: 201 });
  } catch (error: any) {
    console.error("Error creating transaction:", error);
    return NextResponse.json(
      { error: error.message || "Failed to create transaction" },
      { status: 500 },
    );
  }
}
