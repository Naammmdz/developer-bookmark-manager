import React from 'react';
import { Search } from 'lucide-react'; // Assuming lucide-react is available

interface SearchInputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  // Any additional specific props
  containerClassName?: string;
}

const SearchInput: React.FC<SearchInputProps> = ({ containerClassName, ...props }) => {
  return (
    <div className={`relative flex-1 ${containerClassName || ''}`}>
      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
        <Search size={18} className="text-white/50" />
      </div>
      <input
        type="search"
        {...props}
        className={`w-full py-2 pl-10 pr-4 rounded-lg bg-white/10 border border-transparent hover:border-white/20 focus:bg-white/5 focus:border-cyan-400 focus:ring-1 focus:ring-cyan-400 text-white placeholder-white/50 outline-none transition-all text-sm ${props.className || ''}`}
      />
    </div>
  );
};

export default SearchInput;
