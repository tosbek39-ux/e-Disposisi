import React from 'react';
import { cn } from '@/lib/utils';

const Alert = React.forwardRef(({ className, variant = "default", ...props }, ref) => {
  const variantClasses = {
    default: "border-blue-200 bg-blue-50 text-blue-700",
    destructive: "border-red-200 bg-red-50 text-red-700",
    warning: "border-yellow-200 bg-yellow-50 text-yellow-700",
    success: "border-green-200 bg-green-50 text-green-700"
  };

  return (
    <div
      ref={ref}
      className={cn(
        "w-full rounded-lg border p-4",
        variantClasses[variant],
        className
      )}
      {...props}
    />
  );
});

Alert.displayName = "Alert";

const AlertDescription = React.forwardRef(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={cn("text-sm [&_p]:leading-relaxed", className)}
    {...props}
  />
));

AlertDescription.displayName = "AlertDescription";

export { Alert, AlertDescription };