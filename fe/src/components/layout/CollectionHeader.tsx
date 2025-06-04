import React from 'react';
import { motion } from 'framer-motion';
import { useBookmarks } from '../../context/BookmarkContext';
import { Bookmark, Layers, Server, Palette, FileText, Heart, Clock } from 'lucide-react';

const CollectionHeader: React.FC = () => {
  const { activeCollection, filteredBookmarks } = useBookmarks();
  
  // Map collection names to icons
  const getIcon = (collection: string) => {
    const iconMap: { [key: string]: React.ReactNode } = {
      'All Bookmarks': <Bookmark size={24} />,
      'Frontend Resources': <Layers size={24} />,
      'Backend Resources': <Server size={24} />,
      'CSS Resources': <Palette size={24} />,
      'Documentation': <FileText size={24} />,
      'Favorites': <Heart size={24} />,
      'Recently Added': <Clock size={24} />
    };
    
    return iconMap[collection] || <Bookmark size={24} />;
  };
  
  // Get color class based on collection
  const getCollectionColor = (collection: string) => {
    const colorMap: { [key: string]: string } = {
      'All Bookmarks': 'text-primary',
      'Frontend Resources': 'text-secondary',
      'Backend Resources': 'text-blue-400',
      'CSS Resources': 'text-accent',
      'Documentation': 'text-yellow-400',
      'Favorites': 'text-red-400',
      'Recently Added': 'text-purple-400'
    };
    
    return colorMap[collection] || 'text-primary';
  };
  
  return (
    <motion.div
      initial={{ opacity: 0, y: -10 }}
      animate={{ opacity: 1, y: 0 }}
      className="mb-6"
    >
      <div className="flex items-center gap-3">
        <span className={getCollectionColor(activeCollection)}>
          {getIcon(activeCollection)}
        </span>
        <div>
          <h2 className="text-2xl font-bold text-white">{activeCollection}</h2>
          <p className="text-white/60">
            {filteredBookmarks.length} bookmark{filteredBookmarks.length !== 1 ? 's' : ''}
          </p>
        </div>
      </div>
    </motion.div>
  );
};

export default CollectionHeader;