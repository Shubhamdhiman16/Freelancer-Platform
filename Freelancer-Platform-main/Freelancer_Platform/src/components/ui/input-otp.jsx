import * as React from "react";
import { OTPInput, OTPInputContext } from "input-otp";
import { Dot } from "lucide-react";

import { cn } from "@/lib/utils";

const InputOTP = React.forwardRef, React.ComponentPropsWithoutRef>(
  ({ className, containerClassName, ...props }, ref) => (
    
  ),
);
InputOTP.displayName = "InputOTP";

const InputOTPGroup = React.forwardRef, React.ComponentPropsWithoutRef<"div">>(
  ({ className, ...props }, ref) => ,
);
InputOTPGroup.displayName = "InputOTPGroup";

const InputOTPSlot = React.forwardRef,
  React.ComponentPropsWithoutRef<"div"> & { index: number }
>(({ index, className, ...props }, ref) => {
  const inputOTPContext = React.useContext(OTPInputContext);
  const { char, hasFakeCaret, isActive } = inputOTPContext.slots[index];

  return (
    
      {char}
      {hasFakeCaret && (
        
          
        </div>
      )}
    </div>
  );
});
InputOTPSlot.displayName = "InputOTPSlot";

const InputOTPSeparator = React.forwardRef, React.ComponentPropsWithoutRef<"div">>(
  ({ ...props }, ref) => (
    
      
    </div>
  ),
);
InputOTPSeparator.displayName = "InputOTPSeparator";

export { InputOTP, InputOTPGroup, InputOTPSlot, InputOTPSeparator };
