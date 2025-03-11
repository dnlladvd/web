import { verifyEmail } from "@/lib/auth/mysql-auth";
import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
  try {
    const { email, otp } = await request.json();

    if (!email || !otp) {
      return NextResponse.json(
        { error: "Email and OTP are required" },
        { status: 400 },
      );
    }

    const result = await verifyEmail(email, otp);

    if (!result.success) {
      return NextResponse.json(
        { error: result.message || "Invalid OTP" },
        { status: 400 },
      );
    }

    return NextResponse.json({ success: true });
  } catch (error: any) {
    console.error("Email verification error:", error);
    return NextResponse.json(
      { error: error.message || "Failed to verify email" },
      { status: 500 },
    );
  }
}
