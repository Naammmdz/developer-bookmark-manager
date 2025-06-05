import React, { createContext, useContext, useState, ReactNode, useMemo } from 'react';
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
  reorderBookmarks: (movedBookmarkId: number, targetBookmarkId: number | null) => void; // Updated signature
  addCollection: (name: string, icon: string) => void; // Added for adding new collections
  isAddCollectionModalOpen: boolean;
  openAddCollectionModal: () => void;
  closeAddCollectionModal: () => void;
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
  // Filter out special collection names during initial state setting and allow updates
  const [staticCollections, setStaticCollections] = useState<Collection[]>(() => {
    const excludedNames = ['All Bookmarks', 'Favorites', 'Recently Added'];
    return sampleCollections.filter(col => !excludedNames.includes(col.name));
  });
  const [activeCollection, setActiveCollection] = useState<string>('all'); // Initialized to 'all'
  const [searchTerm, setSearchTerm] = useState<string>("");
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  const [isAddCollectionModalOpen, setIsAddCollectionModalOpen] = useState<boolean>(false);

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

  const openAddCollectionModal = () => setIsAddCollectionModalOpen(true);
  const closeAddCollectionModal = () => setIsAddCollectionModalOpen(false);

  const addCollection = (name: string, icon: string) => {
    const newId = 'coll_' + String(Date.now());
    const newCollection: Collection = { id: newId, name, icon };
    setStaticCollections(prevCollections => [...prevCollections, newCollection]);
  };

  const collectionData = useMemo(() => {
    const data: { [key: string]: CollectionWithItems } = {};
    const recentLimit = 10;

    // Date-sorted bookmarks, primarily for 'Recently Added'
    const dateSortedBookmarks = [...bookmarks].map(bm => ({ ...bm, parsedCreatedAt: new Date(bm.createdAt) })).filter(bm => !isNaN(bm.parsedCreatedAt.getTime())).sort((a, b) => b.parsedCreatedAt.getTime() - a.parsedCreatedAt.getTime());

    // 'All Bookmarks' Collection - uses original bookmark order
    data['all'] = {
      id: 'all',
      name: 'All Bookmarks',
      icon: 'Archive',
      items: [...bookmarks], // Use original bookmarks array (maintains user-defined order)
      count: bookmarks.length,
    };

    // 'Favorites' Collection - uses original bookmark order among favorites
    const favoriteItems = bookmarks.filter(bm => bm.isFavorite); // Filter from original bookmarks
    data['favorites'] = {
      id: 'favorites',
      name: 'Favorites',
      icon: 'Heart',
      items: favoriteItems,
      count: favoriteItems.length,
    };

    // 'Recently Added' Collection - uses date-sorted bookmarks
    data['recently_added'] = {
      id: 'recently_added',
      name: 'Recently Added',
      icon: 'Clock',
      items: dateSortedBookmarks.slice(0, recentLimit), // Uses dateSortedBookmarks
      count: Math.min(dateSortedBookmarks.length, recentLimit), // Based on dateSortedBookmarks
    };

    // Process static collections from sampleCollections - uses original bookmark order within each collection
    staticCollections.forEach(collection => {
      // Filter bookmarks by collection NAME from the original bookmarks array
      const collectionItems = bookmarks.filter(bm => bm.collection === collection.name);
      const key = collection.id.toString();
      data[key] = {
        id: key, // Use the stringified ID as the object's ID
        name: collection.name,
        icon: collection.icon,
        items: collectionItems,
        count: collectionItems.length,
      };
    });

    return data;
  }, [bookmarks, staticCollections]);

  // Reorder bookmarks - this operates on the base `bookmarks` array.
  // `collectionData` will update automatically due to `useMemo` dependency on `bookmarks`.
  const reorderBookmarks = (movedBookmarkId: number, targetBookmarkId: number | null) => {
    setBookmarks(prevBookmarks => {
      const movedItemIndex = prevBookmarks.findIndex(bm => bm.id === movedBookmarkId);
      if (movedItemIndex === -1) {
        console.warn(`reorderBookmarks: movedItem with id ${movedBookmarkId} not found.`);
        return prevBookmarks; // Return original if item not found
      }
      const movedItem = prevBookmarks[movedItemIndex];

      let newBookmarks = prevBookmarks.filter(bm => bm.id !== movedBookmarkId);

      if (targetBookmarkId === null) { // Dropped at the end
        newBookmarks.push(movedItem);
      } else {
        const targetItemIndexInNewArray = newBookmarks.findIndex(bm => bm.id === targetBookmarkId);
        if (targetItemIndexInNewArray !== -1) {
          newBookmarks.splice(targetItemIndexInNewArray, 0, movedItem);
        } else {
          // Fallback: if targetId not found (should ideally not happen if IDs are correct from grid)
          // or if it was the movedItem itself (already filtered out), append to end.
          console.warn(`reorderBookmarks: targetItem with id ${targetBookmarkId} not found in remaining items. Appending to end.`);
          newBookmarks.push(movedItem);
        }
      }
      return newBookmarks;
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
    addCollection, // Added to context value
    isAddCollectionModalOpen,
    openAddCollectionModal,
    closeAddCollectionModal,
    // Removed: filteredBookmarks, selectedTag, setSelectedTag, selectedDateRange, setSelectedDateRange, availableTags
  };

  return (
    <BookmarkContext.Provider value={value}>
      {children}
    </BookmarkContext.Provider>
  );
};