import React from 'react';
import { motion } from 'framer-motion';

interface TagPillProps {
  tag: string;
  onClick?: () => void;
}

const TagPill: React.FC<TagPillProps> = ({ tag, onClick }) => {
  // Generate a consistent color based on the tag name
  const getTagColor = (tag: string) => {
    const colors = [
      'bg-primary/20 text-primary border-primary/30',
      'bg-secondary/20 text-secondary border-secondary/30',
      'bg-accent/20 text-accent border-accent/30',
      'bg-blue-500/20 text-blue-400 border-blue-500/30',
      'bg-red-500/20 text-red-400 border-red-500/30',
      'bg-yellow-500/20 text-yellow-400 border-yellow-500/30',
    ];
    
    // Simple hash function to determine color
    const hash = tag.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0);
    return colors[hash % colors.length];
  };
  
  return (
    <motion.span
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
      className={`
        ${getTagColor(tag)}
        text-xs px-2 py-1 rounded-full
        backdrop-blur-md border
        inline-flex items-center justify-center
        cursor-pointer
      `}
      onClick={onClick}
    >
      {tag}
    </motion.span>
  );
};

export default TagPill;