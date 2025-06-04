import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Plus, Minus, Link, FileText, Tag, Bookmark, Globe, Lock, Heart } from 'lucide-react';
import { useBookmarks } from '../../context/BookmarkContext';
import NeonButton from '../ui/NeonButton';

const backdrop = {
  hidden: { opacity: 0 },
  visible: { opacity: 1 },
};

const modal = {
  hidden: { 
    opacity: 0,
    y: 50,
    scale: 0.95
  },
  visible: { 
    opacity: 1,
    y: 0,
    scale: 1,
    transition: { 
      duration: 0.3,
      ease: "easeOut" 
    }
  },
  exit: { 
    opacity: 0,
    y: 50,
    scale: 0.95,
    transition: { 
      duration: 0.2,
      ease: "easeIn" 
    }
  }
};

const AddBookmarkModal: React.FC = () => {
  const { isModalOpen, closeModal, addBookmark } = useBookmarks();
  
  const [formData, setFormData] = useState({
    title: '',
    url: '',
    description: '',
    tags: [''],
    collection: 'Frontend Resources',
    isPublic: true,
    isFavorite: false,
    favicon: ''
  });
  
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };
  
  const handleTagChange = (index: number, value: string) => {
    const newTags = [...formData.tags];
    newTags[index] = value;
    setFormData(prev => ({ ...prev, tags: newTags }));
  };
  
  const addTagField = () => {
    setFormData(prev => ({ ...prev, tags: [...prev.tags, ''] }));
  };
  
  const removeTagField = (index: number) => {
    const newTags = formData.tags.filter((_, i) => i !== index);
    setFormData(prev => ({ ...prev, tags: newTags.length ? newTags : [''] }));
  };
  
  const handleCheckboxChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, checked } = e.target;
    setFormData(prev => ({ ...prev, [name]: checked }));
  };
  
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Filter empty tags
    const filteredTags = formData.tags.filter(tag => tag.trim() !== '');
    
    // Generate favicon from URL domain
    const url = new URL(formData.url.startsWith('http') ? formData.url : `https://${formData.url}`);
    const favicon = `${url.origin}/favicon.ico`;
    
    addBookmark({
      ...formData,
      tags: filteredTags,
      favicon,
      url: url.href
    });
    
    // Reset form and close modal
    setFormData({
      title: '',
      url: '',
      description: '',
      tags: [''],
      collection: 'Frontend Resources',
      isPublic: true,
      isFavorite: false,
      favicon: ''
    });
    
    closeModal();
  };
  
  return (
    <AnimatePresence>
      {isModalOpen && (
        <motion.div
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-md"
          variants={backdrop}
          initial="hidden"
          animate="visible"
          exit="hidden"
        >
          <motion.div
            className="bg-background-dark/80 backdrop-blur-xl border border-white/10 rounded-2xl shadow-2xl w-full max-w-2xl"
            variants={modal}
            initial="hidden"
            animate="visible"
            exit="exit"
          >
            <div className="flex justify-between items-center p-6 border-b border-white/10">
              <h2 className="text-xl font-semibold text-white flex items-center gap-2">
                <Bookmark className="text-primary" size={20} />
                Add New Bookmark
              </h2>
              <button 
                onClick={closeModal}
                className="text-white/50 hover:text-white transition-colors"
              >
                <X size={20} />
              </button>
            </div>
            
            <form onSubmit={handleSubmit} className="p-6">
              <div className="space-y-4">
                <div>
                  <label className="block text-white/80 text-sm font-medium mb-2">
                    <Link size={16} className="inline mr-2" />
                    URL
                  </label>
                  <input
                    type="text"
                    name="url"
                    required
                    value={formData.url}
                    onChange={handleChange}
                    placeholder="https://example.com"
                    className="w-full p-3 rounded-lg bg-white/5 border border-white/10 focus:border-primary/50 focus:ring-1 focus:ring-primary/50 text-white/90 placeholder-white/30 outline-none transition-all"
                  />
                </div>
                
                <div>
                  <label className="block text-white/80 text-sm font-medium mb-2">
                    <Bookmark size={16} className="inline mr-2" />
                    Title
                  </label>
                  <input
                    type="text"
                    name="title"
                    required
                    value={formData.title}
                    onChange={handleChange}
                    placeholder="Bookmark Title"
                    className="w-full p-3 rounded-lg bg-white/5 border border-white/10 focus:border-primary/50 focus:ring-1 focus:ring-primary/50 text-white/90 placeholder-white/30 outline-none transition-all"
                  />
                </div>
                
                <div>
                  <label className="block text-white/80 text-sm font-medium mb-2">
                    <FileText size={16} className="inline mr-2" />
                    Description
                  </label>
                  <textarea
                    name="description"
                    value={formData.description}
                    onChange={handleChange}
                    placeholder="Describe this bookmark..."
                    rows={3}
                    className="w-full p-3 rounded-lg bg-white/5 border border-white/10 focus:border-primary/50 focus:ring-1 focus:ring-primary/50 text-white/90 placeholder-white/30 outline-none transition-all resize-none"
                  />
                </div>
                
                <div>
                  <label className="block text-white/80 text-sm font-medium mb-2">
                    <Tag size={16} className="inline mr-2" />
                    Tags
                  </label>
                  {formData.tags.map((tag, index) => (
                    <div key={index} className="flex items-center gap-2 mb-2">
                      <input
                        type="text"
                        value={tag}
                        onChange={(e) => handleTagChange(index, e.target.value)}
                        placeholder="Tag name"
                        className="flex-1 p-3 rounded-lg bg-white/5 border border-white/10 focus:border-primary/50 focus:ring-1 focus:ring-primary/50 text-white/90 placeholder-white/30 outline-none transition-all"
                      />
                      <button
                        type="button"
                        onClick={() => removeTagField(index)}
                        className="p-2 text-white/50 hover:text-white/80 transition-colors"
                      >
                        <Minus size={18} />
                      </button>
                    </div>
                  ))}
                  <button
                    type="button"
                    onClick={addTagField}
                    className="text-primary/80 hover:text-primary text-sm flex items-center gap-1 transition-colors"
                  >
                    <Plus size={14} />
                    Add Tag
                  </button>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-white/80 text-sm font-medium mb-2">
                      Collection
                    </label>
                    <select
                      name="collection"
                      value={formData.collection}
                      onChange={handleChange}
                      className="w-full p-3 rounded-lg bg-white/5 border border-white/10 focus:border-primary/50 focus:ring-1 focus:ring-primary/50 text-white/90 outline-none transition-all"
                    >
                      <option value="Frontend Resources">Frontend Resources</option>
                      <option value="Backend Resources">Backend Resources</option>
                      <option value="CSS Resources">CSS Resources</option>
                      <option value="Documentation">Documentation</option>
                    </select>
                  </div>
                  
                  <div className="flex flex-col justify-end space-y-3">
                    <div className="flex items-center">
                      <input
                        type="checkbox"
                        id="isPublic"
                        name="isPublic"
                        checked={formData.isPublic}
                        onChange={handleCheckboxChange}
                        className="h-4 w-4 rounded border-white/20 text-primary focus:ring-primary/50 bg-white/5"
                      />
                      <label htmlFor="isPublic" className="ml-2 block text-white/80 text-sm">
                        <Globe size={14} className="inline mr-1" />
                        Public bookmark
                      </label>
                    </div>
                    
                    <div className="flex items-center">
                      <input
                        type="checkbox"
                        id="isFavorite"
                        name="isFavorite"
                        checked={formData.isFavorite}
                        onChange={handleCheckboxChange}
                        className="h-4 w-4 rounded border-white/20 text-primary focus:ring-primary/50 bg-white/5"
                      />
                      <label htmlFor="isFavorite" className="ml-2 block text-white/80 text-sm">
                        <Heart size={14} className="inline mr-1" />
                        Add to favorites
                      </label>
                    </div>
                  </div>
                </div>
              </div>
              
              <div className="mt-6 flex justify-end gap-3">
                <button
                  type="button"
                  onClick={closeModal}
                  className="px-4 py-2 rounded-lg bg-white/5 border border-white/10 text-white/70 hover:bg-white/10 transition-all"
                >
                  Cancel
                </button>
                <NeonButton type="submit" color="primary">
                  Save Bookmark
                </NeonButton>
              </div>
            </form>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default AddBookmarkModal;