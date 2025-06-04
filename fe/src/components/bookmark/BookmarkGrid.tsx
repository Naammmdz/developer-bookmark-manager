import React from 'react';
import { motion } from 'framer-motion';
import { useBookmarks } from '../../context/BookmarkContext';
import BookmarkCard from './BookmarkCard';
import { FolderOpen } from 'lucide-react';

const BookmarkGrid: React.FC = () => {
  const { filteredBookmarks, activeCollection } = useBookmarks();
  
  if (filteredBookmarks.length === 0) {
    return (
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="flex flex-col items-center justify-center min-h-[400px] text-center"
      >
        <FolderOpen size={48} className="text-white/30 mb-4" />
        <h3 className="text-xl font-medium text-white/80 mb-2">No bookmarks found</h3>
        <p className="text-white/50 max-w-md">
          {activeCollection === "All Bookmarks"
            ? "You don't have any bookmarks yet. Add some to get started!"
            : `No bookmarks in the "${activeCollection}" collection.`}
        </p>
      </motion.div>
    );
  }
  
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 w-full">
      {filteredBookmarks.map((bookmark, index) => (
        <BookmarkCard
          key={bookmark.id}
          bookmark={bookmark}
          index={index}
        />
      ))}
    </div>
  );
};

export default BookmarkGrid;