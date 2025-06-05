import React from 'react';
import { useBookmarks } from '../../context/BookmarkContext';

const DateRangeFilter: React.FC = () => {
  const { selectedDateRange, setSelectedDateRange } = useBookmarks();

  const baseSelectClasses = "w-full py-2 px-3 rounded-lg bg-white/5 border border-white/10 focus:border-primary/50 focus:ring-1 focus:ring-primary/50 text-white/90 outline-none transition-all appearance-none text-sm";

  return (
    <div>
      {/* The label <p className="text-sm text-white/60 mb-1">Date Range</p> is in Sidebar.tsx */}
      <select
        id="date-range-filter" // Good for associating with a label if one were here
        aria-label="Filter by date range" // Added aria-label for accessibility
        value={selectedDateRange || 'all'}
        onChange={(e) => setSelectedDateRange(e.target.value === 'all' ? null : e.target.value)}
        className={baseSelectClasses}
      >
        <option value="all">Anytime</option>
        <option value="today">Today</option>
        <option value="last7days">Last 7 days</option>
        <option value="last30days">Last 30 days</option>
        {/* Add "This Week" and "This Month" if their filtering logic is implemented in BookmarkContext */}
      </select>
    </div>
  );
};

export default DateRangeFilter;
