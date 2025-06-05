import React, { useState } from 'react';
import { LayoutGrid, List } from 'lucide-react'; // Assuming lucide-react

interface ViewToggleProps {
  defaultView?: 'grid' | 'list';
  onViewChange?: (viewMode: 'grid' | 'list') => void;
}

const ViewToggle: React.FC<ViewToggleProps> = ({ defaultView = 'grid', onViewChange }) => {
  const [viewMode, setViewMode] = useState<'grid' | 'list'>(defaultView);

  const handleToggle = (newView: 'grid' | 'list') => {
    setViewMode(newView);
    if (onViewChange) {
      onViewChange(newView);
    }
  };

  return (
    <div className="flex items-center space-x-1 p-0.5 bg-white/10 rounded-md">
      <button
        onClick={() => handleToggle('grid')}
        className={`p-1.5 rounded transition-colors ${viewMode === 'grid' ? 'bg-cyan-500/80 text-white' : 'text-white/70 hover:bg-white/20'}`}
        aria-label="Grid view"
      >
        <LayoutGrid size={18} />
      </button>
      <button
        onClick={() => handleToggle('list')}
        className={`p-1.5 rounded transition-colors ${viewMode === 'list' ? 'bg-cyan-500/80 text-white' : 'text-white/70 hover:bg-white/20'}`}
        aria-label="List view"
      >
        <List size={18} />
      </button>
    </div>
  );
};

export default ViewToggle;
