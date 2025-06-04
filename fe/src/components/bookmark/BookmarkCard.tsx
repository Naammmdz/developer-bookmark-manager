import React, { useState, useRef } from 'react';
import { motion } from 'framer-motion';
import { Heart, ExternalLink, Trash, Globe, Lock, Eye } from 'lucide-react'; // Added Eye icon
import { useBookmarks } from '../../context/BookmarkContext';
import GlassCard from '../ui/GlassCard';
import TagPill from '../ui/TagPill';
import { Bookmark } from '../../types';
import { useSortable } from '@dnd-kit/sortable';
import BookmarkPreviewPopover from './BookmarkPreviewPopover'; // Added import
import { CSS } from '@dnd-kit/utilities';

interface BookmarkCardProps {
  bookmark: Bookmark;
  index: number;
  id: number; // Required for useSortable
}

const BookmarkCard: React.FC<BookmarkCardProps> = ({ bookmark, index, id }) => {
  const { toggleFavorite, deleteBookmark } = useBookmarks();
  const [showPreview, setShowPreview] = useState(false);
  // For simplicity, we'll position the popover below the card.
  // More complex positioning would require calculating button's rect.
  // const [previewPositionStyle, setPreviewPositionStyle] = useState<React.CSSProperties>({});
  const cardRef = useRef<HTMLDivElement>(null); // Ref for the card itself for relative positioning

  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  // Format date
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { 
      year: 'numeric', 
      month: 'short', 
      day: 'numeric' 
    });
  };
  
  return (
    <div ref={cardRef} className="relative"> {/* Wrapper for relative positioning of popover */}
      <GlassCard
        ref={setNodeRef}
        style={style}
        className={`p-4 h-full ${isDragging ? 'opacity-75 shadow-2xl z-50' : ''}`}
        delay={index}
        {...attributes}
      >
        {/* Drag handle area (optional, if you don't want the whole card to be a drag target) */}
        {/* <div {...listeners} className="cursor-grab p-2 absolute top-0 right-0"> <GripVertical /> </div> */}

        <div className="flex justify-between items-start mb-3">
          <div
            {...listeners} // Apply listeners here to make this section the drag handle
            className="flex items-center gap-2 cursor-grab" // Add cursor-grab
          >
            <img
            src={bookmark.favicon}
            alt=""
            className="w-6 h-6 rounded"
            onError={(e) => {
              const target = e.target as HTMLImageElement;
              target.onerror = null;
              target.src = 'data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIyNCIgaGVpZ2h0PSIyNCIgdmlld0JveD0iMCAwIDI0IDI0IiBmaWxsPSJub25lIiBzdHJva2U9ImN1cnJlbnRDb2xvciIgc3Ryb2tlLXdpZHRoPSIyIiBzdHJva2UtbGluZWNhcD0icm91bmQiIHN0cm9rZS1saW5lam9pbj0icm91bmQiIGNsYXNzPSJsdWNpZGUgbHVjaWRlLWdsb2JlIj48Y2lyY2xlIGN4PSIxMiIgY3k9IjEyIiByPSIxMCIvPjxsaW5lIHgxPSIyIiB5MT0iMTIiIHgyPSIyMiIgeTI9IjEyIi8+PHBhdGggZD0iTTEyIDJhMTUuMyAxNS4zIDAgMCAxIDQgMTAgMTUuMyAxNS4zIDAgMCAxLTQgMTAgMTUuMyAxNS4zIDAgMCAxLTQtMTAgMTUuMyAxNS4zIDAgMCAxIDQtMTB6Ii8+PC9zdmc+';
            }}
          />
          <div className="flex items-center gap-1">
            <span className="text-white/90 text-sm">
              {bookmark.isPublic ? <Globe size={14} /> : <Lock size={14} />}
            </span>
            <span className="text-white/60 text-xs">{bookmark.collection}</span>
          </div>
        </div>
        
        <div className="flex gap-1">
          <motion.button
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            onClick={() => toggleFavorite(bookmark.id)}
            className={`p-1.5 rounded-full ${bookmark.isFavorite 
              ? 'text-red-400' 
              : 'text-white/40 hover:text-white/70'}`}
          >
              <motion.button
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                onClick={(e) => { e.stopPropagation(); setShowPreview(!showPreview); }}
                className="p-1.5 rounded-full text-white/40 hover:text-white/70"
                aria-label="Toggle preview"
              >
                <Eye size={16} />
              </motion.button>

              <motion.button
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                onClick={(e) => { e.stopPropagation(); toggleFavorite(bookmark.id);}}
                className={`p-1.5 rounded-full ${bookmark.isFavorite
                  ? 'text-red-400'
                  : 'text-white/40 hover:text-white/70'}`}
              >
                <Heart size={16} fill={bookmark.isFavorite ? 'rgba(248, 113, 113, 1)' : 'none'} />
              </motion.button>

              <motion.button
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                onClick={(e) => { e.stopPropagation(); deleteBookmark(bookmark.id);}}
                className="p-1.5 rounded-full text-white/40 hover:text-white/70"
              >
                <Trash size={16} />
              </motion.button>
            </div>
          </div>
          
          <h3
        {...listeners} // Also make title draggable
        className="font-semibold text-white mb-1 line-clamp-1 cursor-grab"
      >
        {bookmark.title}
      </h3>
      
      <a 
        href={bookmark.url}
        target="_blank"
        rel="noopener noreferrer"
        className="text-primary/80 text-sm flex items-center gap-1 mb-2 hover:text-primary transition-colors line-clamp-1"
      >
        {bookmark.url.replace(/^https?:\/\/(www\.)?/, '')}
        <ExternalLink size={12} />
      </a>
      
      <p className="text-white/70 text-sm mb-3 line-clamp-2">
        {bookmark.description}
      </p>
      
      <div className="flex flex-wrap gap-1.5 mb-3">
        {bookmark.tags.map((tag, i) => (
          <TagPill key={i} tag={tag} />
        ))}
      </div>
      
      <div className="text-white/50 text-xs">
        Added on {formatDate(bookmark.createdAt)}
      </div>
    </GlassCard>

    {/* Popover Render */}
    <BookmarkPreviewPopover
      url={bookmark.url}
      isVisible={showPreview}
      onClose={() => setShowPreview(false)}
      style={{
        // Position popover below the card. Adjust as needed.
        top: 'calc(100% + 10px)', // 100% of card height + 10px margin
        left: '0',
        // Ensure it doesn't go off-screen if card is near the edge.
        // More sophisticated logic might be needed for robust edge detection.
        // transform: cardRef.current && cardRef.current.getBoundingClientRect().right > window.innerWidth - 320 ? 'translateX(-100%)' : 'none',
      }}
    />
  </div>
  );
};

export default BookmarkCard;