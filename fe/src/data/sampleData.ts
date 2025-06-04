import { Bookmark, Collection } from '../types';

export const sampleBookmarks: Bookmark[] = [
  {
    id: 1,
    title: "React Documentation",
    url: "https://react.dev",
    description: "The official React documentation with comprehensive guides and API reference",
    tags: ["react", "frontend", "documentation"],
    collection: "Frontend Resources",
    isPublic: true,
    isFavorite: false,
    favicon: "https://react.dev/favicon.ico",
    createdAt: "2025-06-03T15:12:22Z"
  },
  {
    id: 2,
    title: "Node.js Best Practices",
    url: "https://github.com/goldbergyoni/nodebestpractices",
    description: "The Node.js best practices list with 100+ best practices, style guide, and architectural tips",
    tags: ["nodejs", "backend", "best-practices", "github"],
    collection: "Backend Resources",
    isPublic: false,
    isFavorite: true,
    favicon: "https://github.com/favicon.ico",
    createdAt: "2025-06-02T10:30:15Z"
  },
  {
    id: 3,
    title: "Tailwind CSS Documentation",
    url: "https://tailwindcss.com/docs",
    description: "A utility-first CSS framework for rapidly building custom user interfaces",
    tags: ["css", "tailwind", "styling", "frontend"],
    collection: "CSS Resources",
    isPublic: true,
    isFavorite: true,
    favicon: "https://tailwindcss.com/favicon.ico",
    createdAt: "2025-06-01T14:22:33Z"
  },
  {
    id: 4,
    title: "TypeScript Handbook",
    url: "https://www.typescriptlang.org/docs/",
    description: "The TypeScript documentation, tutorials, and reference guides",
    tags: ["typescript", "javascript", "documentation", "language"],
    collection: "Frontend Resources",
    isPublic: true,
    isFavorite: true,
    favicon: "https://www.typescriptlang.org/favicon.ico",
    createdAt: "2025-05-28T09:15:45Z"
  },
  {
    id: 5,
    title: "MDN Web Docs",
    url: "https://developer.mozilla.org/",
    description: "Resources for developers, by developers",
    tags: ["web", "reference", "html", "css", "javascript"],
    collection: "Documentation",
    isPublic: true,
    isFavorite: false,
    favicon: "https://developer.mozilla.org/favicon.ico",
    createdAt: "2025-05-27T16:42:10Z"
  },
  {
    id: 6,
    title: "Next.js Documentation",
    url: "https://nextjs.org/docs",
    description: "The React framework for production with comprehensive documentation",
    tags: ["react", "nextjs", "framework", "documentation"],
    collection: "Frontend Resources",
    isPublic: true,
    isFavorite: false,
    favicon: "https://nextjs.org/favicon.ico",
    createdAt: "2025-05-25T11:33:20Z"
  }
];

export const sampleCollections: Collection[] = [
  { id: 1, name: "All Bookmarks", icon: "Bookmark", count: 6 },
  { id: 2, name: "Frontend Resources", icon: "Layers", count: 3 },
  { id: 3, name: "Backend Resources", icon: "Server", count: 1 },
  { id: 4, name: "CSS Resources", icon: "Palette", count: 1 },
  { id: 5, name: "Documentation", icon: "FileText", count: 1 },
  { id: 6, name: "Favorites", icon: "Heart", count: 3 },
  { id: 7, name: "Recently Added", icon: "Clock", count: 6 }
];