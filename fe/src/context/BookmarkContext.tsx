import React, { createContext, useContext, useState, ReactNode } from 'react';
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
  const [bookmarks, setBookmarks] = useState<Bookmark[]>(sampleBookmarks);
  const [collections] = useState<Collection[]>(sampleCollections);
  const [activeCollection, setActiveCollection] = useState<string>("All Bookmarks");
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
  const filteredBookmarks = bookmarks.filter((bookmark) => {
    const matchesCollection =
      activeCollection === "All Bookmarks" ||
      activeCollection === "Favorites" && bookmark.isFavorite ||
      activeCollection === "Recently Added" ||
      activeCollection === bookmark.collection;
      
    const matchesSearch =
      searchTerm === "" ||
      bookmark.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      bookmark.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
      bookmark.tags.some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase()));

    return matchesCollection && matchesSearch;
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
    filteredBookmarks
  };

  return (
    <BookmarkContext.Provider value={value}>
      {children}
    </BookmarkContext.Provider>
  );
};