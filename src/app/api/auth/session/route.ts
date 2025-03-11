import { createClient } from "@/lib/supabase/server";
import { NextResponse } from "next/server";

export async function GET() {
  try {
    const supabase = createClient();
    const { data, error } = await supabase.auth.getSession();

    if (error) {
      throw error;
    }

    if (!data.session) {
      return NextResponse.json({ user: null });
    }

    return NextResponse.json({ user: data.session.user });
  } catch (error: any) {
    console.error("Session error:", error);
    return NextResponse.json(
      { error: error.message || "Failed to get session" },
      { status: 500 },
    );
  }
}
