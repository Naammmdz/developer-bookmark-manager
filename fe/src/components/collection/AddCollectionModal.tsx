import React, { useState, useEffect } from 'react';

interface AddCollectionModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAddCollection: (name: string, icon: string) => void;
}

const AddCollectionModal: React.FC<AddCollectionModalProps> = ({
  isOpen,
  onClose,
  onAddCollection,
}) => {
  const [collectionName, setCollectionName] = useState('');
  const [collectionIcon, setCollectionIcon] = useState('');

  // Reset state when modal opens/closes or is about to open
  useEffect(() => {
    if (isOpen) {
      setCollectionName('');
      setCollectionIcon('');
    }
  }, [isOpen]);

  const handleSubmit = () => {
    const trimmedName = collectionName.trim();
    const trimmedIcon = collectionIcon.trim();

    if (!trimmedName) {
      alert('Collection name cannot be empty.');
      return;
    }
    if (!trimmedIcon) {
      alert('Collection icon cannot be empty. Please provide an emoji or a short character.');
      return;
    }

    onAddCollection(trimmedName, trimmedIcon);
    onClose(); // Close modal after adding
  };

  if (!isOpen) {
    return null;
  }

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-md animate-fade-in-fast"
      onClick={onClose} // Close on overlay click
    >
      <div
        className="bg-black/20 backdrop-blur-xl border border-white/10 rounded-xl p-6 shadow-2xl w-full max-w-md" // Removed animation classes
        onClick={(e) => e.stopPropagation()} // Prevent modal close when clicking inside
      >
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-xl font-semibold text-white">Create New Collection</h2>
          <button
            onClick={onClose}
            className="text-white/70 hover:text-white transition-colors p-1 rounded-full hover:bg-white/10"
            aria-label="Close modal"
          >
            ✕
          </button>
        </div>

        <form onSubmit={(e) => { e.preventDefault(); handleSubmit(); }}>
          <div className="space-y-4">
            <div>
              <label htmlFor="collectionName" className="block text-sm font-medium text-white/80 mb-1">
                Collection Name
              </label>
              <input
                type="text"
                id="collectionName"
                value={collectionName}
                onChange={(e) => setCollectionName(e.target.value)}
                placeholder="e.g., 'React Projects' or 'Design Inspiration'"
                className="w-full p-2.5 rounded-lg bg-white/5 border border-white/20 placeholder-white/50 focus:ring-2 focus:ring-primary focus:border-primary outline-none text-white transition-colors"
                required
              />
            </div>
            <div>
              <label htmlFor="collectionIcon" className="block text-sm font-medium text-white/80 mb-1">
                Icon (Emoji or short character)
              </label>
              <input
                type="text"
                id="collectionIcon"
                value={collectionIcon}
                onChange={(e) => setCollectionIcon(e.target.value)}
                placeholder="e.g., '🚀' or '🎨'"
                className="w-full p-2.5 rounded-lg bg-white/5 border border-white/20 placeholder-white/50 focus:ring-2 focus:ring-primary focus:border-primary outline-none text-white transition-colors"
                maxLength={5} // Suggests short icon
                required
              />
            </div>
          </div>

          <div className="mt-8 flex justify-end gap-3">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-lg text-sm font-medium text-white/80 hover:bg-white/10 transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 rounded-lg text-sm font-medium bg-primary text-white hover:bg-primary/90 transition-colors"
            >
              Create Collection
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddCollectionModal;
