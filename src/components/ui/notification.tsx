import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { X } from "lucide-react";

import { cn } from "@/lib/utils";

const notificationVariants = cva(
  "group relative w-full rounded-lg border p-4 shadow-md",
  {
    variants: {
      variant: {
        default: "bg-background text-foreground",
        success:
          "bg-green-50 text-green-900 border-green-200 dark:bg-green-950 dark:text-green-100 dark:border-green-900",
        warning:
          "bg-amber-50 text-amber-900 border-amber-200 dark:bg-amber-950 dark:text-amber-100 dark:border-amber-900",
        error:
          "bg-red-50 text-red-900 border-red-200 dark:bg-red-950 dark:text-red-100 dark:border-red-900",
        info: "bg-blue-50 text-blue-900 border-blue-200 dark:bg-blue-950 dark:text-blue-100 dark:border-blue-900",
      },
    },
    defaultVariants: {
      variant: "default",
    },
  },
);

export interface NotificationProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof notificationVariants> {
  title?: string;
  description?: string;
  icon?: React.ReactNode;
  onClose?: () => void;
}

const Notification = React.forwardRef<HTMLDivElement, NotificationProps>(
  (
    { className, variant, title, description, icon, onClose, ...props },
    ref,
  ) => {
    return (
      <div
        ref={ref}
        className={cn(notificationVariants({ variant }), className)}
        {...props}
      >
        <div className="flex items-start gap-4">
          {icon && <div className="flex-shrink-0">{icon}</div>}
          <div className="flex-1">
            {title && <h5 className="mb-1 font-medium">{title}</h5>}
            {description && <div className="text-sm">{description}</div>}
          </div>
          {onClose && (
            <button
              onClick={onClose}
              className="flex-shrink-0 rounded-full p-1 transition-colors hover:bg-muted"
            >
              <X className="h-4 w-4" />
            </button>
          )}
        </div>
      </div>
    );
  },
);
Notification.displayName = "Notification";

export { Notification, notificationVariants };
