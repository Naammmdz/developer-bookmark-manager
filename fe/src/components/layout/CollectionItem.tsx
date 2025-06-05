import React from 'react';

interface CollectionItemProps {
  name: string;
  count: number;
  // icon?: React.ReactNode; // Optional: if icons are to be reintroduced
  isActive?: boolean; // Optional: for active state styling
  onClick?: () => void; // Optional: for interaction
}

const CollectionItem: React.FC<CollectionItemProps> = ({ name, count, isActive, onClick }) => {
  // Assuming glass-item means: bg-white/5 hover:bg-white/10 backdrop-filter backdrop-blur-sm border border-white/10
  // Assuming badge means: bg-gray-700 text-xs px-2 py-0.5 rounded-full
  const baseClasses = "flex justify-between items-center p-2 rounded-md cursor-pointer transition-colors";
  const glassItemClasses = "bg-white/5 hover:bg-white/10 backdrop-filter backdrop-blur-sm border border-white/10"; // Simplified for now
  const activeClasses = isActive ? 'bg-white/20 text-white' : 'text-white/80'; // Adjusted active state from prompt

  return (
    <div
      className={`${baseClasses} ${glassItemClasses} ${activeClasses}`}
      onClick={onClick}
    >
      {/* Add icon here if needed */}
      <span>{name}</span>
      <span className="bg-gray-700 text-xs px-2 py-0.5 rounded-full">{count}</span>
    </div>
  );
};

export default CollectionItem;
