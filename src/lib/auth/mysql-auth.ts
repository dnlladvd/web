import { query } from "@/lib/db/mysql";
import { v4 as uuidv4 } from "uuid";
import bcrypt from "bcryptjs";
import { cookies } from "next/headers";

export async function createUser(
  email: string,
  password: string,
  fullName?: string,
) {
  try {
    // Check if user already exists
    const existingUsers = await query("SELECT * FROM users WHERE email = ?", [
      email,
    ]);
    if ((existingUsers as any[]).length > 0) {
      throw new Error("User with this email already exists");
    }

    // Hash password
    const salt = await bcrypt.genSalt(10);
    const passwordHash = await bcrypt.hash(password, salt);

    // Create user
    const userId = uuidv4();
    await query(
      "INSERT INTO users (id, email, password_hash, full_name) VALUES (?, ?, ?, ?)",
      [userId, email, passwordHash, fullName || null],
    );

    return { id: userId, email, full_name: fullName };
  } catch (error) {
    console.error("Error creating user:", error);
    throw error;
  }
}

export async function verifyCredentials(email: string, password: string) {
  try {
    const users = await query("SELECT * FROM users WHERE email = ?", [email]);
    const user = (users as any[])[0];

    if (!user) {
      return null;
    }

    const isValid = await bcrypt.compare(password, user.password_hash);
    if (!isValid) {
      return null;
    }

    return {
      id: user.id,
      email: user.email,
      full_name: user.full_name,
    };
  } catch (error) {
    console.error("Error verifying credentials:", error);
    throw error;
  }
}

export async function createSession(userId: string) {
  const sessionId = uuidv4();
  const expiresAt = new Date();
  expiresAt.setDate(expiresAt.getDate() + 7); // 7 days from now

  await query(
    "INSERT INTO sessions (id, user_id, expires_at) VALUES (?, ?, ?)",
    [sessionId, userId, expiresAt],
  );

  // Set cookie
  cookies().set("session_id", sessionId, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    expires: expiresAt,
    path: "/",
  });

  return sessionId;
}

export async function getUserFromSession() {
  const sessionId = cookies().get("session_id")?.value;

  if (!sessionId) {
    return null;
  }

  try {
    const sessions = await query(
      "SELECT s.*, u.* FROM sessions s JOIN users u ON s.user_id = u.id WHERE s.id = ? AND s.expires_at > NOW()",
      [sessionId],
    );

    if ((sessions as any[]).length === 0) {
      return null;
    }

    const session = (sessions as any[])[0];
    return {
      id: session.user_id,
      email: session.email,
      full_name: session.full_name,
    };
  } catch (error) {
    console.error("Error getting user from session:", error);
    return null;
  }
}

export async function destroySession() {
  const sessionId = cookies().get("session_id")?.value;

  if (sessionId) {
    await query("DELETE FROM sessions WHERE id = ?", [sessionId]);
    cookies().delete("session_id");
  }
}
