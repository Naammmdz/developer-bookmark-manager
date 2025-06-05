import React from 'react';

interface StatsCardProps {
  title: string;
  value: string;
  icon: React.ReactNode; // Expecting JSX for icon
  change?: string; // Optional e.g., "+5% from last month"
}

const StatsCard: React.FC<StatsCardProps> = ({ title, value, icon, change }) => {
  // Definition from prompt: bg-white/5 backdrop-blur-lg border border-white/10 rounded-xl shadow-lg.
  // StatsCard specific: p-4 rounded-lg.
  const glassCardClasses = "bg-white/5 backdrop-filter backdrop-blur-lg border border-white/10 shadow-lg";

  return (
    <div className={`${glassCardClasses} p-4 rounded-lg`}>
      <div className="flex items-center justify-between mb-2">
        <h3 className="text-sm font-medium text-white/80">{title}</h3>
        <div className="text-cyan-400">{icon}</div>
      </div>
      <p className="text-2xl font-semibold text-white">{value}</p>
      {change && <p className="text-xs text-white/60 mt-1">{change}</p>}
    </div>
  );
};

export default StatsCard;
