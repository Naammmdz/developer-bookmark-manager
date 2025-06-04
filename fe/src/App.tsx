import React from 'react';
import { BookmarkProvider } from './context/BookmarkContext';
import BackgroundAnimation from './components/layout/BackgroundAnimation';
import Header from './components/layout/Header';
import Sidebar from './components/layout/Sidebar';
import BookmarkGrid from './components/bookmark/BookmarkGrid';
import AddBookmarkModal from './components/bookmark/AddBookmarkModal';
import MobileNavigation from './components/layout/MobileNavigation';
import CollectionHeader from './components/layout/CollectionHeader';

function App() {
  return (
    <BookmarkProvider>
      <div className="min-h-screen flex flex-col">
        <BackgroundAnimation />
        <Header />
        
        <div className="flex-1 flex pb-16 md:pb-0">
          <Sidebar />
          
          <main className="flex-1 px-4 py-6 md:p-6">
            <div className="max-w-6xl mx-auto">
              <CollectionHeader />
              <BookmarkGrid />
            </div>
          </main>
        </div>
        
        <MobileNavigation />
        <AddBookmarkModal />
      </div>
    </BookmarkProvider>
  );
}

export default App;