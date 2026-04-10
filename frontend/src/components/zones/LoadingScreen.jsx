import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import soundManager from '../../utils/sounds';

export const LoadingScreen = ({ onComplete }) => {
  const [progress, setProgress] = useState(0);
  const [isReady, setIsReady] = useState(false);
  const [isExiting, setIsExiting] = useState(false);

  useEffect(() => {
    // Simulate loading with realistic progress
    const duration = 3000;
    const steps = 100;
    const interval = duration / steps;
    let current = 0;
    
    const timer = setInterval(() => {
      // Non-linear progress for realism
      const remaining = 100 - current;
      const increment = Math.min(remaining * 0.1 + Math.random() * 2, remaining);
      current = Math.min(current + increment, 100);
      setProgress(Math.floor(current));
      
      if (current >= 100) {
        clearInterval(timer);
        setIsReady(true);
      }
    }, interval);

    return () => clearInterval(timer);
  }, []);

  const handleEnter = () => {
    soundManager.init();
    soundManager.playClick();
    setIsExiting(true);
    setTimeout(() => {
      onComplete();
    }, 1000);
  };

  return (
    <AnimatePresence>
      {!isExiting && (
        <motion.div
          className="loading-screen"
          initial={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 1, ease: 'easeInOut' }}
          data-testid="loading-screen"
        >
          {/* Background Grid Effect */}
          <div className="absolute inset-0 opacity-5">
            <div 
              className="w-full h-full"
              style={{
                backgroundImage: `linear-gradient(rgba(224, 255, 0, 0.1) 1px, transparent 1px),
                                  linear-gradient(90deg, rgba(224, 255, 0, 0.1) 1px, transparent 1px)`,
                backgroundSize: '50px 50px'
              }}
            />
          </div>

          <div className="relative z-10 flex flex-col items-center">
            {/* Logo / Name */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
              className="mb-16"
            >
              <h1 className="font-heading text-4xl md:text-6xl tracking-tighter text-[var(--text-primary)]">
                <span className="text-[var(--accent-primary)] glow-text">K</span>SHITIJ
              </h1>
              <p className="font-mono text-xs tracking-[0.3em] text-[var(--text-secondary)] mt-2 text-center">
                CREATIVE DEVELOPER
              </p>
            </motion.div>

            {/* Loading Bar */}
            <motion.div 
              className="w-48 md:w-64"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.3 }}
            >
              <div className="flex justify-between mb-2">
                <span className="font-mono text-xs text-[var(--text-muted)]">LOADING</span>
                <span className="font-mono text-xs text-[var(--accent-primary)]">{progress}%</span>
              </div>
              <div className="loading-bar">
                <motion.div 
                  className="loading-bar-fill"
                  initial={{ width: 0 }}
                  animate={{ width: `${progress}%` }}
                  transition={{ duration: 0.1 }}
                />
              </div>
            </motion.div>

            {/* Enter Button */}
            <AnimatePresence>
              {isReady && (
                <motion.button
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5 }}
                  onClick={handleEnter}
                  className="magnetic-btn mt-12"
                  data-testid="enter-experience-btn"
                >
                  ENTER EXPERIENCE
                </motion.button>
              )}
            </AnimatePresence>
          </div>

          {/* Corner Decorations */}
          <div className="absolute top-8 left-8 w-12 h-12 border-l border-t border-[var(--border-subtle)]" />
          <div className="absolute top-8 right-8 w-12 h-12 border-r border-t border-[var(--border-subtle)]" />
          <div className="absolute bottom-8 left-8 w-12 h-12 border-l border-b border-[var(--border-subtle)]" />
          <div className="absolute bottom-8 right-8 w-12 h-12 border-r border-b border-[var(--border-subtle)]" />
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default LoadingScreen;
