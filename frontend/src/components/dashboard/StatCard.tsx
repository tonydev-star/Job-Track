import type { ReactNode } from "react";

interface StatCardProps {
  label: string;
  value: number;
  icon: ReactNode;
  accentColor: string;
  accentBg: string;
}

export default function StatCard({ label, value, icon, accentColor, accentBg }: StatCardProps) {
  return (
    <div className="stat-card">
      <div className="stat-card-top">
        <span className="stat-card-icon" style={{ color: accentColor, background: accentBg }}>
          {icon}
        </span>
      </div>
      <span className="stat-card-value">{value}</span>
      <span className="stat-card-label">{label}</span>
    </div>
  );
}
