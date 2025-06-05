import React from 'react';
import { motion } from 'framer-motion';
import { Bookmark, Plus } from 'lucide-react'; // Assuming Bookmark is the BookmarkIcon, Plus for the button
import SearchInput from '../ui/SearchInput';
import ViewToggle from '../ui/ViewToggle';
import UserAvatar from '../ui/UserAvatar';

interface HeaderProps {
  openLoginModal?: () => void;
  openRegisterModal?: () => void;
  openSettingsModal?: () => void;
  openAddBookmarkModal?: () => void; // To be connected if Add Bookmark button needs it
}

const Header: React.FC<HeaderProps> = ({ openSettingsModal, openAddBookmarkModal }) => {
  // glass-card classes: bg-white/5 backdrop-blur-lg border border-white/10 rounded-xl shadow-lg
  const glassCardClasses = "bg-white/5 backdrop-filter backdrop-blur-lg border border-white/10 shadow-lg";

  return (
    <motion.header
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      className={`sticky top-0 z-10 ${glassCardClasses} p-4 rounded-xl`} // Changed to rounded-xl
    >
      <div className="flex items-center justify-between">
        {/* Logo */}
        <div className="flex items-center space-x-2 shrink-0">
          <Bookmark className="w-8 h-8 text-cyan-400" /> {/* Consistent size w-8 h-8 */}
          {/* neon-text: text-cyan-400 drop-shadow-[0_0_3px_rgba(0,255,255,0.7),_0_0_5px_rgba(0,255,255,0.5)] */}
          <span
            className="text-xl font-bold text-cyan-400" // Consistent text-xl
            style={{textShadow: '0 0 3px rgba(0,255,255,0.7), 0 0 5px rgba(0,255,255,0.5), 0 0 10px rgba(0,255,255,0.3)'}} // Enhanced neon effect
          >
            DevMarks
          </span>
          <span className="text-sm opacity-70 hidden md:inline">Developer Bookmark Manager</span> {/* Consistent text-sm */}
        </div>
        
        {/* Search Bar */}
        {/* Using flex-1 max-w-md mx-8 as per original issue spec for wider search bar */}
        <div className="flex-1 max-w-md mx-4 sm:mx-8"> {/* Adjusted mx from original issue for better balance */}
          <SearchInput placeholder="Search bookmarks, tags, descriptions..." /> {/* Original placeholder */}
        </div>
        
        {/* Action Buttons */}
        <div className="flex items-center space-x-3 shrink-0"> {/* Consistent space-x-3 */}
          <ViewToggle />
          <button
            onClick={openAddBookmarkModal}
            className="bg-cyan-500 hover:bg-cyan-600 active:bg-cyan-700 text-white font-semibold py-2 px-3 rounded-lg flex items-center space-x-2 text-sm transition-colors duration-200"
          >
            <Plus size={18} />
            <span className="hidden sm:inline">Add Bookmark</span> {/* Changed back to Add Bookmark */}
          </button>
          <UserAvatar onClick={openSettingsModal} />
        </div>
      </div>
    </motion.header>
  );
};

export default Header;