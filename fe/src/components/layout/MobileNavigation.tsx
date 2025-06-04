import React from 'react';
import { motion } from 'framer-motion';
import { useBookmarks } from '../../context/BookmarkContext';
import { useAuth } from '../../context/AuthContext'; // Added for context
import { Bookmark, Heart, Layers, Settings, Plus } from 'lucide-react'; // Removed List as it's not used

// Define Props for MobileNavigation
interface MobileNavigationProps {
  openCollectionsModal: () => void;
  openSettingsModal: () => void;
}

const MobileNavigation: React.FC<MobileNavigationProps> = ({ openCollectionsModal, openSettingsModal }) => {
  const { activeCollection, setActiveCollection, openModal } = useBookmarks();
  const { currentUser } = useAuth(); // Added for context, not used directly in this change

  // Adjusted navItems to include specific onClick handlers or identify them for conditional logic
  const navItems = [
    { id: 'all-bookmarks', name: 'All Bookmarks', icon: <Bookmark size={20} />, action: () => setActiveCollection('All Bookmarks') },
    { id: 'favorites', name: 'Favorites', icon: <Heart size={20} />, action: () => setActiveCollection('Favorites') },
    { id: 'collections', name: 'Collections', icon: <Layers size={20} />, action: openCollectionsModal },
    { id: 'settings', name: 'Settings', icon: <Settings size={20} />, action: openSettingsModal },
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
            key={item.id}
            onClick={item.action} // Use the action from navItems
            className={`flex flex-col items-center justify-center py-1 px-3 rounded-lg transition-colors ${
              // Highlight based on activeCollection for relevant items, or other criteria for modals if needed
              (item.id === 'all-bookmarks' || item.id === 'favorites') && activeCollection === item.name
                ? 'text-primary'
                : 'text-white/60 hover:text-white'
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