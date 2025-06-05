import React from 'react';
import { useBookmarks } from '../../context/BookmarkContext';
import { useAuth } from '../../context/AuthContext';
import { Bookmark, Grid, List, ListPlus, User, Search } from 'lucide-react'; // Added new icons

interface HeaderProps {
  openLoginModal: () => void;
  openSettingsModal: () => void;
  // openRegisterModal is removed as it's not used in the new design
}

const Header: React.FC<HeaderProps> = ({ openLoginModal, openSettingsModal }) => {
  const { searchTerm, setSearchTerm, openModal } = useBookmarks();
  const { currentUser } = useAuth();

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value); // setSearchTerm is from useBookmarks context
  };

  const handleProfileClick = () => {
    if (currentUser) {
      openSettingsModal();
    } else {
      openLoginModal();
    }
  };

  return (
    <div className="flex items-center justify-between"> {/* Root div as specified */}
      {/* Logo */}
      <div className="flex items-center gap-2">
        <Bookmark size={28} className="text-primary" /> {/* Logo Icon */}
        <span className="text-xl font-semibold text-white">DevMarks</span> {/* Logo Text */}
      </div>

      {/* Search Bar */}
      <div className="flex-1 max-w-lg mx-6 relative"> {/* Adjusted for better spacing and icon */}
        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
          <Search size={18} className="text-white/40" />
        </div>
        <input
          type="search"
          placeholder="Search bookmarks, tags, collections..."
          value={searchTerm}
          onChange={handleSearchChange}
          className="w-full pl-10 pr-4 py-2 rounded-lg bg-black/20 border border-white/10 focus:ring-2 focus:ring-primary/70 focus:border-primary/70 outline-none placeholder-white/40 text-white text-sm transition-colors duration-300 focus:bg-black/30"
        />
      </div>

      {/* Action Buttons */}
      <div className="flex items-center gap-2">
        {/* Grid/List Toggles */}
        <button
          className="p-2 text-white/70 hover:text-white hover:bg-white/10 rounded-md transition-colors"
          title="Grid View"
        >
          <Grid size={20} />
        </button>
        <button
          className="p-2 text-white/70 hover:text-white hover:bg-white/10 rounded-md transition-colors"
          title="List View"
        >
          <List size={20} />
        </button>

        {/* Separator */}
        <div className="h-6 w-px bg-white/10 mx-1"></div>

        {/* Add Bookmark Button */}
        <button
          onClick={() => openModal()} // openModal is from useBookmarks context
          className="flex items-center gap-2 px-3 py-2 bg-primary hover:bg-primary/80 text-white rounded-lg text-sm font-medium transition-colors"
          title="Add new bookmark"
        >
          <ListPlus size={18} />
          <span>Add New</span>
        </button>

        {/* Profile Icon Button */}
        <button
          onClick={handleProfileClick}
          className="p-1.5 hover:bg-white/10 rounded-full transition-colors"
          title={currentUser ? "Profile Settings" : "Login"}
        >
          {currentUser && currentUser.photoURL ? (
            <img src={currentUser.photoURL} alt="Profile" className="w-7 h-7 rounded-full object-cover" />
          ) : (
            <User size={22} className="text-white/70 hover:text-white" />
          )}
        </button>
      </div>
    </div>
  );
};

export default Header;