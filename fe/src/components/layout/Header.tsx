import React, { useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import { useBookmarks } from '../../context/BookmarkContext';
// import { useAuth } from '../../context/AuthContext'; // UserMenu will handle auth
import { Search, Bookmark, Plus } from 'lucide-react'; // Removed Settings
import NeonButton from '../ui/NeonButton';
// import { Link } from 'react-router-dom'; // UserMenu will handle profile links
import ShortcutIndicator from '../ui/ShortcutIndicator';

// Added props for modal control
interface HeaderProps {
  openLoginModal: () => void;
  openRegisterModal: () => void;
  openSettingsModal: () => void; // Added openSettingsModal to props
}

const Header: React.FC<HeaderProps> = ({ openLoginModal, openRegisterModal, openSettingsModal }) => {
  const {
    searchTerm,
    setSearchTerm,
    openModal,
    // openSettingsModal prop is still passed but not used directly here for 's' hotkey
  } = useBookmarks();
  // const { currentUser, logout } = useAuth(); // UserMenu will handle this
  const searchInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      const target = event.target as HTMLElement;
      const isTyping = target.tagName === 'INPUT' || target.tagName === 'TEXTAREA' || target.isContentEditable;

      if (isTyping) {
        // If typing in the search input itself and pressing '/', do nothing special
        if (event.key === '/' && target === searchInputRef.current) {
          return;
        }
        // For other keys or other inputs, don't trigger global hotkeys
        if (event.key.toLowerCase() === 'a' || event.key.toLowerCase() === 's' || event.key === '/') {
          return;
        }
      }

      switch (event.key.toLowerCase()) {
        case '/':
          event.preventDefault();
          searchInputRef.current?.focus();
          break;
        case 'a':
          event.preventDefault();
          openModal();
          break;
        // case 's': // Settings hotkey 's' temporarily removed
        //   event.preventDefault();
        //   openSettingsModal(); // openSettingsModal prop still exists for UserMenu
        //   break;
        default:
          // Do nothing for other keys
          break;
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [openModal]); // Removed openSettingsModal from dependencies for now
  
  // const baseSelectClasses = "py-2 px-3 rounded-lg bg-white/5 border border-white/10 focus:border-primary/50 focus:ring-1 focus:ring-primary/50 text-white/90 outline-none transition-all appearance-none text-sm";

  return (
    <motion.header
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      className="sticky top-0 z-40 backdrop-blur-xl bg-background-dark/60 border-b border-white/10" // z-40 to be below modals (z-50)
    >
      <div className="container mx-auto px-6 py-4 flex items-center justify-between"> {/* px-6 as per plan */}
        {/* Left: Logo */}
        <div className="flex items-center space-x-2"> {/* space-x-2 as per plan */}
          <Bookmark size={28} className="text-primary" /> {/* size 28 as per plan */}
          <h1 className="text-xl font-bold bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
            DevBookmarks
          </h1>
        </div>

        {/* Center: Search (Expanded) */}
        <div className="flex-1 max-w-2xl mx-8 hidden md:flex"> {/* mx-8, hidden md:flex as per plan */}
          <div className="relative w-full">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Search size={18} className="text-white/50" /> {/* size 18 as per plan */}
            </div>
            <input
              ref={searchInputRef}
              type="text"
              placeholder="Search bookmarks, tags, descriptions..." // New placeholder
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full py-2.5 pl-10 pr-10 rounded-lg bg-white/5 border border-white/10 focus:border-primary/50 focus:ring-1 focus:ring-primary/50 backdrop-blur-md text-white/90 placeholder-white/50 outline-none transition-all text-sm" // py-2.5, pr-10 for shortcut
            />
            <div className="absolute inset-y-0 right-0 pr-3 flex items-center"> {/* Removed pointer-events-none */}
              <ShortcutIndicator keys={['/']} />
            </div>
          </div>
        </div>
        
        {/* Right: Actions */}
        <div className="flex items-center space-x-4"> {/* space-x-4 as per plan */}
          <div className="flex items-center gap-1">
            <NeonButton
              onClick={openModal}
              color="accent"
              icon={<Plus size={18} />} /* size 18 */
              className="px-4 py-2 text-sm" /* Example: Ensure button padding is appropriate */
            >
              Add Bookmark {/* New Text */}
            </NeonButton>
            <ShortcutIndicator keys={['A']} />
          </div>
          <div>{/* UserMenu will go here. Props: openLoginModal, openRegisterModal, openSettingsModal, currentUser, logout */}</div>
        </div>
      </div>
      {/* Mobile Search and Filters section removed */}
    </motion.header>
  );
};

export default Header;