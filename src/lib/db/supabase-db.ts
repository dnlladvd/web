import { createClient } from "@/lib/supabase/server";

export async function query(sql: string, params: any[] = []) {
  try {
    const supabase = createClient();
    const { data, error } = await supabase.rpc("execute_sql", {
      query_text: sql,
      params,
    });

    if (error) {
      console.error("Database query error:", error);
      throw error;
    }

    return data || [];
  } catch (error) {
    console.error("Database query error:", error);
    throw error;
  }
}

export async function initializeDatabase() {
  // This function will be implemented to use Supabase SQL execution
  // For now, we'll just return a success message
  return { success: true, message: "Database initialized successfully" };
}
