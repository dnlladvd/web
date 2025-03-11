import React from "react";
import { AlertCircle, ArrowRight } from "lucide-react";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "../ui/card";
import { Alert, AlertDescription, AlertTitle } from "../ui/alert";
import { Button } from "../ui/button";

interface LowStockItem {
  id: string;
  name: string;
  currentStock: number;
  minThreshold: number;
  category: string;
}

interface LowStockAlertsProps {
  items?: LowStockItem[];
  onProcurementNavigate?: () => void;
}

const LowStockAlerts = ({
  items = [],

  onProcurementNavigate = () => console.log("Navigate to procurement"),
}: LowStockAlertsProps) => {
  return (
    <Card className="w-full h-full bg-white overflow-hidden">
      <CardHeader className="bg-amber-50 border-b">
        <CardTitle className="text-lg flex items-center gap-2 text-amber-800">
          <AlertCircle className="h-5 w-5 text-amber-600" />
          Low Stock Alerts
        </CardTitle>
      </CardHeader>
      <CardContent className="p-0 max-h-[220px] overflow-y-auto">
        {items.length === 0 ? (
          <div className="p-6 text-center text-muted-foreground">
            No low stock items to display
          </div>
        ) : (
          <div className="divide-y">
            {items.map((item) => (
              <Alert
                key={item.id}
                variant="default"
                className="rounded-none border-0 border-l-4 border-l-amber-500 bg-amber-50/50 py-3"
              >
                <AlertTitle className="text-amber-800">{item.name}</AlertTitle>
                <AlertDescription className="text-sm">
                  <div className="flex justify-between items-center mt-1">
                    <span className="text-muted-foreground">
                      {item.category}
                    </span>
                    <span className="font-medium text-amber-800">
                      {item.currentStock} / {item.minThreshold} units
                    </span>
                  </div>
                  <div className="w-full bg-amber-100 rounded-full h-2 mt-2">
                    <div
                      className="bg-amber-500 h-2 rounded-full"
                      style={{
                        width: `${Math.min(100, (item.currentStock / item.minThreshold) * 100)}%`,
                      }}
                    ></div>
                  </div>
                </AlertDescription>
              </Alert>
            ))}
          </div>
        )}
      </CardContent>
      <CardFooter className="border-t p-4 bg-amber-50/30">
        <Button
          onClick={onProcurementNavigate}
          className="w-full flex items-center justify-center gap-2"
          variant="outline"
        >
          Go to Procurement
          <ArrowRight className="h-4 w-4" />
        </Button>
      </CardFooter>
    </Card>
  );
};

export default LowStockAlerts;
