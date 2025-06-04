import React from 'react';
// import { motion } from 'framer-motion'; // Now unused
// import { useSettings } from '../../context/SettingsContext'; // Now unused
// import { useEffect, useRef } from 'react'; // Were already removed

/*
const backgroundOptions: { [key: string]: { type: 'animated-blobs' | 'gradient' | 'solid', css?: string } } = {
  defaultGradient: { type: 'animated-blobs' },
  oceanBlue: { type: 'gradient', css: 'linear-gradient(135deg, #0A4D68, #088395, #05BFDB, #00FFCA)' },
  sunsetOrange: { type: 'gradient', css: 'linear-gradient(135deg, #D62828, #F77F00, #FCBF49, #EAE2B7)' },
  devDark: { type: 'solid', css: '#1a1a1d' },
  cosmicPurple: { type: 'gradient', css: 'linear-gradient(135deg, #23074d, #cc5333)' },
  forestGreen: { type: 'solid', css: '#228B22' },
};
*/

const BackgroundAnimation: React.FC = () => {
  // All previous logic (useSettings, useEffect, conditional rendering) is bypassed for this test.
  return (
    <div
      style={{
        position: 'fixed',
        top: '0px',
        left: '0px',
        width: '128px', // Equivalent to w-32 (1 unit = 4px, 32 units = 128px)
        height: '128px', // Equivalent to h-32
        backgroundColor: 'lime', // Using 'lime' for a very obvious color
        zIndex: -5 // Adjusted z-index for testing
      }}
    />
  );
};

export default BackgroundAnimation;