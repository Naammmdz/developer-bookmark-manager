import React from 'react';
import { motion } from 'framer-motion';
import { useSettings } from '../../context/SettingsContext';

const backgroundOptions: { [key: string]: { type: 'animated-blobs' | 'gradient' | 'solid', css?: string } } = {
  defaultGradient: { type: 'animated-blobs' },
  oceanBlue: { type: 'gradient', css: 'linear-gradient(135deg, #0A4D68, #088395, #05BFDB, #00FFCA)' },
  sunsetOrange: { type: 'gradient', css: 'linear-gradient(135deg, #D62828, #F77F00, #FCBF49, #EAE2B7)' },
  devDark: { type: 'solid', css: '#1a1a1d' },
  cosmicPurple: { type: 'gradient', css: 'linear-gradient(135deg, #23074d, #cc5333)' },
  forestGreen: { type: 'solid', css: '#228B22' },
};

const BackgroundAnimation: React.FC = () => {
  const { selectedBackground } = useSettings();
  const backgroundConfig = backgroundOptions[selectedBackground] || backgroundOptions.defaultGradient;

  if (backgroundConfig.type === 'animated-blobs') {
    return (
      <motion.div className="fixed inset-0 -z-10 overflow-hidden">
        {[...Array(4)].map((_, i) => (
          <motion.div
            key={i}
            className={`absolute rounded-full opacity-50 mix-blend-multiply filter blur-3xl animate-blob animation-delay-${i * 2000}`}
            style={{
              width: `${Math.random() * 30 + 50}%`, // Random width between 50% and 80%
              paddingBottom: `${Math.random() * 30 + 50}%`, // Make it a circle
              top: `${Math.random() * 70}%`, // Random top position
              left: `${Math.random() * 70}%`, // Random left position
              backgroundColor: i % 2 === 0 ? 'rgba(139, 92, 246, 0.5)' : 'rgba(236, 72, 153, 0.5)', // Alternating colors for blobs
            }}
          />
        ))}
      </motion.div>
    );
  }

  if (backgroundConfig.type === 'gradient' || backgroundConfig.type === 'solid') {
    return (
      <div
        className="fixed inset-0 -z-10"
        style={{ background: backgroundConfig.css }}
      />
    );
  }

  return null; // Fallback, though ideally one of the above should always match
};

export default BackgroundAnimation;