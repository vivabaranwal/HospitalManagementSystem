import { LucideIcon } from "lucide-react";

interface StatsCardProps {
  title: string;
  value: string;
  change: string;
  changeType: "positive" | "negative" | "neutral";
  icon: LucideIcon;
}

export function StatsCard({ title, value, change, changeType, icon: Icon }: StatsCardProps) {
  return (
    <div className="bg-card rounded-lg border p-5 animate-fade-in">
      <div className="flex items-center justify-between mb-3">
        <span className="text-sm font-medium text-muted-foreground">{title}</span>
        <div className="h-9 w-9 rounded-lg bg-accent flex items-center justify-center">
          <Icon className="h-4 w-4" style={{ stroke: "url(#pink-gradient)" }} />
        </div>
      </div>
      <p className="text-2xl font-bold">{value}</p>
      <p className={`text-xs mt-1 font-medium ${
        changeType === "positive" ? "text-success" : 
        changeType === "negative" ? "text-destructive" : "text-muted-foreground"
      }`}>
        {change}
      </p>
    </div>
  );
}
