import React from 'react';
import { motion } from 'framer-motion';
import { useBookmarks } from '../../context/BookmarkContext';
import { Search, Bookmark, Settings, Plus } from 'lucide-react';
import NeonButton from '../ui/NeonButton';

const Header: React.FC = () => {
  const { searchTerm, setSearchTerm, openModal } = useBookmarks();
  
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
        
        {/* Search Bar */}
        <div className="relative max-w-md w-full mx-4 hidden md:block">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <Search size={16} className="text-white/50" />
          </div>
          <input
            type="text"
            placeholder="Search bookmarks..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full py-2 pl-10 pr-4 rounded-lg bg-white/5 border border-white/10 focus:border-primary/50 focus:ring-1 focus:ring-primary/50 backdrop-blur-md text-white/90 placeholder-white/50 outline-none transition-all"
          />
        </div>
        
        {/* Action Buttons */}
        <div className="flex items-center gap-2">
          <NeonButton
            onClick={openModal}
            color="accent"
            icon={<Plus size={16} />}
          >
            Add New
          </NeonButton>
          
          <button className="p-2 rounded-full bg-white/5 border border-white/10 hover:bg-white/10 transition-all">
            <Settings size={18} className="text-white/70" />
          </button>
        </div>
      </div>
      
      {/* Mobile Search */}
      <div className="md:hidden px-4 pb-4">
        <div className="relative">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <Search size={16} className="text-white/50" />
          </div>
          <input
            type="text"
            placeholder="Search bookmarks..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full py-2 pl-10 pr-4 rounded-lg bg-white/5 border border-white/10 focus:border-primary/50 focus:ring-1 focus:ring-primary/50 backdrop-blur-md text-white/90 placeholder-white/50 outline-none transition-all"
          />
        </div>
      </div>
    </motion.header>
  );
};

export default Header;