import React from 'react';

interface QuickAccessItemProps {
  icon: string; // Expecting emoji or SVG string for simplicity
  label: string;
  count: number;
  onClick?: () => void; // Optional: for interaction
}

const QuickAccessItem: React.FC<QuickAccessItemProps> = ({ icon, label, count, onClick }) => {
  // Assuming glass-item means: bg-white/5 hover:bg-white/10 backdrop-filter backdrop-blur-sm border border-white/10
  // Assuming badge means: bg-gray-700 text-xs px-2 py-0.5 rounded-full
  const baseClasses = "flex items-center space-x-3 p-2 rounded-md cursor-pointer transition-colors text-white/80";
  const glassItemClasses = "bg-white/5 hover:bg-white/10 backdrop-filter backdrop-blur-sm border border-white/10"; // Made consistent with CollectionItem

  return (
    <div
      className={`${baseClasses} ${glassItemClasses}`}
      onClick={onClick}
    >
      <span>{icon}</span>
      <span>{label}</span>
      <span className="ml-auto bg-gray-700 text-xs px-2 py-0.5 rounded-full">{count}</span>
    </div>
  );
};

export default QuickAccessItem;
