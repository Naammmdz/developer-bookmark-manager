import React from 'react';
import { useBookmarks } from '../../context/BookmarkContext';

const TagsFilter: React.FC = () => {
  const { availableTags, selectedTag, setSelectedTag } = useBookmarks();

  const baseSelectClasses = "w-full py-2 px-3 rounded-lg bg-white/5 border border-white/10 focus:border-primary/50 focus:ring-1 focus:ring-primary/50 text-white/90 outline-none transition-all appearance-none text-sm";

  if (availableTags.length === 0) {
    return (
      <div className="p-2 rounded bg-white/5 text-xs text-white/40">
        No tags available to filter.
      </div>
    );
  }

  return (
    <div>
      {/* The label <p className="text-sm text-white/60 mb-1">Tags</p> is in Sidebar.tsx */}
      <select
        id="tags-filter" // Good for associating with a label if one were here
        value={selectedTag || ''}
        onChange={(e) => setSelectedTag(e.target.value || null)}
        className={baseSelectClasses}
        aria-label="Filter by tag" // Added aria-label for accessibility since label is external
      >
        <option value="">All Tags</option>
        {availableTags.map(tag => (
          <option key={tag} value={tag}>{tag}</option>
        ))}
      </select>
    </div>
  );
};

export default TagsFilter;
