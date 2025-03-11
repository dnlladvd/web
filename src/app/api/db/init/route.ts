import { initializeDatabase } from "@/lib/db/mysql";
import { NextResponse } from "next/server";

export async function GET() {
  try {
    await initializeDatabase();
    return NextResponse.json({
      success: true,
      message: "Database initialized successfully",
    });
  } catch (error: any) {
    console.error("Database initialization error:", error);
    return NextResponse.json(
      { error: error.message || "Failed to initialize database" },
      { status: 500 },
    );
  }
}
