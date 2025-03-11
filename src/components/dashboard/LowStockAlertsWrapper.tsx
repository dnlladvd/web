"use client";

import LowStockAlerts from "./LowStockAlerts";
import { useRouter } from "next/navigation";

export default function LowStockAlertsWrapper() {
  const router = useRouter();

  const handleProcurementNavigate = () => {
    router.push("/procurement");
  };

  return <LowStockAlerts onProcurementNavigate={handleProcurementNavigate} />;
}
