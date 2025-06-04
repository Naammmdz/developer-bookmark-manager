import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useBookmarks } from '../../context/BookmarkContext';
import NeonButton from './NeonButton'; // Assuming NeonButton can be used or adapted
import { Trash2, XCircle, CheckCheck } from 'lucide-react';

const BulkActionBar: React.FC = () => {
  const {
    isBulkSelectMode,
    selectedBookmarkIds,
    deleteSelectedBookmarks,
    selectAllVisibleBookmarks,
    toggleBulkSelectMode,
    filteredBookmarks, // Assuming this contains currently visible/filterable items
  } = useBookmarks();

  const numSelected = selectedBookmarkIds.length;
  const numVisible = filteredBookmarks.length;
  const allVisibleSelected = numSelected === numVisible && numVisible > 0;

  const handleDeleteSelected = () => {
    if (window.confirm(`Are you sure you want to delete ${numSelected} selected bookmark(s)? This action cannot be undone.`)) {
      deleteSelectedBookmarks();
    }
  };

  const handleSelectAllVisible = () => {
    const visibleIds = filteredBookmarks.map(b => b.id);
    selectAllVisibleBookmarks(visibleIds);
  };

  return (
    <AnimatePresence>
      {isBulkSelectMode && numSelected > 0 && (
        <motion.div
          initial={{ y: '100%' }}
          animate={{ y: 0 }}
          exit={{ y: '100%' }}
          transition={{ type: 'spring', stiffness: 300, damping: 30 }}
          className="fixed bottom-0 left-0 right-0 z-[100] p-3 sm:p-4 bg-background-darker/80 backdrop-blur-lg border-t border-white/10 shadow-2xl"
        >
          <div className="container mx-auto flex flex-col sm:flex-row items-center justify-between gap-3">
            <div className="text-sm text-white/80 mb-2 sm:mb-0">
              {numSelected} item(s) selected
            </div>
            <div className="flex flex-wrap items-center gap-2 sm:gap-3">
              <NeonButton
                onClick={handleSelectAllVisible}
                disabled={allVisibleSelected}
                size="small"
                color="secondary"
                icon={<CheckCheck size={16} />}
                className={allVisibleSelected ? 'opacity-50 cursor-not-allowed' : ''}
              >
                {allVisibleSelected ? 'All Selected' : `Select All Visible (${numVisible})`}
              </NeonButton>

              <NeonButton
                onClick={handleDeleteSelected}
                disabled={numSelected === 0}
                size="small"
                color="danger" // Assuming a danger color for NeonButton
                icon={<Trash2 size={16} />}
                className={numSelected === 0 ? 'opacity-50 cursor-not-allowed' : ''}
              >
                Delete Selected
              </NeonButton>

              <button
                onClick={toggleBulkSelectMode}
                className="flex items-center gap-1.5 py-2 px-3 rounded-lg text-sm bg-white/10 hover:bg-white/20 text-white/80 transition-colors"
                aria-label="Cancel bulk selection"
              >
                <XCircle size={16} />
                Done
              </button>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default BulkActionBar;
