import React from 'react';
import { motion } from 'framer-motion';
import CollectionItem from './CollectionItem';
import QuickAccessItem from './QuickAccessItem';
import StorageIndicator from './StorageIndicator';
// Icons for CollectionItems would typically be handled within CollectionItem or passed as props.
// For QuickAccessItem, icons are passed as string props.

const Sidebar: React.FC = () => {
  // const { collections, activeCollection, setActiveCollection } = useBookmarks(); // Keep commented for now

  // glass-card classes: bg-white/5 backdrop-blur-lg border border-white/10 rounded-xl shadow-lg
  const glassCardClasses = "bg-white/5 backdrop-filter backdrop-blur-lg border border-white/10 shadow-lg";


  return (
    <motion.aside
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ delay: 0.2 }}
      className={`fixed left-0 top-0 h-screen w-64 ${glassCardClasses} rounded-xl overflow-y-auto p-0`} // Applied glass-card, changed to rounded-xl
    >
      {/* Collections Section */}
      <div className="p-6 text-white/90">
        <h2 className="text-lg font-semibold mb-4">Collections</h2>

        {/* "All Bookmarks" item, styled like an active CollectionItem */}
        <div
          className={`flex justify-between items-center p-3 rounded-lg cursor-pointer transition-colors duration-200 mb-3 bg-white/20 hover:bg-white/30`} // Base: p-2, hover:bg-white/10. Active: bg-white/20. All: p-3
          // onClick={() => setActiveCollection('All')} // Example action
        >
          <span>All</span>
          <span className="bg-gray-700 text-xs px-2 py-0.5 rounded-full">12</span> {/* Consistent badge style */}
        </div>
        
        <div className="space-y-1"> {/* Adjusted space-y to 1 for closer items */}
          <CollectionItem name="Frontend Resources" count={3} isActive={false} />
          <CollectionItem name="Backend Resources" count={3} />
          <CollectionItem name="CSS Resources" count={3} />
          <CollectionItem name="DevOps Tools" count={2} />
          <CollectionItem name="Documentation" count={1} />
        </div>
      </div>

      {/* Quick Access Section */}
      <div className="p-6 pt-0 text-white/90">
        <h3 className="text-sm font-medium mb-3">Quick Access</h3>
        <div className="space-y-1"> {/* Adjusted space-y to 1 */}
          <QuickAccessItem icon="⭐" label="Favorites" count={6} />
          <QuickAccessItem icon="🌐" label="Public" count={9} />
          <QuickAccessItem icon="🕒" label="Recent" count={10} />
        </div>
      </div>

      {/* Storage Usage */}
      <div className="p-6 pt-0 text-white/90">
        <StorageIndicator used="6 MB" total="30 MB" percentage={20} />
      </div>
    </motion.aside>
  );
};

export default Sidebar;