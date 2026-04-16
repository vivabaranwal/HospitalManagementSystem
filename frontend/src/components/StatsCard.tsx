import { LucideIcon } from "lucide-react";
import { cn } from "@/lib/utils";

interface StatsCardProps {
  title: string;
  value: string | number;
  icon: LucideIcon;
  description?: string;
  trend?: string;
  trendUp?: boolean;
}

export function StatsCard({ 
  title, 
  value, 
  icon: Icon, 
  description, 
  trend, 
  trendUp 
}: StatsCardProps) {
  return (
    <div className="group relative overflow-hidden bg-card/50 backdrop-blur-sm rounded-xl border p-6 transition-all hover:shadow-2xl hover:shadow-primary/5 hover:border-primary/20 animate-fade-in">
      {/* Background Glow */}
      <div className="absolute -right-4 -top-4 h-24 w-24 bg-primary/5 blur-3xl rounded-full group-hover:bg-primary/10 transition-colors" />
      
      <div className="flex items-start justify-between">
        <div>
          <p className="text-sm font-medium text-muted-foreground uppercase tracking-wider">{title}</p>
          <h3 className="text-3xl font-bold mt-2 tracking-tight">{value}</h3>
          {description && (
            <p className="text-xs text-muted-foreground mt-1">{description}</p>
          )}
        </div>
        <div className="h-12 w-12 rounded-xl bg-primary/10 flex items-center justify-center text-primary border border-primary/20 shadow-[0_0_15px_rgba(var(--primary),0.1)] group-hover:scale-110 transition-transform">
          <Icon className="h-6 w-6" />
        </div>
      </div>
      
      {trend && (
        <div className="mt-4 flex items-center gap-2">
          <span className={cn(
            "text-[10px] font-bold px-2 py-0.5 rounded-full uppercase tracking-tighter",
            trendUp 
              ? "bg-green-500/10 text-green-500 border border-green-500/20 shadow-[0_0_10px_rgba(34,197,94,0.1)]" 
              : "bg-orange-500/10 text-orange-500 border border-orange-500/20 shadow-[0_0_10px_rgba(249,115,22,0.1)]"
          )}>
            {trend}
          </span>
          <div className="h-px flex-1 bg-gradient-to-r from-border to-transparent" />
        </div>
      )}
    </div>
  );
}
