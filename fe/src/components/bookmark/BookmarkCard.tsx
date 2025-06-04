import React from 'react';
import { motion } from 'framer-motion';
import { Heart, ExternalLink, Trash, Globe, Lock } from 'lucide-react';
import { useBookmarks } from '../../context/BookmarkContext';
import GlassCard from '../ui/GlassCard';
import TagPill from '../ui/TagPill';
import { Bookmark } from '../../types';

interface BookmarkCardProps {
  bookmark: Bookmark;
  index: number;
}

const BookmarkCard: React.FC<BookmarkCardProps> = ({ bookmark, index }) => {
  const { toggleFavorite, deleteBookmark } = useBookmarks();
  
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
    <GlassCard
      className="p-4 h-full"
      delay={index}
    >
      <div className="flex justify-between items-start mb-3">
        <div className="flex items-center gap-2">
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
            <Heart size={16} fill={bookmark.isFavorite ? 'rgba(248, 113, 113, 1)' : 'none'} />
          </motion.button>
          
          <motion.button
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            onClick={() => deleteBookmark(bookmark.id)}
            className="p-1.5 rounded-full text-white/40 hover:text-white/70"
          >
            <Trash size={16} />
          </motion.button>
        </div>
      </div>
      
      <h3 className="font-semibold text-white mb-1 line-clamp-1">{bookmark.title}</h3>
      
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
  );
};

export default BookmarkCard;