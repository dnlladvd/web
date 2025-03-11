import { query } from "@/lib/db/mysql";
import { NextRequest, NextResponse } from "next/server";
import { v4 as uuidv4 } from "uuid";

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const category = searchParams.get("category");
    const status = searchParams.get("status");
    const search = searchParams.get("search");

    let sql = `
      SELECT i.*, c.name as category_name 
      FROM inventory_items i
      LEFT JOIN categories c ON i.category_id = c.id
      WHERE 1=1
    `;
    const params: any[] = [];

    if (category) {
      sql += ` AND i.category_id = ?`;
      params.push(category);
    }

    if (status) {
      sql += ` AND i.status = ?`;
      params.push(status);
    }

    if (search) {
      sql += ` AND (i.name LIKE ? OR i.description LIKE ?)`;
      params.push(`%${search}%`, `%${search}%`);
    }

    sql += ` ORDER BY i.name ASC`;

    const items = await query(sql, params);
    return NextResponse.json(items);
  } catch (error: any) {
    console.error("Error fetching inventory items:", error);
    return NextResponse.json(
      { error: error.message || "Failed to fetch inventory items" },
      { status: 500 },
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const {
      name,
      description,
      category_id,
      quantity,
      unit,
      min_threshold,
      created_by,
    } = await request.json();

    if (!name || !unit) {
      return NextResponse.json(
        { error: "Name and unit are required" },
        { status: 400 },
      );
    }

    const id = uuidv4();
    const status =
      quantity <= 0
        ? "Out of Stock"
        : quantity <= min_threshold
          ? "Low Stock"
          : "In Stock";

    await query(
      "INSERT INTO inventory_items (id, name, description, category_id, quantity, unit, min_threshold, status, created_by) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)",
      [
        id,
        name,
        description || null,
        category_id || null,
        quantity || 0,
        unit,
        min_threshold || 0,
        status,
        created_by || null,
      ],
    );

    const items = await query("SELECT * FROM inventory_items WHERE id = ?", [
      id,
    ]);
    return NextResponse.json(items[0], { status: 201 });
  } catch (error: any) {
    console.error("Error creating inventory item:", error);
    return NextResponse.json(
      { error: error.message || "Failed to create inventory item" },
      { status: 500 },
    );
  }
}
