import React, { createContext, useContext, useState, ReactNode } from 'react';
import { useAuth } from './AuthContext'; // Add this import
import { sampleBookmarks, sampleCollections } from '../data/sampleData';
import { Bookmark, Collection } from '../types';

interface BookmarkContextType {
  bookmarks: Bookmark[];
  collections: Collection[];
  activeCollection: string;
  searchTerm: string;
  isModalOpen: boolean;
  setActiveCollection: (collection: string) => void;
  setSearchTerm: (term: string) => void;
  toggleFavorite: (id: number) => void;
  addBookmark: (bookmark: Omit<Bookmark, 'id' | 'createdAt'>) => void;
  deleteBookmark: (id: number) => void;
  openModal: () => void;
  closeModal: () => void;
  filteredBookmarks: Bookmark[];
  // New state for filters
  selectedTag: string | null;
  setSelectedTag: (tag: string | null) => void;
  selectedDateRange: string | null; // e.g., "all", "today", "last7days", "last30days"
  setSelectedDateRange: (range: string | null) => void;
  availableTags: string[];
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
  const { currentUser } = useAuth(); // Add this line
  const [bookmarks, setBookmarks] = useState<Bookmark[]>(sampleBookmarks);
  const [collections] = useState<Collection[]>(sampleCollections);
  const [activeCollection, setActiveCollection] = useState<string>("All Bookmarks");
  const [searchTerm, setSearchTerm] = useState<string>("");
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  // New state for filters
  const [selectedTag, setSelectedTag] = useState<string | null>(null);
  const [selectedDateRange, setSelectedDateRange] = useState<string | null>(null);

  const availableTags = React.useMemo(() => {
    const allTags = new Set<string>();
    bookmarks.forEach(bookmark => {
      bookmark.tags.forEach(tag => allTags.add(tag));
    });
    return Array.from(allTags).sort();
  }, [bookmarks]);

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

  const openModal = () => setIsModalOpen(true);
  const closeModal = () => setIsModalOpen(false);

  // Filter bookmarks based on active collection and search term
  // Filter bookmarks based on active collection and search term
  const filteredBookmarks = bookmarks.filter((bookmark) => {
    const matchesCollection =
      activeCollection === "All Bookmarks" ||
      (activeCollection === "Favorites" && currentUser && bookmark.isFavorite) ||
      activeCollection === "Recently Added" ||
      activeCollection === bookmark.collection;
      
    const matchesSearch =
      searchTerm === "" ||
      bookmark.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (bookmark.description && bookmark.description.toLowerCase().includes(searchTerm.toLowerCase())) ||
      bookmark.tags.some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase()));

    const matchesTag =
      !selectedTag || bookmark.tags.includes(selectedTag);

    const matchesDateRange = () => {
      if (!selectedDateRange || selectedDateRange === "all") return true;
      // Ensure bookmark.createdAt is valid before creating a Date object
      if (!bookmark.createdAt) return true; // Or handle as an error/default

      const bookmarkDate = new Date(bookmark.createdAt);
       // Check if bookmarkDate is valid after parsing
      if (isNaN(bookmarkDate.getTime())) return true;


      const today = new Date();
      today.setHours(0, 0, 0, 0); // Start of today

      switch (selectedDateRange) {
        case "today":
          return bookmarkDate >= today;
        case "last7days":
          const sevenDaysAgo = new Date(today);
          sevenDaysAgo.setDate(today.getDate() - 7);
          return bookmarkDate >= sevenDaysAgo;
        case "last30days":
          const thirtyDaysAgo = new Date(today);
          thirtyDaysAgo.setDate(today.getDate() - 30);
          return bookmarkDate >= thirtyDaysAgo;
        default:
          return true;
      }
    };

    return matchesCollection && matchesSearch && matchesTag && matchesDateRange();
  });

  const value = {
    bookmarks,
    collections,
    activeCollection,
    searchTerm,
    isModalOpen,
    setActiveCollection,
    setSearchTerm,
    toggleFavorite,
    addBookmark,
    deleteBookmark,
    openModal,
    closeModal,
    // New values for context
    selectedTag,
    setSelectedTag,
    selectedDateRange,
    setSelectedDateRange,
    availableTags,
    filteredBookmarks
  };

  return (
    <BookmarkContext.Provider value={value}>
      {children}
    </BookmarkContext.Provider>
  );
};