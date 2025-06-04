import React from 'react';
import { motion } from 'framer-motion';
import { useBookmarks } from '../../context/BookmarkContext';
import { useAuth } from '../../context/AuthContext';
import { Search, Bookmark, Settings, Plus } from 'lucide-react';
import NeonButton from '../ui/NeonButton';
import { Link } from 'react-router-dom'; // Added Link

// Added props for modal control
interface HeaderProps {
  openLoginModal: () => void;
  openRegisterModal: () => void;
}

const Header: React.FC<HeaderProps> = ({ openLoginModal, openRegisterModal }) => {
  const {
    searchTerm,
    setSearchTerm,
    openModal,
    selectedTag,
    setSelectedTag,
    selectedDateRange,
    setSelectedDateRange,
    availableTags
  } = useBookmarks();
  const { currentUser, logout } = useAuth();
  
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
                type="text"
                placeholder="Search bookmarks..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full py-2 pl-10 pr-4 rounded-lg bg-white/5 border border-white/10 focus:border-primary/50 focus:ring-1 focus:ring-primary/50 backdrop-blur-md text-white/90 placeholder-white/50 outline-none transition-all text-sm"
              />
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
          <NeonButton
            onClick={openModal}
            color="accent"
            icon={<Plus size={16} />}
          >
            Add New
          </NeonButton>
          
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

          <button className="p-2 rounded-full bg-white/5 border border-white/10 hover:bg-white/10 transition-all">
            <Settings size={18} className="text-white/70" />
          </button>
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