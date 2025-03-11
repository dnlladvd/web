import { query } from "@/lib/db/mysql";
import { NextResponse } from "next/server";
import { v4 as uuidv4 } from "uuid";
import bcrypt from "bcryptjs";

export async function GET() {
  try {
    // Create admin user
    const adminId = uuidv4();
    const salt = await bcrypt.genSalt(10);
    const passwordHash = await bcrypt.hash("admin123", salt);

    await query(
      "INSERT INTO users (id, email, password_hash, full_name) VALUES (?, ?, ?, ?)",
      [adminId, "admin@example.com", passwordHash, "Admin User"],
    );

    // Create categories
    const categories = [
      {
        id: uuidv4(),
        name: "Building Materials",
        description: "Basic construction materials",
      },
      {
        id: uuidv4(),
        name: "Structural Materials",
        description: "Materials for structural components",
      },
      {
        id: uuidv4(),
        name: "Finishing Materials",
        description: "Materials for finishing work",
      },
      {
        id: uuidv4(),
        name: "Electrical",
        description: "Electrical components and materials",
      },
      {
        id: uuidv4(),
        name: "Wood Materials",
        description: "Wood and wood-based materials",
      },
    ];

    for (const category of categories) {
      await query(
        "INSERT INTO categories (id, name, description) VALUES (?, ?, ?)",
        [category.id, category.name, category.description],
      );
    }

    // Create inventory items
    const items = [
      {
        id: uuidv4(),
        name: "Cement",
        description: "Portland cement 40kg bags",
        category_id: categories[0].id,
        quantity: 150,
        unit: "bags",
        min_threshold: 20,
        status: "In Stock",
        created_by: adminId,
      },
      {
        id: uuidv4(),
        name: "Steel Rebar",
        description: "10mm steel reinforcement bars",
        category_id: categories[1].id,
        quantity: 75,
        unit: "pcs",
        min_threshold: 30,
        status: "In Stock",
        created_by: adminId,
      },
      {
        id: uuidv4(),
        name: "Bricks",
        description: "Standard red clay bricks",
        category_id: categories[0].id,
        quantity: 12,
        unit: "pallets",
        min_threshold: 15,
        status: "Low Stock",
        created_by: adminId,
      },
      {
        id: uuidv4(),
        name: "Paint - White",
        description: "Interior white paint",
        category_id: categories[2].id,
        quantity: 0,
        unit: "gallons",
        min_threshold: 10,
        status: "Out of Stock",
        created_by: adminId,
      },
      {
        id: uuidv4(),
        name: "Plywood",
        description: "18mm plywood sheets",
        category_id: categories[4].id,
        quantity: 45,
        unit: "sheets",
        min_threshold: 15,
        status: "In Stock",
        created_by: adminId,
      },
      {
        id: uuidv4(),
        name: "Concrete Blocks",
        description: "Standard concrete blocks",
        category_id: categories[0].id,
        quantity: 320,
        unit: "pcs",
        min_threshold: 100,
        status: "In Stock",
        created_by: adminId,
      },
      {
        id: uuidv4(),
        name: "Electrical Wire",
        description: "2.5mm electrical wire",
        category_id: categories[3].id,
        quantity: 8,
        unit: "rolls",
        min_threshold: 10,
        status: "Low Stock",
        created_by: adminId,
      },
    ];

    for (const item of items) {
      await query(
        "INSERT INTO inventory_items (id, name, description, category_id, quantity, unit, min_threshold, status, created_by) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)",
        [
          item.id,
          item.name,
          item.description,
          item.category_id,
          item.quantity,
          item.unit,
          item.min_threshold,
          item.status,
          item.created_by,
        ],
      );
    }

    return NextResponse.json({
      success: true,
      message: "Database seeded successfully",
      data: {
        adminUser: { email: "admin@example.com", password: "admin123" },
        categoriesCount: categories.length,
        itemsCount: items.length,
      },
    });
  } catch (error: any) {
    console.error("Database seeding error:", error);
    return NextResponse.json(
      { error: error.message || "Failed to seed database" },
      { status: 500 },
    );
  }
}
