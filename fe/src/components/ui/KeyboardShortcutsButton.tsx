import React, { useState } from 'react';
import { Keyboard } from 'lucide-react';
import KeyboardShortcutsModal from './KeyboardShortcutsModal';

const KeyboardShortcutsButton: React.FC = () => {
  const [open, setOpen] = useState(false);

  return (
    <>
      <button
        className="fixed bottom-6 right-6 z-50 p-3 rounded-full bg-white/10 backdrop-blur-md border border-white/20 shadow-lg hover:bg-white/20 transition-all"
        onClick={() => setOpen(true)}
        aria-label="Show keyboard shortcuts"
      >
        <Keyboard size={22} className="text-white/80" />
      </button>
      {open && <KeyboardShortcutsModal onClose={() => setOpen(false)} />}
    </>
  );
};

export default KeyboardShortcutsButton;
