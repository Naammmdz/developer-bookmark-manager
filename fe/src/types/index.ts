export interface Bookmark {
  id: number;
  title: string;
  url: string;
  description: string;
  tags: string[];
  collection: string;
  isPublic: boolean;
  isFavorite: boolean;
  favicon: string;
  createdAt: string;
  userOrder?: number;
}

export interface Collection {
  id: number;
  name: string;
  icon: string;
  count: number;
}