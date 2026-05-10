import React from 'react';
import { cn } from '../../lib/utils';

export const Input = React.forwardRef(({ className, type, icon: Icon, ...props }, ref) => {
  return (
    <div className="relative">
      {Icon && (
        <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
          <Icon className="h-5 w-5 text-gray-500" />
        </div>
      )}
      <input
        type={type}
        className={cn(
          "flex w-full rounded-[16px] border border-white/10 bg-white/5 px-4 py-3.5 text-sm text-secondary-bg shadow-sm transition-all placeholder:text-gray-500 focus:outline-none focus:ring-2 focus:ring-accent-blue/50 focus:border-accent-blue disabled:cursor-not-allowed disabled:opacity-50",
          Icon && "pl-11",
          className
        )}
        ref={ref}
        {...props}
      />
    </div>
  );
});
Input.displayName = "Input";
