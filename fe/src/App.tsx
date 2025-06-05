import React, { useState } from 'react';
import { Routes, Route, Navigate, Outlet } from 'react-router-dom';
import { BookmarkProvider, useBookmarks } from './context/BookmarkContext';
import { useAuth } from './context/AuthContext';

import ProfilePage from './pages/ProfilePage';
import Header from './components/layout/Header';
import Sidebar from './components/layout/Sidebar';
import BookmarkGrid from './components/bookmark/BookmarkGrid';
// CollectionHeader removed as it's no longer used in BookmarksViewWithSidebar
import MobileNavigation from './components/layout/MobileNavigation';
import AddBookmarkModal from './components/bookmark/AddBookmarkModal';
import LoginModal from './components/auth/LoginModal';
import RegisterModal from './components/auth/RegisterModal';
import SettingsModal from './components/settings/SettingsModal'; // Added Import
import BackgroundAnimation from './components/layout/BackgroundAnimation';
import KeyboardShortcutsButton from './components/ui/KeyboardShortcutsButton';
import { Archive, FolderKanban, Heart, Globe, Filter, ArrowUpDown } from 'lucide-react'; // Icons for Stats Cards & BookmarksView

// Props for AppLayout
interface AppLayoutProps {
  openLoginModal: () => void;
  openRegisterModal: () => void;
  openSettingsModal: () => void;
  openCollectionsModal: () => void;
}

const AppLayout: React.FC<AppLayoutProps> = ({
  openLoginModal,
  openRegisterModal,
  openSettingsModal,
  openCollectionsModal
}) => {
  const { isModalOpen: isAddBookmarkModalOpen } = useBookmarks();

  return (
    <div className="flex min-h-screen text-white"> {/* Root div */}
      <BackgroundAnimation className="absolute inset-0 -z-10" />

      {/* Sidebar */}
      <aside className="fixed left-0 top-0 h-screen w-64 bg-black/20 backdrop-blur-lg border-r border-white/10 z-40 overflow-y-auto flex flex-col">
        <Sidebar />
      </aside>

      {/* Main content area */}
      <div className="ml-64 flex-1 flex flex-col"> {/* Main content div */}
        {/* Header */}
        <header className="sticky top-0 z-30 bg-black/20 backdrop-blur-lg border-b border-white/10 p-4">
          <Header
            openLoginModal={openLoginModal}
            openRegisterModal={openRegisterModal}
            openSettingsModal={openSettingsModal}
          />
        </header>

        {/* Stats Cards Section */}
        <section className="p-6">
          <div className="grid grid-cols-4 gap-6 mb-8">
            {/* Card 1: Total Bookmarks */}
            <div className="bg-black/20 backdrop-blur-lg border border-white/10 rounded-xl p-6">
              <div className="flex items-center justify-between mb-2">
                <p className="text-sm text-white/70">Total Bookmarks</p>
                <Archive size={20} className="text-primary" />
              </div>
              <p className="text-3xl font-semibold text-white">1,234</p>
            </div>
            {/* Card 2: Collections */}
            <div className="bg-black/20 backdrop-blur-lg border border-white/10 rounded-xl p-6">
              <div className="flex items-center justify-between mb-2">
                <p className="text-sm text-white/70">Collections</p>
                <FolderKanban size={20} className="text-primary" />
              </div>
              <p className="text-3xl font-semibold text-white">23</p>
            </div>
            {/* Card 3: Favorites */}
            <div className="bg-black/20 backdrop-blur-lg border border-white/10 rounded-xl p-6">
              <div className="flex items-center justify-between mb-2">
                <p className="text-sm text-white/70">Favorites</p>
                <Heart size={20} className="text-primary" />
              </div>
              <p className="text-3xl font-semibold text-white">128</p>
            </div>
            {/* Card 4: Public */}
            <div className="bg-black/20 backdrop-blur-lg border border-white/10 rounded-xl p-6">
              <div className="flex items-center justify-between mb-2">
                <p className="text-sm text-white/70">Public</p>
                <Globe size={20} className="text-primary" />
              </div>
              <p className="text-3xl font-semibold text-white">7</p>
            </div>
          </div>
        </section>

        {/* Outlet for child route components */}
        <main className="p-6 flex-1 overflow-y-auto">
          <Outlet /> {/* BookmarksViewWithSidebar or ProfileView will render here */}
        </main>
      </div>

      {/* MobileNavigation - retains fixed positioning & high z-index */}
      <MobileNavigation
        openSettingsModal={openSettingsModal}
        openCollectionsModal={openCollectionsModal}
      />

      {/* KeyboardShortcutsButton - retains fixed positioning & high z-index */}
      <div className="fixed bottom-6 right-6 z-50">
        <KeyboardShortcutsButton />
      </div>

      {/* AddBookmarkModal is controlled by BookmarkContext, so it's rendered if its state is open */}
      {isAddBookmarkModalOpen && <AddBookmarkModal />}
    </div>
  );
};

const BookmarksViewWithSidebar: React.FC = () => (
  <div className="flex-1 flex flex-col min-h-screen"> {/* p-6 removed from root */}
    {/* New Page Title Section */}
    <section className="px-6 pt-6 mb-6"> {/* Added pt-6 to match previous overall padding for top */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-semibold text-white">📚 All Bookmarks</h2>
          {/* Placeholder count, can be dynamic later */}
          <p className="text-sm text-white/70">1,234 bookmarks found</p>
        </div>
        <div className="flex items-center gap-2">
          <button className="flex items-center gap-2 px-3 py-1.5 bg-black/20 hover:bg-black/30 border border-white/10 rounded-md text-sm text-white/90 transition-colors">
            <Filter size={16} /> Filter
          </button>
          <button className="flex items-center gap-2 px-3 py-1.5 bg-black/20 hover:bg-black/30 border border-white/10 rounded-md text-sm text-white/90 transition-colors">
            <ArrowUpDown size={16} /> Sort
          </button>
        </div>
      </div>
    </section>

    {/* Recently Accessed Section (Wrapped) */}
    {/* The outer div className="pb-4" is replaced by this section */}
    <section className="px-6 mb-8">
      <div className="rounded-2xl bg-black/20 backdrop-blur-lg border border-white/10 px-6 py-4 flex items-center gap-3 overflow-x-auto"> {/* Updated bg and border like other new elements */}
        <div className="text-white/80 font-medium mr-2">Recently Accessed</div>
        {/* Example recently accessed items - kept for structure */}
        <span className="rounded-lg bg-white/10 px-3 py-1 text-white/80 text-sm">React Documentation</span>
        <span className="rounded-lg bg-white/10 px-3 py-1 text-white/80 text-sm">Node.js Best Practices</span>
        <span className="rounded-lg bg-white/10 px-3 py-1 text-white/80 text-sm">Tailwind CSS Docs</span>
        <span className="rounded-lg bg-white/10 px-3 py-1 text-white/80 text-sm">TypeScript Handbook</span>
        <span className="rounded-lg bg-white/10 px-3 py-1 text-white/80 text-sm">Express.js Guide</span>
      </div>
    </section>

    {/* Bookmark Grid Section (Wrapped) */}
    {/* The main className="flex-1 pb-8" is replaced by this section */}
    {/* flex-1 might be needed if this section should grow, but AppLayout's main already has flex-1 */}
    <section className="px-6 pb-6 flex-1"> {/* Added flex-1 here to allow grid to expand */}
      <BookmarkGrid />
    </section>
  </div>
);

const ProfileView: React.FC = () => (
    // Adjusted padding for consistency if needed, though p-6 is now on AppLayout's content area.
    // For ProfileView, it might be better to let it control its own padding if it's not meant to be full-width like bookmarks.
    // Keeping its existing padding for now.
    <main className="flex-1 w-full px-4 py-6 md:p-6 flex justify-center items-start pt-6 md:pt-10 pb-16 md:pb-6">
        <ProfilePage />
    </main>
);


function App() {
  const { currentUser } = useAuth();
  const [isLoginModalOpen, setIsLoginModalOpen] = useState(false);
  const [isRegisterModalOpen, setIsRegisterModalOpen] = useState(false);
  const [isSettingsModalOpen, setIsSettingsModalOpen] = useState(false);
  const openCollectionsModal = () => {};

  const openLoginModal = () => setIsLoginModalOpen(true);
  const closeLoginModal = () => {
    setIsLoginModalOpen(false);
    // Potentially navigate or refresh data if needed after login
  };
  const openRegisterModal = () => setIsRegisterModalOpen(true);
  const closeRegisterModal = () => {
    setIsRegisterModalOpen(false);
    // Potentially navigate or refresh data if needed after registration
  };

  const openSettingsModal = () => setIsSettingsModalOpen(true);
  const closeSettingsModal = () => setIsSettingsModalOpen(false);

  return (
    <BookmarkProvider>
      {/* Modals are rendered here, outside of Routes, so they can be displayed over any page */}
      <LoginModal isOpen={isLoginModalOpen} onClose={closeLoginModal} />
      <RegisterModal isOpen={isRegisterModalOpen} onClose={closeRegisterModal} />
      <SettingsModal isOpen={isSettingsModalOpen} onClose={closeSettingsModal} /> {/* Render SettingsModal */}

      <Routes>
        <Route
          element={
            <AppLayout
              openLoginModal={openLoginModal}
              openRegisterModal={openRegisterModal}
              openSettingsModal={openSettingsModal}
              openCollectionsModal={openCollectionsModal}
            />
          }
        >
          <Route path="/" element={<BookmarksViewWithSidebar />} />
          <Route
            path="/profile"
            element={currentUser ? <ProfileView /> : <Navigate to="/" replace />}
          />
          {/* Add other routes that use AppLayout here */}
        </Route>
        {/* Routes that don't use AppLayout can be defined outside/sibling to this Route */}
        <Route path="*" element={<Navigate to="/" replace />} /> {/* Fallback for unmatched routes */}
      </Routes>
      {/* KeyboardShortcutsButton removed from here, now in AppLayout */}
    </BookmarkProvider>
  );
}

export default App;