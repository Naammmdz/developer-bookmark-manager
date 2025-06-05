import React, { useState, useMemo } from 'react';
import { Routes, Route, Navigate, Outlet } from 'react-router-dom';
import {
  BookmarkProvider,
  useBookmarks,
  CollectionWithItems,
} from './context/BookmarkContext';
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
import SettingsModal from './components/settings/SettingsModal';
import BackgroundAnimation from './components/layout/BackgroundAnimation';
import KeyboardShortcutsButton from './components/ui/KeyboardShortcutsButton';
import {
  Archive,
  FolderKanban,
  Heart,
  Globe,
  Filter,
  ArrowUpDown,
  PlusCircle,
  ListPlus,
} from 'lucide-react';

// Helper function for mapping icon names to emojis for page titles
const getEmojiIcon = (iconName?: string): string => {
  if (!iconName) return '📁'; // Default
  switch (iconName.toLowerCase()) {
    case 'archive':
      return '🗂️'; // For 'All Bookmarks'
    case 'heart':
      return '❤️'; // For 'Favorites'
    case 'clock':
      return '🕒'; // For 'Recently Added'
    case 'bookmark':
      return '🔖';
    case 'layers':
      return '📚';
    case 'server':
      return '☁️';
    case 'palette':
      return '🎨';
    case 'filetext':
      return '📄';
    default:
      return '✨'; // Default for other dynamic collections
  }
};

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
  openCollectionsModal,
}) => {
  const { isModalOpen: isAddBookmarkModalOpen, collectionData } =
    useBookmarks();

  const stats = React.useMemo(() => {
    const cd = collectionData || {}; // Handle initial undefined state

    const totalBookmarksStat = cd.all?.count || 0;

    const collectionsStat = Object.values(
      cd as { [key: string]: CollectionWithItems },
    ) // Type assertion for filter
      .filter(
        (col) =>
          col.id !== 'all' &&
          col.id !== 'favorites' &&
          col.id !== 'recently_added',
      ).length;

    const favoritesStat = cd.favorites?.count || 0;

    // Placeholder for publicStat, e.g., 30% of total (rounded down)
    const publicStat = Math.floor(totalBookmarksStat * 0.3);

    return { totalBookmarksStat, collectionsStat, favoritesStat, publicStat };
  }, [collectionData]);

  return (
    <div className="flex min-h-screen text-white">
      <BackgroundAnimation className="absolute inset-0 -z-10" />

      {/* Sidebar */}
      <aside className="fixed left-0 top-0 h-screen w-64 bg-black/20 backdrop-blur-lg border-r border-white/10 z-40 overflow-y-auto flex flex-col">
        <Sidebar />
      </aside>

      {/* Main content area */}
      <div className="ml-64 flex-1 flex flex-col">
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
              <p className="text-3xl font-semibold text-white">
                {stats.totalBookmarksStat}
              </p>
            </div>
            {/* Card 2: Collections */}
            <div className="bg-black/20 backdrop-blur-lg border border-white/10 rounded-xl p-6">
              <div className="flex items-center justify-between mb-2">
                <p className="text-sm text-white/70">Collections</p>
                <FolderKanban size={20} className="text-primary" />
              </div>
              <p className="text-3xl font-semibold text-white">
                {stats.collectionsStat}
              </p>
            </div>
            {/* Card 3: Favorites */}
            <div className="bg-black/20 backdrop-blur-lg border border-white/10 rounded-xl p-6">
              <div className="flex items-center justify-between mb-2">
                <p className="text-sm text-white/70">Favorites</p>
                <Heart size={20} className="text-primary" />
              </div>
              <p className="text-3xl font-semibold text-white">
                {stats.favoritesStat}
              </p>
            </div>
            {/* Card 4: Public */}
            <div className="bg-black/20 backdrop-blur-lg border border-white/10 rounded-xl p-6">
              <div className="flex items-center justify-between mb-2">
                <p className="text-sm text-white/70">Public</p>
                <Globe size={20} className="text-primary" />
              </div>
              <p className="text-3xl font-semibold text-white">
                {stats.publicStat}
              </p>
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

const BookmarksViewWithSidebar: React.FC = () => {
  const {
    activeCollection,
    collectionData,
    searchTerm,
    openModal,
    reorderBookmarks, // Added for passing to BookmarkGrid
    deleteBookmarks, // Added for passing to BookmarkGrid
  } = useBookmarks();

  const currentViewData = collectionData?.[activeCollection];
  const icon = currentViewData ? getEmojiIcon(currentViewData.icon) : '⏳';
  const name = currentViewData?.name || 'Loading...';

  const baseItems = currentViewData?.items || [];
  const finalItemsToDisplay =
    searchTerm.trim() === ''
      ? baseItems
      : baseItems.filter((bookmark) => {
          const searchTermLower = searchTerm.toLowerCase();
          return (
            bookmark.title.toLowerCase().includes(searchTermLower) ||
            (bookmark.description &&
              bookmark.description.toLowerCase().includes(searchTermLower)) ||
            bookmark.tags.some((tag) =>
              tag.toLowerCase().includes(searchTermLower),
            )
          );
        });

  const titleBookmarkCount = currentViewData?.count || 0; // For display in title, before search filtering

  return (
    <div className="flex-1 flex flex-col min-h-screen">
      {/* New Page Title Section */}
      <section className="px-6 pt-6 mb-6">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-semibold text-white">
              <span className="mr-2">{icon}</span>
              {name}
            </h2>
            <p className="text-sm text-white/70">
              {titleBookmarkCount} bookmarks found
            </p>
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
      <section className="px-6 mb-8">
        <div className="rounded-2xl bg-black/20 backdrop-blur-lg border border-white/10 px-6 py-4 flex items-center gap-3 overflow-x-auto">
          <div className="text-white/80 font-medium mr-2">
            Recently Accessed
          </div>
          <span className="rounded-lg bg-white/10 px-3 py-1 text-white/80 text-sm">
            React Documentation
          </span>
          <span className="rounded-lg bg-white/10 px-3 py-1 text-white/80 text-sm">
            Node.js Best Practices
          </span>
          <span className="rounded-lg bg-white/10 px-3 py-1 text-white/80 text-sm">
            Tailwind CSS Docs
          </span>
          <span className="rounded-lg bg-white/10 px-3 py-1 text-white/80 text-sm">
            TypeScript Handbook
          </span>
          <span className="rounded-lg bg-white/10 px-3 py-1 text-white/80 text-sm">
            Express.js Guide
          </span>
        </div>
      </section>

      {/* Bookmark Grid Section (Wrapped) */}
      <section className="px-6 pb-6 flex-1 flex flex-col">
        {finalItemsToDisplay.length === 0 ? (
          <div className="flex-1 flex flex-col items-center justify-center text-center py-12">
            <PlusCircle size={48} className="mx-auto text-white/30 mb-4" />
            <h3 className="text-xl font-semibold text-white/80 mb-2">
              {searchTerm
                ? 'No Bookmarks Match Your Search'
                : 'This Collection is Empty'}
            </h3>
            <p className="text-white/50 mb-6 max-w-md">
              {searchTerm
                ? `Try refining your search term or clearing it to see all bookmarks in "${name}".`
                : `Add some bookmarks to "${name}" to see them here.`}
            </p>
            {!searchTerm && (
              <button
                onClick={openModal} // openModal from useBookmarks
                className="bg-primary hover:bg-primary/90 text-white font-medium py-2.5 px-5 rounded-lg flex items-center mx-auto text-sm transition-colors"
              >
                <ListPlus size={18} className="mr-2" /> Add Bookmark to "{name}"
              </button>
            )}
          </div>
        ) : (
          <BookmarkGrid
            bookmarks={finalItemsToDisplay}
            reorderBookmarks={reorderBookmarks}
            deleteBookmarks={deleteBookmarks}
          />
        )}
      </section>
    </div>
  );
};

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
      <RegisterModal
        isOpen={isRegisterModalOpen}
        onClose={closeRegisterModal}
      />
      <SettingsModal
        isOpen={isSettingsModalOpen}
        onClose={closeSettingsModal}
      />

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
        <Route path="*" element={<Navigate to="/" replace />} />{' '}
        {/* Fallback for unmatched routes */}
      </Routes>
      {/* KeyboardShortcutsButton removed from here, now in AppLayout */}
    </BookmarkProvider>
  );
}

export default App;