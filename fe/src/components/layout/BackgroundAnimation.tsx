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

  // Ensure a valid background option is selected, defaulting to 'defaultGradient'
  const currentBackgroundSetting = backgroundOptions[selectedBackground]
                                  ? backgroundOptions[selectedBackground]
                                  : backgroundOptions.defaultGradient;

  if (currentBackgroundSetting.type === 'animated-blobs') {
    return (
      <div className="fixed inset-0 -z-10 overflow-hidden"> {/* Main container for blobs */}
        <motion.div
          className="absolute top-0 left-0 w-[800px] h-[800px] bg-gradient-to-br from-primary/40 to-secondary/40 rounded-full blur-[150px] opacity-40"
          animate={{
            x: [-200, 0, -200],
            y: [-200, 0, -200],
            scale: [1, 1.2, 1],
            rotate: [0, 90, 0],
          }}
          transition={{
            duration: 25,
            ease: "easeInOut",
            repeat: Infinity,
            repeatType: "mirror"
          }}
        />
        <motion.div
          className="absolute bottom-0 right-0 w-[600px] h-[600px] bg-gradient-to-tl from-accent/30 to-primary/30 rounded-full blur-[120px] opacity-30"
          animate={{
            x: [100, -100, 100],
            y: [100, -50, 100],
            scale: [1, 1.1, 1],
            rotate: [0, -90, 0],
          }}
          transition={{
            duration: 20,
            ease: "easeInOut",
            repeat: Infinity,
            repeatType: "mirror",
            delay: 2
          }}
        />
        {/* This div creates an overlay that can subtly tint or darken the animated blobs
            or ensure text readability if blobs are too bright.
            Adjust opacity or remove if not desired. */}
        <div className="absolute inset-0 bg-gradient-to-br from-background-dark/20 via-transparent to-background-darker/20"></div>
      </div>
    );
  }

  // For solid or gradient backgrounds
  return (
    <div
      key={selectedBackground}
      className="fixed inset-0 -z-10 overflow-hidden"
      style={{ background: currentBackgroundSetting.css }}
    />
  );
};

export default BackgroundAnimation;