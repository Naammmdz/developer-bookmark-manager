import React from 'react';

interface KbdProps {
  children: React.ReactNode;
}

const Kbd: React.FC<KbdProps> = ({ children }) => {
  return (
    <kbd className="kbd-shortcut">
      {children}
    </kbd>
  );
};

export default Kbd;
