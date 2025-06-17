import * as React from "react"
import { cva } from "class-variance-authority"
import { cn } from "@/lib/utils"

const buttonVariants = cva(/* styles */)

export const Button = React.forwardRef(({ className, variant, ...props }, ref) => {
  return (
    <button ref={ref} className={cn(buttonVariants({ variant }), className)} {...props} />
  );
});

Button.displayName = "Button";
