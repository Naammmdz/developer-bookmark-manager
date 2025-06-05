import React, { createContext, useContext, useState, ReactNode } from 'react';
import React, { createContext, useContext, useState, ReactNode, useMemo } from 'react'; // Added useMemo
import { useAuth } from './AuthContext';
import { sampleBookmarks, sampleCollections } from '../data/sampleData';
import { Bookmark, Collection } from '../types';

// New type for collection with its items
export interface CollectionWithItems extends Collection {
  count: number;
  items: Bookmark[];
}

// Updated Context Type
interface BookmarkContextType {
  bookmarks: Bookmark[]; // Still exposing raw bookmarks for potential direct use
  collections: Collection[]; // Original collections array from sampleData
  activeCollection: string; // ID of the active collection (e.g., 'all', 'favorites', 'coll_1')
  setActiveCollection: (collectionId: string) => void;
  collectionData: { [key: string]: CollectionWithItems }; // Processed data for display
  searchTerm: string;
  setSearchTerm: (term: string) => void;
  isModalOpen: boolean;
  openModal: () => void;
  closeModal: () => void;
  toggleFavorite: (id: number) => void;
  addBookmark: (bookmark: Omit<Bookmark, 'id' | 'createdAt'>) => void;
  deleteBookmark: (id: number) => void;
  deleteBookmarks: (ids: number[]) => void;
  reorderBookmarks: (sourceIdx: number, destIdx: number) => void; // Kept as it operates on raw bookmarks
}

const BookmarkContext = createContext<BookmarkContextType | undefined>(undefined);

export const useBookmarks = () => {
  const context = useContext(BookmarkContext);
  if (!context) {
    throw new Error('useBookmarks must be used within a BookmarkProvider');
  }
  return context;
};

interface BookmarkProviderProps {
  children: ReactNode;
}

export const BookmarkProvider = ({ children }: BookmarkProviderProps) => {
  const { currentUser } = useAuth();
  const [bookmarks, setBookmarks] = useState<Bookmark[]>(sampleBookmarks);
  const [staticCollections] = useState<Collection[]>(sampleCollections); // Renamed to avoid confusion
  const [activeCollection, setActiveCollection] = useState<string>('all'); // Initialized to 'all'
  const [searchTerm, setSearchTerm] = useState<string>("");
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);

  const toggleFavorite = (id: number) => {
    setBookmarks(
      bookmarks.map((bookmark) =>
        bookmark.id === id
          ? { ...bookmark, isFavorite: !bookmark.isFavorite }
          : bookmark
      )
    );
  };

  const addBookmark = (bookmark: Omit<Bookmark, 'id' | 'createdAt'>) => {
    if (currentUser) {
      console.log(`Adding bookmark for user: ${currentUser.email}`);
    } else {
      console.log('Adding bookmark for guest user (no user logged in).');
    }
    const newBookmark: Bookmark = {
      ...bookmark,
      id: Math.max(...bookmarks.map(b => b.id), 0) + 1,
      createdAt: new Date().toISOString()
    };
    setBookmarks([newBookmark, ...bookmarks]);
  };

  const deleteBookmark = (id: number) => {
    setBookmarks(bookmarks.filter((bookmark) => bookmark.id !== id));
  };

  const deleteBookmarks = (ids: number[]) => {
    setBookmarks(bookmarks.filter((bookmark) => !ids.includes(bookmark.id)));
  };

  const openModal = () => setIsModalOpen(true);
  const closeModal = () => setIsModalOpen(false);

  const collectionData = useMemo(() => {
    const data: { [key: string]: CollectionWithItems } = {};
    const recentLimit = 10;

    // Sort all bookmarks by createdAt date for 'all' and 'recently_added'
    const sortedBookmarks = [...bookmarks].sort((a, b) =>
      new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
    );

    // 'All Bookmarks' Collection
    data['all'] = {
      id: 'all',
      name: 'All Bookmarks',
      icon: 'Archive', // Example icon name, actual component rendered in UI
      items: sortedBookmarks,
      count: sortedBookmarks.length,
    };

    // 'Favorites' Collection
    const favoriteItems = sortedBookmarks.filter(bm => bm.isFavorite);
    data['favorites'] = {
      id: 'favorites',
      name: 'Favorites',
      icon: 'Heart',
      items: favoriteItems,
      count: favoriteItems.length,
    };

    // 'Recently Added' Collection
    data['recently_added'] = {
      id: 'recently_added',
      name: 'Recently Added',
      icon: 'Clock',
      items: sortedBookmarks.slice(0, recentLimit),
      count: Math.min(sortedBookmarks.length, recentLimit),
    };

    // Process static collections from sampleCollections
    staticCollections.forEach(collection => {
      // Assuming bookmark.collection is the string ID (e.g., "coll_1")
      const collectionItems = sortedBookmarks.filter(bm => bm.collection === collection.id);
      data[collection.id] = {
        ...collection, // id, name, icon from staticCollection
        items: collectionItems,
        count: collectionItems.length,
      };
    });

    return data;
  }, [bookmarks, staticCollections]);

  // Reorder bookmarks - this operates on the base `bookmarks` array.
  // `collectionData` will update automatically due to `useMemo` dependency on `bookmarks`.
  const reorderBookmarks = (sourceIdx: number, destIdx: number) => {
    setBookmarks((prev) => {
      const updated = [...prev]; // Create a new array
      // Find the actual bookmarks being moved based on currently displayed items if activeCollection is not 'all'
      // This simple reorder works correctly if sourceIdx/destIdx are for the 'all' bookmarks view.
      // If they are indices from a filtered/specific collection view, this logic might need adjustment
      // or the DnD should provide indices relative to the `bookmarks` array.
      // For now, assuming indices are relative to the full `bookmarks` array as `collectionData` is derived.
      const [removed] = updated.splice(sourceIdx, 1);
      updated.splice(destIdx, 0, removed);
      return updated;
    });
  };

  const value = {
    bookmarks, // Raw bookmarks
    collections: staticCollections, // Original collection definitions
    activeCollection,
    setActiveCollection,
    collectionData, // New processed data
    searchTerm,
    setSearchTerm,
    isModalOpen,
    openModal,
    closeModal,
    toggleFavorite,
    addBookmark,
    deleteBookmark,
    deleteBookmarks,
    reorderBookmarks,
    // Removed: filteredBookmarks, selectedTag, setSelectedTag, selectedDateRange, setSelectedDateRange, availableTags
  };

  return (
    <BookmarkContext.Provider value={value}>
      {children}
    </BookmarkContext.Provider>
  );
};