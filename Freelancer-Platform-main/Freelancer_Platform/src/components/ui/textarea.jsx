import * as React from "react";
import { cn } from "@/lib/utils";

const Textarea = React.forwardRef(({ className, ...props }, ref) => {
  return (
    <textarea
      ref={ref}
      className={cn(
        "flex w-full rounded-md border border-gray-700 bg-gray-900 text-gray-100 px-3 py-2 text-sm",
        "placeholder:text-gray-500",
        "focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary",
        "disabled:cursor-not-allowed disabled:opacity-50",
        className
      )}
      {...props}
    />
  );
});

Textarea.displayName = "Textarea";

export { Textarea };
