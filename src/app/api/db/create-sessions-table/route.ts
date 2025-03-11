import { query } from "@/lib/db/mysql";
import { NextResponse } from "next/server";

export async function GET() {
  try {
    // Create sessions table
    await query(`
      CREATE TABLE IF NOT EXISTS sessions (
        id VARCHAR(36) PRIMARY KEY,
        user_id VARCHAR(36) NOT NULL,
        expires_at TIMESTAMP NOT NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
      )
    `);

    return NextResponse.json({
      success: true,
      message: "Sessions table created successfully",
    });
  } catch (error: any) {
    console.error("Error creating sessions table:", error);
    return NextResponse.json(
      { error: error.message || "Failed to create sessions table" },
      { status: 500 },
    );
  }
}
