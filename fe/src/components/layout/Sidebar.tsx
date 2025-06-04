import React from 'react';
import { motion } from 'framer-motion';
import { useBookmarks } from '../../context/BookmarkContext';
import { Bookmark, Layers, Server, Palette, FileText, Heart, Clock } from 'lucide-react';
import GlassCard from '../ui/GlassCard';

const Sidebar: React.FC = () => {
  const { collections, activeCollection, setActiveCollection } = useBookmarks();
  
  // Map collection names to icons
  const getIcon = (iconName: string) => {
    const icons: { [key: string]: React.ReactNode } = {
      'Bookmark': <Bookmark size={18} />,
      'Layers': <Layers size={18} />,
      'Server': <Server size={18} />,
      'Palette': <Palette size={18} />,
      'FileText': <FileText size={18} />,
      'Heart': <Heart size={18} />,
      'Clock': <Clock size={18} />
    };
    
    return icons[iconName] || <Bookmark size={18} />;
  };

  return (
    <motion.aside
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ delay: 0.2 }}
      className="w-64 hidden md:block h-[calc(100vh-76px)] overflow-y-auto sticky top-[76px]"
    >
      <GlassCard className="h-full p-4 m-4">
        <h2 className="text-white/90 font-medium mb-4 px-2">Collections</h2>
        
        <nav>
          <ul className="space-y-1">
            {collections.map((collection, index) => (
              <motion.li
                key={collection.id}
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.1 + index * 0.05 }}
              >
                <button
                  className={`
                    w-full flex items-center gap-3 px-3 py-2 rounded-lg 
                    transition-all duration-300 text-left
                    ${activeCollection === collection.name 
                      ? 'bg-white/20 text-white' 
                      : 'text-white/70 hover:bg-white/10'}
                  `}
                  onClick={() => setActiveCollection(collection.name)}
                >
                  <span className={`
                    ${activeCollection === collection.name 
                      ? 'text-primary' 
                      : 'text-white/60'}
                  `}>
                    {getIcon(collection.icon)}
                  </span>
                  <span>{collection.name}</span>
                  <span className="ml-auto bg-white/10 text-white/70 text-xs px-2 py-0.5 rounded-full">
                    {collection.count}
                  </span>
                </button>
              </motion.li>
            ))}
          </ul>
        </nav>
      </GlassCard>
    </motion.aside>
  );
};

export default Sidebar;