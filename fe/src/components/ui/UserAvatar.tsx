import React from 'react';
import { User } from 'lucide-react'; // Assuming lucide-react

interface UserAvatarProps {
  src?: string; // Optional image source
  alt?: string;
  onClick?: () => void; // For dropdown or profile navigation
}

const UserAvatar: React.FC<UserAvatarProps> = ({ src, alt = "User Avatar", onClick }) => {
  return (
    <button
      onClick={onClick}
      className="rounded-full h-9 w-9 bg-white/10 flex items-center justify-center text-white/70 hover:bg-white/20 focus:outline-none focus:ring-2 focus:ring-cyan-400 focus:ring-opacity-75 transition-colors"
    >
      {src ? (
        <img src={src} alt={alt} className="rounded-full h-full w-full object-cover" />
      ) : (
        <User size={18} />
      )}
    </button>
  );
};

export default UserAvatar;
