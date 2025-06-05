import React, { useState } from 'react';
import { motion } from 'framer-motion';
// useBookmarks removed, functionality will come from props
import BookmarkCard from './BookmarkCard';
// FolderOpen removed as empty state is handled by parent
import { DragDropContext, Droppable, Draggable, DropResult } from '@hello-pangea/dnd';
import GlassCard from '../ui/GlassCard';
import { Bookmark } from '../../types'; // Import Bookmark type for props

interface BookmarkPreviewModalProps {
  bookmark: Bookmark; // Use Bookmark type
  onClose: () => void;
}

const BookmarkPreviewModal: React.FC<BookmarkPreviewModalProps> = ({ bookmark, onClose }) => {
  // No change to modal content based on this specific subtask, but good to ensure types are consistent.
  // if (!bookmark) return null; // This check is good if bookmark could be null/undefined.
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm">
      <GlassCard className="relative w-full max-w-xl h-screen max-h-[80vh] flex items-center justify-center animate-fade-in overflow-hidden"> {/* Adjusted height */}
        <button
          className="absolute top-3 right-3 p-1.5 rounded-full bg-white/10 hover:bg-white/20 text-white/80 z-10"
          onClick={onClose}
          aria-label="Close preview"
          type="button"
        >
          ✕
        </button>
        <iframe
          src={bookmark.url}
          title={bookmark.title || "Bookmark Preview"} // Use bookmark title
          className="w-full h-full border-0 bg-white rounded-2xl"
          sandbox="allow-scripts allow-popups" // Removed allow-same-origin for broader preview compatibility, with caution
          loading="lazy"
        />
      </GlassCard>
    </div>
  );
};

interface BookmarkGridProps {
  bookmarks: Bookmark[];
  reorderBookmarks: (movedBookmarkId: number, targetBookmarkId: number | null) => void; // Updated signature
  deleteBookmarks: (ids: number[]) => void;
  // activeCollection is not needed here anymore as parent handles empty state based on it
}

const BookmarkGrid: React.FC<BookmarkGridProps> = ({ bookmarks, reorderBookmarks, deleteBookmarks }) => {
  const [previewBookmark, setPreviewBookmark] = useState<Bookmark | null>(null); // Typed state
  const [bulkMode, setBulkMode] = useState(false);
  const [selectedIds, setSelectedIds] = useState<number[]>([]);

  const toggleBulkMode = () => {
    setBulkMode((v) => !v);
    setSelectedIds([]);
  };

  const toggleSelect = (id: number) => {
    setSelectedIds((prev) =>
      prev.includes(id) ? prev.filter((i) => i !== id) : [...prev, id]
    );
  };

  const onDragEnd = (result: DropResult) => {
    if (!result.destination || !result.source) return;
    if (result.source.index === result.destination.index && result.source.droppableId === result.destination.droppableId) return;

    const movedItem = bookmarks[result.source.index];
    if (!movedItem) {
      console.error("BookmarkGrid: Moved item not found at source index", result.source.index);
      return;
    }
    const movedItemId = movedItem.id;

    // Create a list of items excluding the moved item, to determine the target based on visual drop position
    const remainingItems = bookmarks.filter(bm => bm.id !== movedItemId);

    let targetItemId: number | null = null;
    // If the destination index is within the bounds of the remaining items, it's the ID of that item.
    if (result.destination.index < remainingItems.length) {
      targetItemId = remainingItems[result.destination.index].id;
    }
    // If result.destination.index === remainingItems.length, it means item is dropped at the very end.
    // In this case, targetItemId remains null, signifying "append to end".

    reorderBookmarks(movedItemId, targetItemId);
  };

  // Empty state is now handled by the parent component (BookmarksViewWithSidebar)
  // The `if (bookmarks.length === 0)` block has been removed.

  return (
    <>
      <div className="flex items-center justify-between mb-4">
        <button
          className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-colors ${bulkMode ? 'bg-primary/80 text-white' : 'bg-white/10 text-white/70 hover:bg-white/20'}`}
          onClick={toggleBulkMode}
        >
          {bulkMode ? 'Cancel Bulk Select' : 'Bulk Select'}
        </button>
        {bulkMode && selectedIds.length > 0 && (
          <div className="flex items-center gap-2">
            <span className="text-white/80 text-sm">{selectedIds.length} selected</span>
            <button
              className="px-3 py-1.5 rounded-lg bg-red-500/80 text-white text-sm font-medium hover:bg-red-600 transition-colors"
              onClick={() => {
                deleteBookmarks(selectedIds); // This function is now passed as a prop
                setSelectedIds([]);
              }}
            >
              Delete Selected
            </button>
          </div>
        )}
      </div>
      <DragDropContext onDragEnd={onDragEnd}>
        <Droppable droppableId="bookmarkGrid" direction="vertical">
          {(provided) => (
            <div
              className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 w-full" // Consider responsive columns if needed
              ref={provided.innerRef}
              {...provided.droppableProps}
            >
              {bookmarks.map((bookmark, index) => ( // Use `bookmarks` prop
                <Draggable key={bookmark.id} draggableId={bookmark.id.toString()} index={index}>
                  {(providedDraggable, snapshot) => (
                    <div
                      ref={providedDraggable.innerRef}
                      {...providedDraggable.draggableProps}
                      {...providedDraggable.dragHandleProps}
                      style={{
                        ...providedDraggable.draggableProps.style,
                        zIndex: snapshot.isDragging ? 50 : 'auto', // Ensure dragging item is on top
                      }}
                    >
                      <BookmarkCard
                        bookmark={bookmark}
                        index={index} // Pass index if BookmarkCard uses it
                        onPreview={() => setPreviewBookmark(bookmark)}
                        bulkMode={bulkMode}
                        checked={selectedIds.includes(bookmark.id)}
                        onCheck={() => toggleSelect(bookmark.id)}
                      />
                    </div>
                  )}
                </Draggable>
              ))}
              {provided.placeholder}
            </div>
          )}
        </Droppable>
      </DragDropContext>
      {previewBookmark && (
        // The onClick on this div might be too broad, consider if it should be on a specific backdrop element
        <div onClick={() => setPreviewBookmark(null)}>
          <BookmarkPreviewModal bookmark={previewBookmark} onClose={() => setPreviewBookmark(null)} />
        </div>
      )}
    </>
  );
};

export default BookmarkGrid;