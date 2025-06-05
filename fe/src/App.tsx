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
import SettingsModal from './components/settings/SettingsModal'; // Added Import
import BackgroundAnimation from './components/layout/BackgroundAnimation';
import KeyboardShortcutsButton from './components/ui/KeyboardShortcutsButton';

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
    <div className="min-h-screen flex flex-col bg-transparent text-white">
      <BackgroundAnimation />
      {/* Header trên cùng */}
      <Header
        openLoginModal={openLoginModal}
        openRegisterModal={openRegisterModal}
        openSettingsModal={openSettingsModal}
      />
      {/* Dưới header là flex ngang: sidebar + main content */}
      <div className="flex flex-1 min-h-0">
        <aside className="w-72 flex flex-col border-r border-white/10 bg-sidebar min-h-0 h-auto">
          <Sidebar />
        </aside>
        <div className="flex-1 min-h-0">
          <Outlet /> {/* Child route components (BookmarksViewWithSidebar or ProfileView) will render here */}
        </div>
      </div>
      <MobileNavigation
        openSettingsModal={openSettingsModal}
        openCollectionsModal={openCollectionsModal}
      />
      {/* AddBookmarkModal is controlled by BookmarkContext, so it's rendered if its state is open */}
      {isAddBookmarkModalOpen && <AddBookmarkModal />}
    </div>
  );
};

const BookmarksViewWithSidebar: React.FC = () => (
  <div className="flex min-h-screen">
    {/* Sidebar đã nằm ở AppLayout, không render lại ở đây */}
    {/* Main content */}
    <div className="flex-1 flex flex-col min-h-screen">
      {/* Bộ lọc và tiêu đề */}
      <div className="flex items-center justify-between px-12 pb-2">
        <div>
          <CollectionHeader />
          <div className="text-white/60 text-base">12 bookmarks found</div>
        </div>
        <div className="flex items-center gap-3">
          <select className="rounded-lg px-3 py-2 bg-white/10 text-white/80 text-sm">
            <option>All time</option>
            <option>Today</option>
            <option>This week</option>
          </select>
          <select className="rounded-lg px-3 py-2 bg-white/10 text-white/80 text-sm">
            <option>Most Recent</option>
            <option>Oldest</option>
          </select>
        </div>
      </div>
      {/* Recently Accessed */}
      <div className="px-12 pb-4">
        <div className="rounded-2xl bg-white/10 px-6 py-4 flex items-center gap-3 overflow-x-auto">
          <div className="text-white/80 font-medium mr-2">Recently Accessed</div>
          {/* Example recently accessed items */}
          <span className="rounded-lg bg-white/20 px-3 py-1 text-white/80 text-sm">React Documentation</span>
          <span className="rounded-lg bg-white/20 px-3 py-1 text-white/80 text-sm">Node.js Best Practices</span>
          <span className="rounded-lg bg-white/20 px-3 py-1 text-white/80 text-sm">Tailwind CSS Documentation</span>
          <span className="rounded-lg bg-white/20 px-3 py-1 text-white/80 text-sm">TypeScript Handbook</span>
          <span className="rounded-lg bg-white/20 px-3 py-1 text-white/80 text-sm">Express.js Guide</span>
        </div>
      </div>
      {/* Grid bookmarks */}
      <main className="flex-1 px-12 pb-8">
        <BookmarkGrid />
      </main>
    </div>
    {/* Nút nổi/phím tắt ở góc phải dưới */}
    <div className="fixed bottom-6 right-6 z-50">
      <KeyboardShortcutsButton />
    </div>
  </div>
);

const ProfileView: React.FC = () => (
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
      <KeyboardShortcutsButton />
    </BookmarkProvider>
  );
}

export default App;