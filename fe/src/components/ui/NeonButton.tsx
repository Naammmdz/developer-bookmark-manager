import React, { ReactNode } from 'react';
import { motion } from 'framer-motion';

interface NeonButtonProps {
  children: ReactNode;
  className?: string;
  onClick?: () => void;
  color?: 'primary' | 'secondary' | 'accent';
  size?: 'sm' | 'md' | 'lg';
  icon?: ReactNode;
}

const NeonButton: React.FC<NeonButtonProps> = ({ 
  children, 
  className = '', 
  onClick,
  color = 'primary',
  size = 'md',
  icon
}) => {
  // Color classes
  const colorClasses = {
    primary: 'bg-primary/20 border-primary/40 text-primary hover:bg-primary/30',
    secondary: 'bg-secondary/20 border-secondary/40 text-secondary hover:bg-secondary/30',
    accent: 'bg-accent/20 border-accent/40 text-accent hover:bg-accent/30'
  };
  
  // Size classes
  const sizeClasses = {
    sm: 'text-xs px-3 py-1',
    md: 'text-sm px-4 py-2',
    lg: 'text-base px-6 py-2.5'
  };

  // Shadow based on color
  const glowClasses = {
    primary: 'shadow-[0_0_15px_rgba(0,212,255,0.3)]',
    secondary: 'shadow-[0_0_15px_rgba(139,92,246,0.3)]',
    accent: 'shadow-[0_0_15px_rgba(6,255,165,0.3)]'
  };
  
  return (
    <motion.button
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
      className={`
        ${colorClasses[color]} 
        ${sizeClasses[size]} 
        ${glowClasses[color]}
        backdrop-blur-md border rounded-lg font-medium
        flex items-center justify-center gap-2
        transition-all duration-300
        ${className}
      `}
      onClick={onClick}
    >
      {icon && <span className="flex-shrink-0">{icon}</span>}
      {children}
    </motion.button>
  );
};

export default NeonButton;