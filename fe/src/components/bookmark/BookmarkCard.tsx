import React, { useState, useRef, MouseEvent } from 'react';
import { motion } from 'framer-motion';
import { Heart, ExternalLink, Trash, Globe, Lock, Eye, CheckCircle } from 'lucide-react'; // Added Eye, CheckCircle icons
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
  const {
    toggleFavorite,
    deleteBookmark,
    isBulkSelectMode,
    selectedBookmarkIds,
    toggleBookmarkSelection
  } = useBookmarks();
  const [showPreview, setShowPreview] = useState(false);
  const cardRef = useRef<HTMLDivElement>(null);

  const isSelected = selectedBookmarkIds.includes(bookmark.id);

  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id, disabled: isBulkSelectMode });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    // Add opacity change if bulk selecting and not selected
    opacity: isBulkSelectMode && !isSelected ? 0.7 : 1,
  };

  const handleCardClick = (event: MouseEvent<HTMLDivElement>) => {
    if (isBulkSelectMode) {
      // Prevent card click from propagating to link if link is also a target
      // event.stopPropagation(); // Not strictly needed if link has its own check
      toggleBookmarkSelection(bookmark.id);
    }
    // If not in bulk select mode, do nothing here, allow propagation for link clicks
  };

  const handleLinkClick = (event: MouseEvent<HTMLAnchorElement>) => {
    if (isBulkSelectMode) {
      event.preventDefault(); // Prevent link navigation
      // Optionally, could also toggle selection here if preferred,
      // but main card click already handles it.
      // toggleBookmarkSelection(bookmark.id);
    }
    // If not in bulk select mode, default link behavior is allowed.
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
    <div
      ref={cardRef}
      className="relative"
      onClick={handleCardClick} // Handle click for selection on the wrapper
    >
      <GlassCard
        ref={setNodeRef}
        style={style}
        className={`p-4 h-full transition-all duration-200 ease-in-out ${isDragging ? 'opacity-75 shadow-2xl z-50' : ''} ${isBulkSelectMode && isSelected ? 'border-primary border-2 shadow-primary/30' : 'border-white/10'}`}
        delay={index} // This might still conflict with dnd-kit transitions or selection opacity
        {...attributes} // Spread attributes for dnd-kit
        // Listeners are conditionally applied below for drag handles
      >
        {isBulkSelectMode && isSelected && (
          <div className="absolute top-2 right-2 bg-primary/80 rounded-full p-1 z-20">
            <CheckCircle size={16} className="text-white" />
          </div>
        )}

        <div className="flex justify-between items-start mb-3">
          <div
            {...(!isBulkSelectMode ? listeners : {})} // Only apply listeners if not in bulk select mode
            className={`flex items-center gap-2 ${!isBulkSelectMode ? 'cursor-grab' : 'cursor-default'}`}
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
        
        <div className="flex gap-1"> {/* Action buttons container */}
          <motion.button // Preview Button
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            onClick={(e) => { e.stopPropagation(); setShowPreview(!showPreview); }}
            className="p-1.5 rounded-full text-white/40 hover:text-white/70"
            aria-label="Toggle preview"
          >
            <Eye size={16} />
          </motion.button>

          <motion.button // Favorite Button
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            onClick={(e) => { e.stopPropagation(); toggleFavorite(bookmark.id);}}
            className={`p-1.5 rounded-full ${bookmark.isFavorite 
              ? 'text-red-400' 
              : 'text-white/40 hover:text-white/70'}`}
            aria-label="Toggle favorite"
          >
            <Heart size={16} fill={bookmark.isFavorite ? 'rgba(248, 113, 113, 1)' : 'none'} />
          </motion.button>
          
          <motion.button // Delete Button
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            onClick={(e) => { e.stopPropagation(); deleteBookmark(bookmark.id);}}
            className="p-1.5 rounded-full text-white/40 hover:text-white/70"
            aria-label="Delete bookmark"
          >
            <Trash size={16} />
          </motion.button>
        </div>
      </div>

      <h3
        {...(!isBulkSelectMode ? listeners : {})} // Only apply listeners if not in bulk select mode
        className={`font-semibold text-white mb-1 line-clamp-1 ${!isBulkSelectMode ? 'cursor-grab' : 'cursor-default'}`}
      >
        {bookmark.title}
      </h3>
      
      <a 
        href={bookmark.url}
        target="_blank"
        rel="noopener noreferrer"
        onClick={handleLinkClick} // Added click handler for link
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