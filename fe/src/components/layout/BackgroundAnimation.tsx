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
      <motion.div
        className="fixed inset-0 -z-10 w-32 h-32 bg-red-500" // Simple, visible style
        // No animation props for this test
      />
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