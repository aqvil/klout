import { cn } from "@/lib/utils";

interface ProgressBarProps {
  value: number;
  color?: "primary" | "secondary" | "accent" | "red";
  showLabel?: boolean;
  size?: "sm" | "md" | "lg";
  className?: string;
}

export function ProgressBar({
  value,
  color = "primary",
  showLabel = true,
  size = "md",
  className,
}: ProgressBarProps) {
  // Ensure value is between 0 and 100
  const safeValue = Math.max(0, Math.min(100, value));
  
  // Colors based on the theme
  const colorClasses = {
    primary: "bg-primary",
    secondary: "bg-secondary",
    accent: "bg-accent",
    red: "bg-red-500",
  };
  
  // Sizes for height
  const sizeClasses = {
    sm: "h-1.5",
    md: "h-2.5",
    lg: "h-4",
  };
  
  return (
    <div className={cn("flex items-center", className)}>
      <div className={cn("flex-grow bg-neutral-200 rounded-full", sizeClasses[size])}>
        <div
          className={cn("rounded-full", colorClasses[color], sizeClasses[size])}
          style={{ width: `${safeValue}%` }}
        />
      </div>
      {showLabel && (
        <span className="ml-2 text-xs font-medium">{safeValue}%</span>
      )}
    </div>
  );
}
