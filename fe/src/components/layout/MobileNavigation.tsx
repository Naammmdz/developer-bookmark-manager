import React from 'react';
import { motion } from 'framer-motion';
import { useBookmarks } from '../../context/BookmarkContext';
import { Bookmark, Heart, Layers, List, Settings, Plus } from 'lucide-react';

const MobileNavigation: React.FC = () => {
  const { activeCollection, setActiveCollection, openModal } = useBookmarks();
  
  const navItems = [
    { name: 'All Bookmarks', icon: <Bookmark size={20} /> },
    { name: 'Favorites', icon: <Heart size={20} /> },
    { name: 'Collections', icon: <Layers size={20} /> },
    { name: 'Settings', icon: <Settings size={20} /> },
  ];
  
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="md:hidden fixed bottom-0 left-0 right-0 z-40 backdrop-blur-xl bg-background-dark/80 border-t border-white/10"
    >
      <div className="flex justify-around items-center py-3 px-2">
        {navItems.map((item) => (
          <button
            key={item.name}
            onClick={() => item.name !== 'Settings' && setActiveCollection(item.name)}
            className={`flex flex-col items-center justify-center py-1 px-3 rounded-lg ${
              activeCollection === item.name
                ? 'text-primary'
                : 'text-white/60'
            }`}
          >
            {item.icon}
            <span className="text-xs mt-1">{item.name}</span>
          </button>
        ))}
        
        <button
          onClick={openModal}
          className="flex flex-col items-center justify-center py-1 px-3 rounded-lg text-accent"
        >
          <Plus size={20} />
          <span className="text-xs mt-1">Add</span>
        </button>
      </div>
    </motion.div>
  );
};

export default MobileNavigation;