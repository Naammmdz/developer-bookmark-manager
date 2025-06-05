import React, { useState } from 'react';
import { Routes, Route, Navigate, Outlet } from 'react-router-dom';
import { BookmarkProvider, useBookmarks } from './context/BookmarkContext';
import { useAuth } from './context/AuthContext';

import ProfilePage from './pages/ProfilePage';
import Header from './components/layout/Header';
import Sidebar from './components/layout/Sidebar';
import BookmarkGrid from './components/bookmark/BookmarkGrid';
import CollectionHeader from './components/layout/CollectionHeader';
import MobileNavigation from './components/layout/MobileNavigation';
import AddBookmarkModal from './components/bookmark/AddBookmarkModal';
import LoginModal from './components/auth/LoginModal';
import RegisterModal from './components/auth/RegisterModal';
import SettingsModal from './components/settings/SettingsModal';
import BackgroundAnimation from './components/layout/BackgroundAnimation';
import KeyboardShortcutsButton from './components/ui/KeyboardShortcutsButton';

// New imports for StatsCard and icons
import StatsCard from './components/dashboard/StatsCard';
import { Package, Tag, Link2, Eye } from 'lucide-react'; // Example icons for StatsCards

// Props for AppLayout
interface AppLayoutProps {
  openLoginModal: () => void;
  openRegisterModal: () => void;
  openSettingsModal: () => void;
  openCollectionsModal: () => void;
  // Add openAddBookmarkModal if Header needs to trigger it from App context
  openAddBookmarkModal: () => void;
}

const AppLayout: React.FC<AppLayoutProps> = ({
  openLoginModal,
  openRegisterModal,
  openSettingsModal,
  openCollectionsModal,
  openAddBookmarkModal // Pass this to Header
}) => {
  const { isModalOpen: isAddBookmarkModalOpen } = useBookmarks();

  return (
    <div className="min-h-screen bg-transparent text-white">
      <BackgroundAnimation />
      <Sidebar />
      <div className="ml-64">
        <Header
          openLoginModal={openLoginModal}
          openRegisterModal={openRegisterModal}
          openSettingsModal={openSettingsModal}
          openAddBookmarkModal={openAddBookmarkModal} // Pass down
        />
        <main>
          <Outlet />
        </main>
      </div>
      <MobileNavigation
        openSettingsModal={openSettingsModal}
        openCollectionsModal={openCollectionsModal}
      />
      {isAddBookmarkModalOpen && <AddBookmarkModal />}
    </div>
  );
};

const BookmarksViewWithSidebar: React.FC = () => (
  <div className="flex flex-col min-h-screen"> {/* Main content area */}
    {/* Header is rendered by AppLayout, which is a parent of this Outlet's content */}

    {/* Stats Cards Row */}
    <section className="p-6"> {/* Standardized padding */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8"> {/* Changed mb-6 to mb-8 */}
        <StatsCard
          title="Total Bookmarks"
          value="123" // Example value
          icon={<Package size={20} className="text-cyan-400" />}
          change="+2 this week"
        />
        <StatsCard
          title="Tags Used"
          value="27" // Example value
          icon={<Tag size={20} className="text-cyan-400" />}
        />
        <StatsCard
          title="Active Links" // Example title
          value="189" // Example value
          icon={<Link2 size={20} className="text-cyan-400" />}
        />
        <StatsCard
          title="Public Views"
          value="1.2k" // Example value
          icon={<Eye size={20} className="text-cyan-400" />}
          change="Trending Up" // Example change
        />
      </div>
    </section>

    {/* Existing content: Bộ lọc và tiêu đề, Recently Accessed, Grid bookmarks */}
    <div className="flex items-center justify-between px-6 md:px-12 pt-0 pb-4"> {/* Adjusted padding and pt/pb */}
      <div>
        <CollectionHeader /> {/* Ensure this component is imported if not already */}
        <div className="text-white/60 text-base">12 bookmarks found</div> {/* This count should be dynamic later */}
      </div>
      <div className="flex items-center gap-3">
        <select className="rounded-lg px-3 py-2 bg-white/10 text-white/80 text-sm focus:outline-none focus:border-cyan-400 focus:ring-1 focus:ring-cyan-400">
          <option>All time</option>
          <option>Today</option>
          <option>This week</option>
        </select>
        <select className="rounded-lg px-3 py-2 bg-white/10 text-white/80 text-sm focus:outline-none focus:border-cyan-400 focus:ring-1 focus:ring-cyan-400">
          <option>Most Recent</option>
          <option>Oldest</option>
        </select>
      </div>
    </div>
    {/* Recently Accessed */}
    <div className="px-6 md:px-12 pb-4">
      <div className="rounded-2xl bg-white/10 px-6 py-4 flex items-center gap-3 overflow-x-auto">
        <div className="text-white/80 font-medium mr-2">Recently Accessed</div>
        {/* Example recently accessed items - these should be dynamic */}
        <span className="rounded-lg bg-white/20 px-3 py-1 text-white/80 text-sm">React Docs</span>
        <span className="rounded-lg bg-white/20 px-3 py-1 text-white/80 text-sm">Node.js</span>
        <span className="rounded-lg bg-white/20 px-3 py-1 text-white/80 text-sm">Tailwind CSS</span>
      </div>
    </div>
    {/* Grid bookmarks */}
    <section className="flex-1 px-6 md:px-12 pb-8">
      <BookmarkGrid /> {/* Ensure this component is imported if not already */}
    </section>

    {/* KeyboardShortcutsButton might be part of AppLayout or here, ensure it's placed appropriately */}
    {/* <div className="fixed bottom-6 right-6 z-50"> <KeyboardShortcutsButton /> </div> */}
  </div>
);

const ProfileView: React.FC = () => (
    <div className="w-full px-4 py-6 md:p-6 flex justify-center items-start pt-6 md:pt-10 pb-16 md:pb-6">
        <ProfilePage />
    </div>
);


function App() {
  const { currentUser } = useAuth();
  const { openModal: openAddBookmarkModal } = useBookmarks(); // Get openModal from context
  const [isLoginModalOpen, setIsLoginModalOpen] = useState(false);
  const [isRegisterModalOpen, setIsRegisterModalOpen] = useState(false);
  const [isSettingsModalOpen, setIsSettingsModalOpen] = useState(false);
  const openCollectionsModal = () => {}; // Placeholder

  const openLoginModal = () => setIsLoginModalOpen(true);
  const closeLoginModal = () => setIsLoginModalOpen(false);
  const openRegisterModal = () => setIsRegisterModalOpen(true);
  const closeRegisterModal = () => setIsRegisterModalOpen(false);
  const openSettingsModal = () => setIsSettingsModalOpen(true);
  const closeSettingsModal = () => setIsSettingsModalOpen(false);

  return (
    <BookmarkProvider>
      <LoginModal isOpen={isLoginModalOpen} onClose={closeLoginModal} />
      <RegisterModal isOpen={isRegisterModalOpen} onClose={closeRegisterModal} />
      <SettingsModal isOpen={isSettingsModalOpen} onClose={closeSettingsModal} />

      <Routes>
        <Route
          element={
            <AppLayout
              openLoginModal={openLoginModal}
              openRegisterModal={openRegisterModal}
              openSettingsModal={openSettingsModal}
              openCollectionsModal={openCollectionsModal}
              openAddBookmarkModal={openAddBookmarkModal} // Pass to AppLayout
            />
          }
        >
          <Route path="/" element={<BookmarksViewWithSidebar />} />
          <Route
            path="/profile"
            element={currentUser ? <ProfileView /> : <Navigate to="/" replace />}
          />
        </Route>
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
      {/* KeyboardShortcutsButton is rendered once here, not in BookmarksViewWithSidebar if it's global */}
      <div className="fixed bottom-6 right-6 z-50">
         <KeyboardShortcutsButton />
      </div>
    </BookmarkProvider>
  );
}

export default App;