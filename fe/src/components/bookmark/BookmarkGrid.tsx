import React, { useRef, useEffect, useCallback } from 'react';
import { motion } from 'framer-motion';
import { useBookmarks } from '../../context/BookmarkContext';
import BookmarkCard from './BookmarkCard';
import { FolderOpen } from 'lucide-react';
import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  DragEndEvent,
} from '@dnd-kit/core';
import {
  SortableContext,
  sortableKeyboardCoordinates,
  rectSortingStrategy,
} from '@dnd-kit/sortable';

const BookmarkGrid: React.FC = () => {
  const {
    filteredBookmarks,
    activeCollection,
    reorderBookmarks,
    visibleBookmarksCount,
    loadMoreBookmarks, // Added
  } = useBookmarks();

  const sentinelRef = useRef<HTMLDivElement>(null);
  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;
    if (over && active.id !== over.id) {
      // Ensure IDs are numbers if your reorderBookmarks expects numbers
      reorderBookmarks(Number(active.id), Number(over.id));
    }
  };
  
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

  const stableLoadMoreBookmarks = useCallback(loadMoreBookmarks, [loadMoreBookmarks]);

  useEffect(() => {
    if (!sentinelRef.current) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && visibleBookmarksCount < filteredBookmarks.length) {
          stableLoadMoreBookmarks();
        }
      },
      {
        root: null, // viewport
        rootMargin: '0px',
        threshold: 1.0, // When 100% of the sentinel is visible
      }
    );

    observer.observe(sentinelRef.current);

    return () => {
      observer.disconnect();
    };
    // Add filteredBookmarks.length to ensure observer re-evaluates if total items change
  }, [stableLoadMoreBookmarks, visibleBookmarksCount, filteredBookmarks.length]);
  
  return (
    <> {/* Fragment to wrap DndContext and the optional loading indicator/sentinel */}
      <DndContext
        sensors={sensors}
        collisionDetection={closestCenter}
        onDragEnd={handleDragEnd}
      >
        <SortableContext
          items={filteredBookmarks.slice(0, visibleBookmarksCount).map(b => b.id.toString())}
          strategy={rectSortingStrategy}
        >
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 w-full">
            {filteredBookmarks.slice(0, visibleBookmarksCount).map((bookmark, index) => (
              <BookmarkCard
                key={bookmark.id}
                id={bookmark.id}
                bookmark={bookmark}
                index={index}
              />
            ))}
          </div>
        </SortableContext>
      </DndContext>

      {/* Sentinel and Loading Indicator */}
      {visibleBookmarksCount < filteredBookmarks.length && (
        <div ref={sentinelRef} className="col-span-full text-center py-6">
          <p className="text-white/60 text-sm">Loading more bookmarks...</p>
          {/* Optionally, add a spinner icon here */}
        </div>
      )}
    </>
  );
};

export default BookmarkGrid;