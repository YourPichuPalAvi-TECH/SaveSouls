import { Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";

interface SpinnerProps extends React.SVGProps<SVGSVGElement> {
  size?: "sm" | "md" | "lg" | "xl";
}

export function Spinner({ size = "md", className, ...props }: SpinnerProps) {
  const sizeClasses = {
    sm: "w-4 h-4",
    md: "w-6 h-6",
    lg: "w-8 h-8",
    xl: "w-12 h-12",
  };

  return (
    <Loader2
      className={cn("animate-spin text-muted-foreground", sizeClasses[size], className)}
      {...props}
    />
  );
}

export function FullPageLoader() {
  return (
    <div className="flex h-[100dvh] w-full flex-col items-center justify-center bg-background">
      <Spinner size="lg" className="text-primary mb-4" />
      <p className="text-sm font-medium text-muted-foreground">Loading...</p>
    </div>
  );
}
