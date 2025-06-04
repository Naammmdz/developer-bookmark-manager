import React, { ReactNode } from 'react';
import { motion } from 'framer-motion';

interface GlassCardProps {
  children: ReactNode;
  className?: string;
  animate?: boolean;
  delay?: number;
  onClick?: () => void;
}

const GlassCard: React.FC<GlassCardProps> = ({ 
  children, 
  className = '', 
  animate = true,
  delay = 0,
  onClick
}) => {
  const baseClasses = "bg-white/10 backdrop-blur-lg border border-white/20 rounded-2xl";
  const hoverClasses = "hover:bg-white/15 hover:border-white/30 transition-all duration-300";
  const shadowClasses = "shadow-[0_8px_32px_rgba(0,0,0,0.3),inset_0_1px_0_rgba(255,255,255,0.2)]";
  
  return animate ? (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: delay * 0.1 }}
      whileHover={{ scale: 1.02, boxShadow: '0 10px 40px rgba(0,0,0,0.4), inset 0 1px 0 rgba(255,255,255,0.3)' }}
      className={`${baseClasses} ${hoverClasses} ${shadowClasses} ${className}`}
      onClick={onClick}
    >
      {children}
    </motion.div>
  ) : (
    <div 
      className={`${baseClasses} ${hoverClasses} ${shadowClasses} ${className}`}
      onClick={onClick}
    >
      {children}
    </div>
  );
};

export default GlassCard;