import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
import { Package, PackageCheck, PackageX, AlertTriangle } from "lucide-react";

interface StockSummaryProps {
  totalItems?: number;
  inStockItems?: number;
  lowStockItems?: number;
  outOfStockItems?: number;
}

const StockSummary = ({
  totalItems = 0,
  inStockItems = 0,
  lowStockItems = 0,
  outOfStockItems = 0,
}: StockSummaryProps) => {
  const summaryCards = [
    {
      title: "Total Items",
      value: totalItems,
      icon: <Package className="h-8 w-8 text-gray-500" />,
      bgColor: "bg-card",
    },
    {
      title: "In Stock",
      value: inStockItems,
      icon: <PackageCheck className="h-8 w-8 text-green-500" />,
      bgColor: "bg-green-50 dark:bg-green-950/30",
    },
    {
      title: "Low Stock",
      value: lowStockItems,
      icon: <AlertTriangle className="h-8 w-8 text-amber-500" />,
      bgColor: "bg-amber-50 dark:bg-amber-950/30",
    },
    {
      title: "Out of Stock",
      value: outOfStockItems,
      icon: <PackageX className="h-8 w-8 text-red-500" />,
      bgColor: "bg-red-50 dark:bg-red-950/30",
    },
  ];

  return (
    <div className="w-full bg-background p-4 rounded-lg">
      <h2 className="text-xl font-semibold mb-4">Stock Summary</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {summaryCards.map((card, index) => (
          <Card
            key={index}
            className={`${card.bgColor} border-none shadow-md hover:shadow-lg transition-shadow`}
          >
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium">
                {card.title}
              </CardTitle>
              {card.icon}
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold">{card.value}</div>
              <p className="text-xs text-muted-foreground mt-1">
                {index === 0 && "Total inventory items"}
                {index === 1 && "Items with adequate stock"}
                {index === 2 && "Items below threshold"}
                {index === 3 && "Items requiring immediate order"}
              </p>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default StockSummary;
