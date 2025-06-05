import React from 'react';
import { motion } from 'framer-motion';
import { useBookmarks, CollectionWithItems } from '../../context/BookmarkContext'; // Import CollectionWithItems
import { PlusCircle } from 'lucide-react'; // Added for the "Add Collection" button

// Define SidebarItemProps and SidebarItem inline functional component
interface SidebarItemProps {
  id: string;
  icon: string; // Emoji or simple character
  name: string;
  count: number;
  isActive: boolean;
  onClick: () => void;
  isStaticCollection?: boolean; // Flag to manage transition delays differently
  itemIndex?: number; // Added for improved animation delay calculation
}

const SidebarItem: React.FC<SidebarItemProps> = ({ id, icon, name, count, isActive, onClick, isStaticCollection, itemIndex }) => (
  <motion.button
    key={id}
    initial={{ opacity: 0, x: -10 }}
    animate={{ opacity: 1, x: 0 }}
    transition={{ duration: 0.2, delay: isStaticCollection && typeof itemIndex === 'number' ? 0.1 + (itemIndex * 0.03) : 0 }} // Use itemIndex for delay
    onClick={onClick}
    className={`w-full flex items-center gap-3 px-3 py-1.5 rounded-lg text-left transition-all duration-200 ease-in-out
                ${isActive
                  ? 'bg-primary/20 text-primary font-medium shadow-sm shadow-primary/30'
                  : 'text-white/70 hover:bg-white/10 hover:text-white'}`}
  >
    <span className="w-5 h-5 flex items-center justify-center text-lg">{icon}</span>
    <span className="flex-1 truncate text-sm font-medium">{name}</span>
    {count > 0 && (
      <span className={`text-xs px-1.5 py-0.5 rounded-full font-mono
                       ${isActive ? 'bg-primary text-white' : 'bg-white/10 text-white/60'}`}>
        {count}
      </span>
    )}
  </motion.button>
);

// Temporary icon mapping for this step
const getEmojiForIconName = (iconName?: string): string => {
  if (!iconName) return '📁'; // Default folder icon
  switch (iconName.toLowerCase()) {
    case 'archive': return '🗂️';
    case 'heart': return '❤️';
    case 'clock': return '🕒';
    case 'bookmark': return '🔖';
    case 'layers': return '📚';
    case 'server': return '☁️';
    case 'palette': return '🎨';
    case 'filetext': return '📄';
    default: return iconName.charAt(0).toUpperCase() || '📁'; // Fallback to first letter or folder
  }
};

const Sidebar: React.FC = () => {
  const {
    activeCollection,
    setActiveCollection,
    collectionData,
    collections: staticCollections, // Renamed for clarity, this is sampleCollections
    addCollection // Destructure addCollection function
  } = useBookmarks();

  const handleAddNewCollection = () => {
    const name = window.prompt("Enter new collection name:");
    if (name === null) return; // User cancelled
    if (name.trim() === "") {
      alert("Collection name cannot be empty.");
      return;
    }

    const icon = window.prompt(`Enter icon for "${name.trim()}" (e.g., an emoji like '📚' or '✨'):`);
    if (icon === null) return; // User cancelled
    if (icon.trim() === "") {
      alert("Collection icon cannot be empty."); // Basic validation for icon
      return;
    }
    addCollection(name.trim(), icon.trim());
  };

  // Ensure collectionData is available
  if (!collectionData || Object.keys(collectionData).length === 0) {
    return (
      <motion.aside className="hidden md:block">
        <div className="h-full flex flex-col p-6 items-center justify-center">
          <p className="text-white/50">Loading collections...</p>
        </div>
      </motion.aside>
    );
  }

  const allData = collectionData['all'];
  const favoritesData = collectionData['favorites'];
  const recentlyAddedData = collectionData['recently_added'];

  return (
    <motion.aside
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ delay: 0.1, duration: 0.3 }} // Adjusted main aside transition
      className="hidden md:block"
    >
      <div className="h-full flex flex-col">
        {/* Scrollable Collections Area */}
        <div className="flex-1 p-4 space-y-1 overflow-y-auto"> {/* Reduced padding, added space-y-1 */}
          {allData && (
            <SidebarItem
              id="all"
              icon={getEmojiForIconName(allData.icon)}
              name={allData.name}
              count={allData.count}
              isActive={activeCollection === 'all'}
              onClick={() => setActiveCollection('all')}
            />
          )}

          <div className="flex items-center justify-between pt-2 pb-1 px-3 mb-1">
            <h2 className="text-xs text-white/40 font-semibold uppercase">My Collections</h2>
            <button
              onClick={handleAddNewCollection}
              className="text-primary/80 hover:text-primary p-0.5 rounded-full hover:bg-primary/10 transition-colors"
              title="Add new collection"
            >
              <PlusCircle size={16} />
            </button>
          </div>
          {staticCollections.map((sColl, index) => {
            const data = collectionData[sColl.id];
            if (!data) return null; // Skip if data for this static collection isn't in collectionData
            return (
              <SidebarItem
                key={sColl.id} // Use sColl.id for key as it's from the map
                id={sColl.id}
                icon={getEmojiForIconName(sColl.icon)} // Use sColl.icon for the specific collection
                name={sColl.name} // Use sColl.name for consistency from static definition
                count={data.count}
                isActive={activeCollection === sColl.id}
                onClick={() => setActiveCollection(sColl.id)}
                isStaticCollection={true} // For staggered animation
                itemIndex={index} // Pass the index as itemIndex
              />
            );
          })}
        </div>

        {/* Quick Access Area */}
        <div className="p-4 border-t border-white/10 space-y-1"> {/* Reduced padding, added space-y-1 */}
           <div className="pt-1 pb-1">
            <h2 className="text-xs text-white/40 font-semibold uppercase px-3 mb-1">Quick Access</h2>
          </div>
          {favoritesData && (
            <SidebarItem
              id="favorites"
              icon={getEmojiForIconName(favoritesData.icon)}
              name={favoritesData.name}
              count={favoritesData.count}
              isActive={activeCollection === 'favorites'}
              onClick={() => setActiveCollection('favorites')}
            />
          )}
          {recentlyAddedData && (
            <SidebarItem
              id="recently_added"
              icon={getEmojiForIconName(recentlyAddedData.icon)}
              name={recentlyAddedData.name}
              count={recentlyAddedData.count}
              isActive={activeCollection === 'recently_added'}
              onClick={() => setActiveCollection('recently_added')}
            />
          )}
        </div>
      </div>
    </motion.aside>
  );
};

export default Sidebar;