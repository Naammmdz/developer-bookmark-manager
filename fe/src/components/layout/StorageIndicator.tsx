import React from 'react';

interface StorageIndicatorProps {
  used: string;
  total: string;
  percentage: number;
}

const StorageIndicator: React.FC<StorageIndicatorProps> = ({ used, total, percentage }) => {
  return (
    <div className="p-1 text-white/70"> {/* Adjusted padding as per prompt */}
      <div className="text-xs mb-1">Storage Usage</div>
      <div className="w-full bg-gray-600 rounded-full h-2.5"> {/* Darker gray for better contrast if sidebar is light glass */}
        <div
          className="bg-cyan-400 h-2.5 rounded-full"
          style={{ width: `${percentage}%` }}
        ></div>
      </div>
      <div className="text-xs mt-1 flex justify-between">
        <span>{used}</span>
        <span>{total}</span>
      </div>
    </div>
  );
};

export default StorageIndicator;
