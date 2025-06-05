import React from 'react';
import { useBookmarks } from '../../context/BookmarkContext';
import { ListChecks, XCircle } from 'lucide-react'; // Using provided example icons

const BulkActionsToolbar: React.FC = () => {
  const {
    isBulkSelectMode,
    selectedBookmarkIds,
    toggleBulkSelectMode,
    filteredBookmarks // Added to potentially hide button if no items
  } = useBookmarks();

  // Basic button styling, can be replaced with a shared Button component later
  // Using similar classes to what was in Header.tsx for this button
  const baseButtonClasses = "p-2 rounded-lg text-sm transition-all flex items-center gap-1.5";

  const normalButtonClasses = "bg-blue-500/80 hover:bg-blue-500/100 text-white";
  const cancelButtonClasses = "bg-red-500/80 hover:bg-red-500/100 text-white";

  // Optionally, don't render the button if there are no bookmarks to select
  if (filteredBookmarks.length === 0 && !isBulkSelectMode) {
    return null;
  }

  return (
    <button
      onClick={toggleBulkSelectMode}
      className={`${baseButtonClasses} ${
        isBulkSelectMode ? cancelButtonClasses : normalButtonClasses
      }`}
      aria-live="polite" // To announce changes in button text/state
    >
      {isBulkSelectMode ? (
        <>
          <XCircle size={16} />
          <span>Cancel ({selectedBookmarkIds.length})</span>
        </>
      ) : (
        <>
          <ListChecks size={16} />
          <span>Bulk Select</span>
        </>
      )}
    </button>
  );
};

export default BulkActionsToolbar;
