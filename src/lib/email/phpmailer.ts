export async function sendOTPEmail(
  email: string,
  otp: string,
  fullName?: string,
) {
  try {
    // Prepare the email content
    const subject = "Your Verification Code for Construction IMS";
    const message = `
      <html>
        <body style="font-family: Arial, sans-serif; line-height: 1.6;">
          <div style="max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #e0e0e0; border-radius: 5px;">
            <h2 style="color: #333;">Email Verification</h2>
            <p>Hello ${fullName || "there"},</p>
            <p>Thank you for registering with Construction IMS. Please use the following verification code to complete your registration:</p>
            <div style="background-color: #f5f5f5; padding: 15px; text-align: center; font-size: 24px; font-weight: bold; letter-spacing: 5px; margin: 20px 0;">
              ${otp}
            </div>
            <p>This code will expire in 10 minutes.</p>
            <p>If you didn't request this code, please ignore this email.</p>
            <p>Regards,<br>Construction IMS Team</p>
          </div>
        </body>
      </html>
    `;

    // Use PHP script to send email via PHPMailer
    const response = await fetch("/api/send-email.php", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        to: email,
        subject,
        message,
      }),
    });

    if (!response.ok) {
      const errorData = await response.text();
      throw new Error(`Failed to send email: ${errorData}`);
    }

    return true;
  } catch (error) {
    console.error("Error sending email:", error);
    throw error;
  }
}
