"use client";

import { useEffect, useState } from "react";
import RecentActivity from "./RecentActivity";

interface ActivityItem {
  action: string;
  item: string;
  user: string;
  time: string;
}

export default function RecentActivityWrapper() {
  const [activities, setActivities] = useState<ActivityItem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchRecentActivity = async () => {
      try {
        const response = await fetch("/api/inventory/transactions?limit=5");
        if (response.ok) {
          const data = await response.json();
          // Transform the data to match the ActivityItem interface
          const formattedActivities = data.map((transaction: any) => {
            const date = new Date(transaction.created_at);
            const today = new Date();
            const yesterday = new Date(today);
            yesterday.setDate(yesterday.getDate() - 1);

            let timeString;
            if (date.toDateString() === today.toDateString()) {
              timeString = `Today, ${date.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}`;
            } else if (date.toDateString() === yesterday.toDateString()) {
              timeString = `Yesterday, ${date.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}`;
            } else {
              timeString =
                date.toLocaleDateString() +
                ", " +
                date.toLocaleTimeString([], {
                  hour: "2-digit",
                  minute: "2-digit",
                });
            }

            return {
              action: transaction.transaction_type,
              item: transaction.item_name,
              user: transaction.user_name || "System",
              time: timeString,
            };
          });
          setActivities(formattedActivities);
        }
      } catch (error) {
        console.error("Error fetching recent activity:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchRecentActivity();
  }, []);

  if (loading) {
    return <div className="w-full h-full bg-background">Loading...</div>;
  }

  return <RecentActivity activities={activities} />;
}
