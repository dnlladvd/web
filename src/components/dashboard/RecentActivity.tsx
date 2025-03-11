import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";

interface ActivityItem {
  action: string;
  item: string;
  user: string;
  time: string;
}

interface RecentActivityProps {
  activities?: ActivityItem[];
}

const RecentActivity = ({ activities = [] }: RecentActivityProps) => {
  return (
    <Card className="w-full h-full bg-background">
      <CardHeader className="pb-2">
        <CardTitle className="text-lg">Recent Activity</CardTitle>
      </CardHeader>
      <CardContent className="p-0">
        <div className="space-y-1 max-h-[220px] overflow-y-auto px-6">
          {activities.map((activity, index) => (
            <div
              key={index}
              className="flex items-center justify-between py-3 border-b last:border-0"
            >
              <div>
                <p className="font-medium text-sm">{activity.action}</p>
                <p className="text-sm text-muted-foreground">
                  {activity.item} by {activity.user}
                </p>
              </div>
              <span className="text-xs text-muted-foreground whitespace-nowrap">
                {activity.time}
              </span>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};

export default RecentActivity;
