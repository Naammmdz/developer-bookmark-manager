import React, { useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import { useBookmarks } from '../../context/BookmarkContext';
import { useAuth } from '../../context/AuthContext';
import { Search, Bookmark, Settings, Plus } from 'lucide-react';
import NeonButton from '../ui/NeonButton';
import { Link } from 'react-router-dom'; // Added Link
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
    selectedTag,
    setSelectedTag,
    selectedDateRange,
    setSelectedDateRange,
    availableTags,
    // Bulk selection
    isBulkSelectMode,
    selectedBookmarkIds,
    toggleBulkSelectMode,
  } = useBookmarks();
  const { currentUser, logout } = useAuth();
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
        case 's':
          event.preventDefault();
          openSettingsModal();
          break;
        default:
          // Do nothing for other keys
          break;
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [openModal, openSettingsModal]);
  
  const baseSelectClasses = "py-2 px-3 rounded-lg bg-white/5 border border-white/10 focus:border-primary/50 focus:ring-1 focus:ring-primary/50 text-white/90 outline-none transition-all appearance-none text-sm";

  return (
    <motion.header
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      className="sticky top-0 z-50 backdrop-blur-xl bg-background-dark/60 border-b border-white/10"
    >
      <div className="container mx-auto px-4 py-4 flex items-center justify-between">
        {/* Logo */}
        <motion.div
          className="flex items-center gap-2"
          whileHover={{ scale: 1.02 }}
        >
          <Bookmark size={24} className="text-primary" />
          <h1 className="text-xl font-bold bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
            DevBookmarks
          </h1>
        </motion.div>
        
        {/* Search and Filter Section - Desktop */}
        <div className="flex-1 flex justify-center px-4 hidden md:flex">
          <div className="relative max-w-2xl w-full flex items-center gap-2">
            {/* Search Bar */}
            <div className="flex-1 relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Search size={16} className="text-white/50" />
              </div>
              <input
                ref={searchInputRef}
                type="text"
                placeholder="Search bookmarks..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full py-2 pl-10 pr-4 rounded-lg bg-white/5 border border-white/10 focus:border-primary/50 focus:ring-1 focus:ring-primary/50 backdrop-blur-md text-white/90 placeholder-white/50 outline-none transition-all text-sm"
              />
              <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
                <ShortcutIndicator keys={['/']} />
              </div>
            </div>

            {/* Tag Filter */}
            <select
              value={selectedTag || ''}
              onChange={(e) => setSelectedTag(e.target.value || null)}
              className={baseSelectClasses}
            >
              <option value="">All Tags</option>
              {availableTags.map(tag => (
                <option key={tag} value={tag}>{tag}</option>
              ))}
            </select>

            {/* Date Range Filter */}
            <select
              value={selectedDateRange || 'all'}
              onChange={(e) => setSelectedDateRange(e.target.value === 'all' ? null : e.target.value)}
              className={baseSelectClasses}
            >
              <option value="all">Anytime</option>
              <option value="today">Today</option>
              <option value="last7days">Last 7 days</option>
              <option value="last30days">Last 30 days</option>
            </select>
          </div>
        </div>
        
        {/* Action Buttons */}
        {/* Ensure this div doesn't shrink if search/filter area grows */}
        <div className="flex items-center gap-2 flex-shrink-0">
          <div className="flex items-center gap-1">
            <NeonButton
              onClick={openModal}
              color="accent"
              icon={<Plus size={16} />}
            >
              Add New
            </NeonButton>
            <ShortcutIndicator keys={['A']} />
          </div>
          
          {currentUser ? (
            <>
              {/* Wrapped welcome message with Link */}
              <Link to="/profile" className="text-white/90 text-sm hover:text-primary transition-colors hidden sm:inline px-3 py-2 rounded-md">
                Welcome, {currentUser.displayName || currentUser.email}
              </Link>
              <button
                onClick={logout}
                className="p-2 rounded-lg bg-red-500/80 text-white hover:bg-red-500/100 transition-all text-sm"
              >
                Logout
              </button>
            </>
          ) : (
            <>
              <button
                onClick={openLoginModal} // Modified onClick
                className="p-2 rounded-lg bg-primary/80 text-white hover:bg-primary/100 transition-all text-sm"
              >
                Login
              </button>
              <button
                onClick={openRegisterModal} // Modified onClick
                className="p-2 rounded-lg bg-secondary/80 text-white hover:bg-secondary/100 transition-all text-sm"
              >
                Register
              </button>
            </>
          )}
          <div className="flex items-center gap-1">
             <button
              onClick={toggleBulkSelectMode}
              className={`p-2 rounded-lg text-sm transition-all ${
                isBulkSelectMode
                  ? 'bg-red-500/80 hover:bg-red-500/100 text-white'
                  : 'bg-blue-500/80 hover:bg-blue-500/100 text-white'
              }`}
            >
              {isBulkSelectMode
                ? `Cancel (${selectedBookmarkIds.length})`
                : 'Bulk Select'}
            </button>
            {/* No shortcut indicator for bulk select for now */}
          </div>
          <div className="flex items-center gap-1">
            <button
              onClick={openSettingsModal} // Added onClick handler
              className="p-2 rounded-full bg-white/5 border border-white/10 hover:bg-white/10 transition-all"
              aria-label="Open settings" // Added aria-label
            >
              <Settings size={18} className="text-white/70" />
            </button>
            <ShortcutIndicator keys={['S']} />
          </div>
        </div>
      </div>
      
      {/* Mobile Search and Filters */}
      <div className="md:hidden px-4 pb-4 space-y-3">
        {/* Mobile Search Input */}
        <div className="relative">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <Search size={16} className="text-white/50" />
          </div>
          <input
            type="text"
            placeholder="Search bookmarks..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full py-2 pl-10 pr-4 rounded-lg bg-white/5 border border-white/10 focus:border-primary/50 focus:ring-1 focus:ring-primary/50 backdrop-blur-md text-white/90 placeholder-white/50 outline-none transition-all text-sm"
            // Note: Mobile search does not get the ref or shortcut indicator for now
            // to avoid potential issues with multiple elements having the same ref.
            // This could be enhanced later if needed.
          />
        </div>
        {/* Mobile Tag Filter */}
        <select
          value={selectedTag || ''}
          onChange={(e) => setSelectedTag(e.target.value || null)}
          className={`${baseSelectClasses} w-full`}
        >
          <option value="">All Tags</option>
          {availableTags.map(tag => (
            <option key={`mobile-${tag}`} value={tag}>{tag}</option>
          ))}
        </select>
        {/* Mobile Date Range Filter */}
        <select
          value={selectedDateRange || 'all'}
          onChange={(e) => setSelectedDateRange(e.target.value === 'all' ? null : e.target.value)}
          className={`${baseSelectClasses} w-full`}
        >
          <option value="all">Anytime</option>
          <option value="today">Today</option>
          <option value="last7days">Last 7 days</option>
          <option value="last30days">Last 30 days</option>
        </select>
      </div>
    </motion.header>
  );
};

export default Header;