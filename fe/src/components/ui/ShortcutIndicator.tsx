import React from 'react';
import Kbd from './Kbd';

interface ShortcutIndicatorProps {
  keys: string[];
}

const ShortcutIndicator: React.FC<ShortcutIndicatorProps> = ({ keys }) => {
  return (
    <div className="flex items-center space-x-1">
      {keys.map((key, index) => (
        <React.Fragment key={key}>
          <Kbd>{key}</Kbd>
          {index < keys.length - 1 && <span>+</span>}
        </React.Fragment>
      ))}
    </div>
  );
};

export default ShortcutIndicator;
