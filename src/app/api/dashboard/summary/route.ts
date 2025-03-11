import { createClient } from "@/lib/supabase/server";
import { NextResponse } from "next/server";

export async function GET() {
  try {
    const supabase = createClient();

    // Get total items count
    const { data: totalItemsResult, error: totalError } = await supabase
      .from("inventory_items")
      .select("id", { count: "exact", head: true });

    if (totalError) throw totalError;
    const totalItems = totalItemsResult?.length || 0;

    // Get in stock items count
    const { data: inStockItemsResult, error: inStockError } = await supabase
      .from("inventory_items")
      .select("id")
      .eq("status", "In Stock");

    if (inStockError) throw inStockError;
    const inStockItems = inStockItemsResult?.length || 0;

    // Get low stock items count
    const { data: lowStockItemsResult, error: lowStockError } = await supabase
      .from("inventory_items")
      .select("id")
      .eq("status", "Low Stock");

    if (lowStockError) throw lowStockError;
    const lowStockItems = lowStockItemsResult?.length || 0;

    // Get out of stock items count
    const { data: outOfStockItemsResult, error: outOfStockError } =
      await supabase
        .from("inventory_items")
        .select("id")
        .eq("status", "Out of Stock");

    if (outOfStockError) throw outOfStockError;
    const outOfStockItems = outOfStockItemsResult?.length || 0;

    // Get recent transactions
    const { data: recentTransactions, error: transactionsError } =
      await supabase
        .from("inventory_transactions")
        .select(
          `
        *,
        inventory_items!inner(name, unit),
        users(full_name)
      `,
        )
        .order("created_at", { ascending: false })
        .limit(5);

    if (transactionsError) throw transactionsError;

    // Get low stock items
    const { data: lowStockItemsList, error: lowStockItemsError } =
      await supabase
        .from("inventory_items")
        .select(
          `
        *,
        categories(name)
      `,
        )
        .lt("quantity", supabase.rpc("get_min_threshold", { row_id: "id" }))
        .gt("quantity", 0)
        .limit(5);

    if (lowStockItemsError) throw lowStockItemsError;

    return NextResponse.json({
      totalItems,
      inStockItems,
      lowStockItems,
      outOfStockItems,
      recentTransactions: recentTransactions || [],
      lowStockItems: lowStockItemsList || [],
    });
  } catch (error: any) {
    console.error("Error fetching dashboard summary:", error);
    return NextResponse.json(
      { error: error.message || "Failed to fetch dashboard summary" },
      { status: 500 },
    );
  }
}
