import * as React from "react";
import { cn } from "@/lib/utils";

const InputOTP = React.forwardRef(({ className, containerClassName, ...props }, ref) => {
  return (
    <div className={cn("flex items-center", containerClassName)}>
      <input ref={ref} className={cn("flex h-10 w-10 rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-foreground placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50", className)} {...props} />
    </div>
  );
});

InputOTP.displayName = "InputOTP";

const InputOTPGroup = React.forwardRef(({ className, ...props }, ref) => (
  <div ref={ref} className={cn("flex items-center", className)} {...props} />
));

InputOTPGroup.displayName = "InputOTPGroup";

const InputOTPSlot = React.forwardRef(({ index, className, ...props }, ref) => {
  const inputOTPContext = React.useContext(OTPInputContext);
  const { char, hasFakeCaret, isActive } = inputOTPContext.slots[index];

  return (
    <div ref={ref} className={cn("relative w-10 h-10 items-center justify-center border-y border-r border-input bg-background text-sm transition-all first:border-l first:rounded-l-md last:rounded-r-md", isActive && "z-10 ring-2 ring-ring ring-offset-background", hasFakeCaret && "border-b border-r-foreground", className)} {...props}>
      {char}
      {isActive && (
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="h-px w-full bg-foreground animate-pulse" />
        </div>
      )}
    </div>
  );
});

InputOTPSlot.displayName = "InputOTPSlot";

const InputOTPSeparator = React.forwardRef(({ ...props }, ref) => (
  <div ref={ref} className="flex items-center justify-center" {...props}>
    <div className="h-px w-2.5 bg-foreground" />
  </div>
));

InputOTPSeparator.displayName = "InputOTPSeparator";

const OTPInputContext = React.createContext(null);

export { InputOTP, InputOTPGroup, InputOTPSlot, InputOTPSeparator, OTPInputContext };
