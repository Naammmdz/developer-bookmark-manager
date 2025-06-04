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
import BulkActionBar from './components/ui/BulkActionBar'; // Added Import

// Props for AppLayout
interface AppLayoutProps {
  openLoginModal: () => void;
  openRegisterModal: () => void;
  openCollectionsModal: () => void;
  openSettingsModal: () => void;
}

const AppLayout: React.FC<AppLayoutProps> = ({
  openLoginModal,
  openRegisterModal,
  openCollectionsModal,
  openSettingsModal
}) => {
  // isModalOpen from useBookmarks is for the AddBookmarkModal
  const { isModalOpen: isAddBookmarkModalOpen } = useBookmarks();

  return (
    <div className="min-h-screen flex flex-col bg-transparent text-white">
      <BackgroundAnimation />
      <Header
        openLoginModal={openLoginModal}
        openRegisterModal={openRegisterModal}
        openSettingsModal={openSettingsModal} // Pass openSettingsModal to Header
      />
      {/* Removed pb-16 md:pb-0 from here, will be on main content views */}
      <div className="flex-1 flex">
        <Outlet /> {/* Child route components (BookmarksViewWithSidebar or ProfileView) will render here */}
      </div>
      <MobileNavigation
        openCollectionsModal={openCollectionsModal}
        openSettingsModal={openSettingsModal}
      />
      {/* AddBookmarkModal is controlled by BookmarkContext, so it's rendered if its state is open */}
      {isAddBookmarkModalOpen && <AddBookmarkModal />}
    </div>
  );
};

const BookmarksViewWithSidebar: React.FC = () => (
  <> {/* Use Fragment as Sidebar and main are siblings */}
    <Sidebar />
    <main className="flex-1 px-4 py-6 md:p-6 pb-16 md:pb-6"> {/* Added bottom padding for mobile nav overlap */}
      <div className="max-w-6xl mx-auto">
        <CollectionHeader />
        <BookmarkGrid />
      </div>
    </main>
  </>
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
  const [isCollectionsModalOpen, setIsCollectionsModalOpen] = useState(false);
  const [isSettingsModalOpen, setIsSettingsModalOpen] = useState(false);

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

  const openCollectionsModal = () => setIsCollectionsModalOpen(true);
  const closeCollectionsModal = () => setIsCollectionsModalOpen(false);
  const openSettingsModal = () => setIsSettingsModalOpen(true);
  const closeSettingsModal = () => setIsSettingsModalOpen(false);

  return (
    <BookmarkProvider>
      {/* Modals are rendered here, outside of Routes, so they can be displayed over any page */}
      <LoginModal isOpen={isLoginModalOpen} onClose={closeLoginModal} />
      <RegisterModal isOpen={isRegisterModalOpen} onClose={closeRegisterModal} />
      <SettingsModal isOpen={isSettingsModalOpen} onClose={closeSettingsModal} /> {/* Render SettingsModal */}
      {/* <CollectionsModal isOpen={isCollectionsModalOpen} onClose={closeCollectionsModal} /> */}

      <BulkActionBar /> {/* Added BulkActionBar here */}

      <Routes>
        <Route
          element={
            <AppLayout
              openLoginModal={openLoginModal}
              openRegisterModal={openRegisterModal}
              openCollectionsModal={openCollectionsModal}
              openSettingsModal={openSettingsModal}
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
    </BookmarkProvider>
  );
}

export default App;