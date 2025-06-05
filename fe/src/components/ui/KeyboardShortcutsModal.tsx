import React from 'react';
import GlassCard from './GlassCard';
import { X } from 'lucide-react';

interface KeyboardShortcutsModalProps {
  onClose: () => void;
}

const shortcuts = [
  { keys: 'Ctrl + N', action: 'Add new bookmark' },
  { keys: 'Ctrl + F', action: 'Focus search' },
  { keys: 'Ctrl + Shift + B', action: 'Open bookmarks' },
  { keys: 'Esc', action: 'Close modals/popups' },
  // Add more as needed
];

const KeyboardShortcutsModal: React.FC<KeyboardShortcutsModalProps> = ({ onClose }) => {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm">
      <GlassCard className="relative w-full max-w-md p-6 mx-4">
        <button
          className="absolute top-3 right-3 p-1.5 rounded-full bg-white/10 hover:bg-white/20 text-white/70"
          onClick={onClose}
          aria-label="Close shortcuts modal"
        >
          <X size={18} />
        </button>
        <h2 className="text-xl font-bold mb-4 text-white">Keyboard Shortcuts</h2>
        <ul className="space-y-3">
          {shortcuts.map((s, i) => (
            <li key={i} className="flex items-center justify-between text-white/90">
              <span className="font-mono bg-white/10 px-2 py-1 rounded text-sm">{s.keys}</span>
              <span className="ml-4 text-sm">{s.action}</span>
            </li>
          ))}
        </ul>
      </GlassCard>
    </div>
  );
};

export default KeyboardShortcutsModal;
