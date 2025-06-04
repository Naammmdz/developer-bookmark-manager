import React, { createContext, useContext, useState, ReactNode, useCallback } from 'react';
import { useAuth } from './AuthContext'; // Add this import
import { sampleBookmarks, sampleCollections } from '../data/sampleData';
import { arrayMove } from '@dnd-kit/sortable';
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
  reorderBookmarks: (activeId: number, overId: number) => void;
  filteredBookmarks: Bookmark[];
  // New state for filters
  selectedTag: string | null;
  setSelectedTag: (tag: string | null) => void;
  selectedDateRange: string | null; // e.g., "all", "today", "last7days", "last30days"
  setSelectedDateRange: (range: string | null) => void;
  availableTags: string[];
  // Bulk selection
  isBulkSelectMode: boolean;
  selectedBookmarkIds: (number | string)[];
  toggleBulkSelectMode: () => void;
  toggleBookmarkSelection: (id: number | string) => void;
  clearSelection: () => void;
  selectAllVisibleBookmarks: (visibleIds: (number | string)[]) => void;
  deleteSelectedBookmarks: () => void;
  // Infinite scroll
  visibleBookmarksCount: number;
  loadMoreBookmarks: () => void;
}

const INITIAL_LOAD_COUNT = 20;
const PAGE_SIZE = 15;

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
  const [bookmarks, setBookmarks] = useState<Bookmark[]>(() =>
    sampleBookmarks.map((bookmark, index) => ({
      ...bookmark,
      userOrder: bookmark.userOrder ?? index, // Assign index if userOrder is not already set
    }))
  );
  const [collections] = useState<Collection[]>(sampleCollections);
  const [activeCollection, setActiveCollection] = useState<string>("All Bookmarks");
  const [searchTerm, setSearchTerm] = useState<string>("");
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  // New state for filters
  const [selectedTag, setSelectedTag] = useState<string | null>(null);
  const [selectedDateRange, setSelectedDateRange] = useState<string | null>(null);
  // Bulk selection state
  const [isBulkSelectMode, setIsBulkSelectMode] = useState<boolean>(false);
  const [selectedBookmarkIds, setSelectedBookmarkIds] = useState<(number|string)[]>([]);
  // Infinite scroll state
  const [visibleBookmarksCount, setVisibleBookmarksCount] = useState<number>(INITIAL_LOAD_COUNT);

  const availableTags = React.useMemo(() => {
    const allTags = new Set<string>();
    bookmarks.forEach(bookmark => {
      bookmark.tags.forEach(tag => allTags.add(tag));
    });
    return Array.from(allTags).sort();
  }, [bookmarks]);

  // Bulk selection functions
  const clearSelection = useCallback(() => {
    setSelectedBookmarkIds([]);
  }, []);

  const toggleBulkSelectMode = useCallback(() => {
    setIsBulkSelectMode(prev => {
      if (prev) { // If turning off
        clearSelection();
      }
      return !prev;
    });
  }, [clearSelection]);

  const toggleBookmarkSelection = useCallback((id: number | string) => {
    setSelectedBookmarkIds(prevSelected =>
      prevSelected.includes(id)
        ? prevSelected.filter(selectedId => selectedId !== id)
        : [...prevSelected, id]
    );
  }, []);

  const selectAllVisibleBookmarks = useCallback((visibleIds: (number | string)[]) => {
    setSelectedBookmarkIds(visibleIds);
  }, []);

  const deleteSelectedBookmarks = useCallback(() => {
    setBookmarks(prevBookmarks =>
      prevBookmarks.filter(bookmark => !selectedBookmarkIds.includes(bookmark.id))
    );
    clearSelection();
    // setIsBulkSelectMode(false); // Optionally turn off bulk select mode after deletion
  }, [selectedBookmarkIds, clearSelection]);


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
      createdAt: new Date().toISOString(),
      userOrder: Date.now() // New items go to the end by default
    };
    setBookmarks(prevBookmarks => [newBookmark, ...prevBookmarks]);
  };

  const deleteBookmark = (id: number) => {
    setBookmarks(bookmarks.filter((bookmark) => bookmark.id !== id));
  };

  const openModal = () => setIsModalOpen(true);
  const closeModal = () => setIsModalOpen(false);

  // Infinite scroll functions
  const loadMoreBookmarks = useCallback(() => {
    // This will be based on filteredBookmarks.length in the effect below,
    // but the context function itself doesn't need to know about filteredBookmarks directly
    setVisibleBookmarksCount(prevCount => prevCount + PAGE_SIZE);
  }, []);

  // Reset visible count when filters change
  const handleSetActiveCollection = useCallback((collection: string) => {
    setActiveCollection(collection);
    setVisibleBookmarksCount(INITIAL_LOAD_COUNT);
  }, []);

  const handleSetSearchTerm = useCallback((term: string) => {
    setSearchTerm(term);
    setVisibleBookmarksCount(INITIAL_LOAD_COUNT);
  }, []);

  const handleSetSelectedTag = useCallback((tag: string | null) => {
    setSelectedTag(tag);
    setVisibleBookmarksCount(INITIAL_LOAD_COUNT);
  }, []);

  const handleSetSelectedDateRange = useCallback((range: string | null) => {
    setSelectedDateRange(range);
    setVisibleBookmarksCount(INITIAL_LOAD_COUNT);
  }, []);


  const reorderBookmarks = useCallback((activeId: number, overId: number) => {
    setBookmarks((prevBookmarks) => {
      const oldIndex = prevBookmarks.findIndex(b => b.id === activeId);
      const newIndex = prevBookmarks.findIndex(b => b.id === overId);

      if (oldIndex === -1 || newIndex === -1) {
        return prevBookmarks; // Should not happen if IDs are correct
      }

      const reorderedArray = arrayMove(prevBookmarks, oldIndex, newIndex);

      // Update userOrder for all bookmarks
      return reorderedArray.map((bookmark, index) => ({
        ...bookmark,
        userOrder: index,
      }));
    });
  }, []);


  // Filter bookmarks based on active collection and search term
  const filteredBookmarks = React.useMemo(() => {
    let processedBookmarks = [...bookmarks];

    // 1. Initial sort based on userOrder, unless "Recently Added"
    if (activeCollection === "Recently Added") {
      processedBookmarks.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
    } else {
      processedBookmarks.sort((a, b) => (a.userOrder ?? 0) - (b.userOrder ?? 0));
    }

    return processedBookmarks.filter((bookmark) => {
      const matchesCollection =
        activeCollection === "All Bookmarks" ||
        (activeCollection === "Favorites" && currentUser && bookmark.isFavorite) ||
        activeCollection === "Recently Added" || // This ensures "Recently Added" items are not filtered out here
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
        if (!bookmark.createdAt) return true;

        const bookmarkDate = new Date(bookmark.createdAt);
        if (isNaN(bookmarkDate.getTime())) return true;

        const today = new Date();
        today.setHours(0, 0, 0, 0);

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
  }, [bookmarks, activeCollection, searchTerm, selectedTag, selectedDateRange, currentUser]);

  const value = {
    bookmarks,
    collections,
    activeCollection,
    searchTerm,
    isModalOpen,
    setActiveCollection: handleSetActiveCollection,
    setSearchTerm: handleSetSearchTerm,
    toggleFavorite,
    addBookmark,
    deleteBookmark,
    openModal,
    closeModal,
    reorderBookmarks,
    // New values for context
    selectedTag,
    setSelectedTag: handleSetSelectedTag,
    selectedDateRange,
    setSelectedDateRange: handleSetSelectedDateRange,
    availableTags,
    filteredBookmarks,
    // Bulk selection context values
    isBulkSelectMode,
    selectedBookmarkIds,
    toggleBulkSelectMode,
    toggleBookmarkSelection,
    clearSelection,
    selectAllVisibleBookmarks,
    deleteSelectedBookmarks,
    // Infinite scroll context values
    visibleBookmarksCount,
    loadMoreBookmarks
  };

  return (
    <BookmarkContext.Provider value={value}>
      {children}
    </BookmarkContext.Provider>
  );
};