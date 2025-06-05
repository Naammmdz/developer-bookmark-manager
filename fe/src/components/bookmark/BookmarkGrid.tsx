import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { useBookmarks } from '../../context/BookmarkContext';
import BookmarkCard from './BookmarkCard';
import { FolderOpen } from 'lucide-react';
import { DragDropContext, Droppable, Draggable, DropResult } from '@hello-pangea/dnd';
import GlassCard from '../ui/GlassCard';

const BookmarkPreviewModal = ({ bookmark, onClose }: { bookmark: any, onClose: () => void }) => {
  if (!bookmark) return null;
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm">
      <GlassCard className="relative w-full max-w-xl h-96 flex items-center justify-center animate-fade-in overflow-hidden">
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
          title="Bookmark Preview"
          className="w-full h-full border-0 bg-white rounded-2xl"
          sandbox="allow-same-origin allow-scripts allow-popups"
          loading="lazy"
        />
      </GlassCard>
    </div>
  );
};

const BookmarkGrid: React.FC = () => {
  const { filteredBookmarks, activeCollection, reorderBookmarks, deleteBookmarks } = useBookmarks();
  const [previewBookmark, setPreviewBookmark] = useState<any>(null);
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
    if (!result.destination) return;
    if (result.source.index === result.destination.index) return;
    reorderBookmarks(result.source.index, result.destination.index);
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

  return (
    <>
      <div className="flex items-center justify-between mb-4">
        <button
          className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-colors ${bulkMode ? 'bg-primary/80 text-white' : 'bg-white/10 text-white/70 hover:bg-white/20'}`}
          onClick={toggleBulkMode}
        >
          {bulkMode ? 'Thoát chọn nhiều' : 'Chọn nhiều'}
        </button>
        {bulkMode && selectedIds.length > 0 && (
          <div className="flex items-center gap-2">
            <span className="text-white/80 text-sm">Đã chọn {selectedIds.length}</span>
            <button
              className="px-3 py-1.5 rounded-lg bg-red-500/80 text-white text-sm font-medium hover:bg-red-600 transition-colors"
              onClick={() => {
                deleteBookmarks(selectedIds);
                setSelectedIds([]);
              }}
            >
              Xóa đã chọn
            </button>
          </div>
        )}
      </div>
      <DragDropContext onDragEnd={onDragEnd}>
        <Droppable droppableId="bookmarkGrid" direction="vertical">
          {(provided) => (
            <div
              className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 w-full"
              ref={provided.innerRef}
              {...provided.droppableProps}
            >
              {filteredBookmarks.map((bookmark, index) => (
                <Draggable key={bookmark.id} draggableId={bookmark.id.toString()} index={index}>
                  {(provided, snapshot) => (
                    <div
                      ref={provided.innerRef}
                      {...provided.draggableProps}
                      {...provided.dragHandleProps}
                      style={{
                        ...provided.draggableProps.style,
                        zIndex: snapshot.isDragging ? 10 : 'auto',
                      }}
                    >
                      <BookmarkCard
                        bookmark={bookmark}
                        index={index}
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
        <div onClick={() => setPreviewBookmark(null)}>
          <BookmarkPreviewModal bookmark={previewBookmark} onClose={() => setPreviewBookmark(null)} />
        </div>
      )}
    </>
  );
};

export default BookmarkGrid;