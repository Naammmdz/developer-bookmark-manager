import React from 'react';
import { useSettings } from '../../context/SettingsContext';
import { X, CheckCircle } from 'lucide-react';

interface SettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
}

// These should ideally match the keys and provide human-readable names
// for the options defined in BackgroundAnimation.tsx
// Preview styles are simplified here; they could be more elaborate.
const backgroundDisplayOptions = [
  {
    key: 'defaultGradient',
    name: 'Default Animation',
    previewStyle: { background: 'linear-gradient(135deg, #00d4ff, #8b5cf6, #06ffa5)', opacity: 0.7 }
  },
  {
    key: 'oceanBlue',
    name: 'Ocean Blue',
    previewStyle: { background: 'linear-gradient(135deg, #0A4D68, #05BFDB)' }
  },
  {
    key: 'sunsetOrange',
    name: 'Sunset Orange',
    previewStyle: { background: 'linear-gradient(135deg, #D62828, #FCBF49)' }
  },
  {
    key: 'devDark',
    name: 'Developer Dark',
    previewStyle: { background: '#1a1a1d' }
  },
  {
    key: 'cosmicPurple',
    name: 'Cosmic Purple',
    previewStyle: { background: 'linear-gradient(135deg, #23074d, #cc5333)'}
  },
  {
    key: 'forestGreen',
    name: 'Forest Green',
    previewStyle: { background: '#228B22' }  // Solid color from previous step
  }
];


const SettingsModal: React.FC<SettingsModalProps> = ({ isOpen, onClose }) => {
  const { selectedBackground, setSelectedBackground } = useSettings();

  if (!isOpen) return null;

  const handleOverlayClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  return (
    <div
      className="fixed inset-0 bg-black/70 backdrop-blur-md flex items-center justify-center z-[100] p-4" // Increased z-index
      onClick={handleOverlayClick}
    >
      <div
        className="bg-background-darker/90 backdrop-blur-xl border border-white/10 rounded-xl shadow-2xl w-full max-w-lg p-6 sm:p-8 text-white transform transition-all"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold">Display Settings</h2>
          <button
            onClick={onClose}
            className="text-white/70 hover:text-white transition-colors p-1.5 rounded-full hover:bg-white/10"
            aria-label="Close settings"
          >
            <X size={22} />
          </button>
        </div>

        <div>
          <h3 className="text-lg font-medium mb-1 text-white/90">Background Theme</h3>
          <p className="text-sm text-white/60 mb-5">Choose your preferred background style for the application.</p>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-4 gap-y-3">
            {backgroundDisplayOptions.map((option) => (
              <button
                key={option.key}
                onClick={() => setSelectedBackground(option.key)}
                className={`
                  p-3.5 rounded-lg border text-left
                  transition-all duration-200 ease-in-out
                  focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-background-darker
                  ${selectedBackground === option.key
                    ? 'border-primary bg-primary/10 ring-2 ring-primary' // Enhanced selected state
                    : 'border-white/20 bg-white/[.03] hover:border-white/30 hover:bg-white/[.06]'}
                `}
                aria-pressed={selectedBackground === option.key}
              >
                <div className="flex items-center justify-between">
                  <span className="font-medium text-sm text-white/95">{option.name}</span>
                  {selectedBackground === option.key && <CheckCircle size={18} className="text-primary" />}
                </div>
                <div
                  className="w-full h-7 mt-2 rounded border border-white/10"
                  style={option.previewStyle}
                  aria-hidden="true"
                />
              </button>
            ))}
          </div>
        </div>

        <div className="mt-8 pt-6 border-t border-white/10 text-right">
          <button
            onClick={onClose}
            className="px-6 py-2.5 rounded-lg bg-primary hover:bg-primary/90 text-black font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 focus:ring-offset-background-darker"
          >
            Done
          </button>
        </div>
      </div>
    </div>
  );
};

export default SettingsModal;
