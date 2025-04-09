import { cn } from "@/lib/utils";
import { ArrowDown, ArrowUp } from "lucide-react";

interface TrendIndicatorProps {
  value: number;
  className?: string;
}

export function TrendIndicator({ value, className }: TrendIndicatorProps) {
  const isPositive = value >= 0;
  const displayValue = Math.abs(value);
  
  return (
    <span 
      className={cn(
        "font-medium flex items-center",
        isPositive ? "text-green-600" : "text-red-600",
        className
      )}
    >
      {isPositive ? (
        <ArrowUp className="mr-1 h-4 w-4" />
      ) : (
        <ArrowDown className="mr-1 h-4 w-4" />
      )}
      {displayValue}%
    </span>
  );
}
