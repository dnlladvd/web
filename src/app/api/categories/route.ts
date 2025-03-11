import { query } from "@/lib/db/mysql";
import { NextRequest, NextResponse } from "next/server";
import { v4 as uuidv4 } from "uuid";

export async function GET() {
  try {
    const categories = await query(
      "SELECT * FROM categories ORDER BY name ASC",
      [],
    );
    return NextResponse.json(categories);
  } catch (error: any) {
    console.error("Error fetching categories:", error);
    return NextResponse.json(
      { error: error.message || "Failed to fetch categories" },
      { status: 500 },
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const { name, description } = await request.json();

    if (!name) {
      return NextResponse.json(
        { error: "Category name is required" },
        { status: 400 },
      );
    }

    const id = uuidv4();
    await query(
      "INSERT INTO categories (id, name, description) VALUES (?, ?, ?)",
      [id, name, description || null],
    );

    const categories = await query("SELECT * FROM categories WHERE id = ?", [
      id,
    ]);
    return NextResponse.json(categories[0], { status: 201 });
  } catch (error: any) {
    console.error("Error creating category:", error);
    return NextResponse.json(
      { error: error.message || "Failed to create category" },
      { status: 500 },
    );
  }
}
