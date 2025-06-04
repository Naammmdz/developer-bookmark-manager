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
      className="fixed inset-0 -z-10 w-32 h-32 bg-green-500" // Hardcoded green test div
    />
  );
};

export default BackgroundAnimation;