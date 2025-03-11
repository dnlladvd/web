import { createClient } from "@/lib/supabase/server";
import { NextResponse } from "next/server";

export async function POST() {
  try {
    const supabase = createClient();
    const { error } = await supabase.auth.signOut();

    if (error) {
      throw error;
    }

    // Set headers to clear any client-side caching
    const headers = new Headers();
    headers.append(
      "Cache-Control",
      "no-store, no-cache, must-revalidate, proxy-revalidate",
    );
    headers.append("Pragma", "no-cache");
    headers.append("Expires", "0");

    return NextResponse.json(
      { success: true },
      {
        headers,
        status: 200,
      },
    );
  } catch (error: any) {
    console.error("Logout error:", error);
    return NextResponse.json(
      { error: error.message || "Failed to logout" },
      { status: 500 },
    );
  }
}
