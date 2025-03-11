import { query } from "@/lib/db/mysql";
import { NextRequest, NextResponse } from "next/server";

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } },
) {
  try {
    const id = params.id;
    const categories = await query("SELECT * FROM categories WHERE id = ?", [
      id,
    ]);

    if ((categories as any[]).length === 0) {
      return NextResponse.json(
        { error: "Category not found" },
        { status: 404 },
      );
    }

    return NextResponse.json(categories[0]);
  } catch (error: any) {
    console.error("Error fetching category:", error);
    return NextResponse.json(
      { error: error.message || "Failed to fetch category" },
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
    const { name, description } = await request.json();

    // Check if category exists
    const categories = await query("SELECT * FROM categories WHERE id = ?", [
      id,
    ]);
    if ((categories as any[]).length === 0) {
      return NextResponse.json(
        { error: "Category not found" },
        { status: 404 },
      );
    }

    // Update category
    await query(
      "UPDATE categories SET name = ?, description = ?, updated_at = NOW() WHERE id = ?",
      [name, description, id],
    );

    // Get updated category
    const updatedCategories = await query(
      "SELECT * FROM categories WHERE id = ?",
      [id],
    );

    return NextResponse.json(updatedCategories[0]);
  } catch (error: any) {
    console.error("Error updating category:", error);
    return NextResponse.json(
      { error: error.message || "Failed to update category" },
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

    // Check if category exists
    const categories = await query("SELECT * FROM categories WHERE id = ?", [
      id,
    ]);
    if ((categories as any[]).length === 0) {
      return NextResponse.json(
        { error: "Category not found" },
        { status: 404 },
      );
    }

    // Check if category is in use
    const items = await query(
      "SELECT COUNT(*) as count FROM inventory_items WHERE category_id = ?",
      [id],
    );
    if ((items as any[])[0].count > 0) {
      return NextResponse.json(
        { error: "Cannot delete category that is in use by inventory items" },
        { status: 400 },
      );
    }

    // Delete category
    await query("DELETE FROM categories WHERE id = ?", [id]);

    return NextResponse.json({ success: true });
  } catch (error: any) {
    console.error("Error deleting category:", error);
    return NextResponse.json(
      { error: error.message || "Failed to delete category" },
      { status: 500 },
    );
  }
}
