import { generateOTP, storeOTP } from "@/lib/auth/mysql-auth";
import { sendOTPEmail } from "@/lib/email/phpmailer";
import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
  try {
    const { email, fullName } = await request.json();

    if (!email) {
      return NextResponse.json({ error: "Email is required" }, { status: 400 });
    }

    // Generate OTP
    const otp = generateOTP();

    // Store OTP in database
    await storeOTP(email, otp);

    // Send OTP email
    await sendOTPEmail(email, otp, fullName);

    return NextResponse.json({ success: true });
  } catch (error: any) {
    console.error("Send OTP error:", error);
    return NextResponse.json(
      { error: error.message || "Failed to send OTP" },
      { status: 500 },
    );
  }
}
