import React, { useEffect, useRef } from 'react';
import { useSettings } from '../../context/SettingsContext'; // Import useSettings

// Define background styles
const backgroundOptions: { [key: string]: { type: 'particle-animation' | 'gradient' | 'solid', css?: string } } = {
  defaultGradient: { type: 'particle-animation' }, // Represents the canvas particle animation
  oceanBlue: { type: 'gradient', css: 'linear-gradient(135deg, #0A4D68, #088395, #05BFDB, #00FFCA)' },
  sunsetOrange: { type: 'gradient', css: 'linear-gradient(135deg, #D62828, #F77F00, #FCBF49, #EAE2B7)' }, // Adjusted sunsetOrange
  devDark: { type: 'solid', css: '#1a1a1d' },
  cosmicPurple: { type: 'gradient', css: 'linear-gradient(135deg, #23074d, #cc5333)' },
  forestGreen: { type: 'solid', css: '#228B22' }, // Example solid color
};

interface Particle {
  x: number;
  y: number;
  size: number;
  speedX: number;
  speedY: number;
  color: string;
}

const BackgroundAnimation: React.FC = () => {
  const { selectedBackground } = useSettings();
  const canvasRef = useRef<HTMLCanvasElement>(null);

  // Ensure a valid background option is selected, defaulting to 'defaultGradient'
  const currentBackgroundSetting = backgroundOptions[selectedBackground]
                                  ? backgroundOptions[selectedBackground]
                                  : backgroundOptions.defaultGradient;

  useEffect(() => {
    if (currentBackgroundSetting.type !== 'particle-animation') {
      // If not particle animation, no need to run canvas effect
      // Clean up canvas if it was previously active and then switched
      const canvas = canvasRef.current;
      if (canvas) {
        const ctx = canvas.getContext('2d');
        if (ctx) {
          ctx.clearRect(0, 0, canvas.width, canvas.height);
        }
      }
      return;
    }

    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const particles: Particle[] = [];
    const particleCount = 50;
    // Colors themed to the 'defaultGradient' aesthetic
    const colors = ['#00d4ff', '#8b5cf6', '#06ffa5', '#f9a8d4', '#a78bfa'];


    let animationFrameId: number;

    const handleResize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
      
      particles.length = 0;
      for (let i = 0; i < particleCount; i++) {
        particles.push({
          x: Math.random() * canvas.width,
          y: Math.random() * canvas.height,
          size: Math.random() * 2 + 0.5,
          speedX: Math.random() * 0.3 - 0.15, // Slower speeds
          speedY: Math.random() * 0.3 - 0.15, // Slower speeds
          color: colors[Math.floor(Math.random() * colors.length)]
        });
      }
    };

    handleResize();
    window.addEventListener('resize', handleResize);

    const animate = () => {
      animationFrameId = requestAnimationFrame(animate);
      
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      
      particles.forEach(particle => {
        particle.x += particle.speedX;
        particle.y += particle.speedY;
        
        if (particle.x < 0) particle.x = canvas.width;
        if (particle.x > canvas.width) particle.x = 0;
        if (particle.y < 0) particle.y = canvas.height;
        if (particle.y > canvas.height) particle.y = 0;
        
        ctx.beginPath();
        ctx.arc(particle.x, particle.y, particle.size, 0, Math.PI * 2);
        ctx.fillStyle = particle.color;
        ctx.globalAlpha = 0.4; // Slightly increased opacity for better visibility
        ctx.fill();
      });
    };
    
    animate();
    
    return () => {
      window.removeEventListener('resize', handleResize);
      cancelAnimationFrame(animationFrameId); // Clean up animation frame
      if (ctx) {
        ctx.clearRect(0, 0, canvas.width, canvas.height); // Clear canvas on unmount/re-run
      }
    };
  }, [currentBackgroundSetting.type]); // Rerun effect if background type changes

  if (currentBackgroundSetting.type === 'particle-animation') {
    return (
      <canvas
        ref={canvasRef}
        className="fixed top-0 left-0 w-full h-full -z-10 bg-background-darker" // Added base bg for canvas
      />
    );
  }

  // For solid or gradient backgrounds
  return (
    <div
      key={selectedBackground} // Add this key
      className="fixed inset-0 -z-10 overflow-hidden"
      style={{ background: currentBackgroundSetting.css }}
    />
  );
};

export default BackgroundAnimation;