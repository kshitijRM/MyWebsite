import { useState, useRef, useCallback, useEffect } from 'react';
import { motion } from 'framer-motion';
import "@/App.css";

import Scene from './components/3d/Scene';
import Navigation from './components/Navigation';
import LoadingScreen from './components/zones/LoadingScreen';
import HeroZone from './components/zones/HeroZone';
import ProjectZone from './components/zones/ProjectZone';
import SkillsZone from './components/zones/SkillsZone';
import AboutZone from './components/zones/AboutZone';
import ContactZone from './components/zones/ContactZone';

import { useMousePosition } from './hooks/useAnimations';

function App() {
  const [isLoading, setIsLoading] = useState(true);
  const [showScene, setShowScene] = useState(false);
  const [currentSection, setCurrentSection] = useState(0);
  const [navVisible, setNavVisible] = useState(false);
  const mousePosition = useMousePosition();
  const containerRef = useRef(null);
  const sectionsRef = useRef([]);

  // Handle loading complete
  const handleLoadingComplete = useCallback(() => {
    setIsLoading(false);
    setNavVisible(true);
    // Delay showing the scene to avoid race conditions
    setTimeout(() => setShowScene(true), 100);
  }, []);

  // Scroll to section
  const scrollToSection = useCallback((sectionIndex) => {
    const section = sectionsRef.current[sectionIndex];
    if (section) {
      section.scrollIntoView({ behavior: 'smooth' });
    }
  }, []);

  // Intersection observer for sections
  useEffect(() => {
    if (isLoading) return;

    const observerOptions = {
      root: null,
      rootMargin: '-50% 0px',
      threshold: 0
    };

    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          const index = sectionsRef.current.findIndex(
            (section) => section === entry.target
          );
          if (index !== -1) {
            setCurrentSection(index);
          }
        }
      });
    }, observerOptions);

    sectionsRef.current.forEach((section) => {
      if (section) observer.observe(section);
    });

    return () => observer.disconnect();
  }, [isLoading]);

  // Handle keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (isLoading) return;
      
      if (e.key === 'ArrowDown' || e.key === 'PageDown') {
        e.preventDefault();
        const next = Math.min(currentSection + 1, 4);
        scrollToSection(next);
      } else if (e.key === 'ArrowUp' || e.key === 'PageUp') {
        e.preventDefault();
        const prev = Math.max(currentSection - 1, 0);
        scrollToSection(prev);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isLoading, currentSection, scrollToSection]);

  return (
    <div className="App" data-testid="app-container">
      {/* Loading Screen */}
      {isLoading && (
        <LoadingScreen onComplete={handleLoadingComplete} />
      )}

      {/* 3D Scene - Only render after loading is complete */}
      {showScene && (
        <Scene 
          currentSection={currentSection} 
          mousePosition={mousePosition}
        />
      )}

      {/* Navigation */}
      {!isLoading && (
        <Navigation
          currentSection={currentSection}
          scrollToSection={scrollToSection}
          isVisible={navVisible}
        />
      )}

      {/* Content Overlay */}
      {!isLoading && (
        <main ref={containerRef} className="ui-overlay noise-overlay">
          <div ref={(el) => (sectionsRef.current[0] = el)}>
            <HeroZone scrollToSection={scrollToSection} />
          </div>
          <div ref={(el) => (sectionsRef.current[1] = el)}>
            <ProjectZone />
          </div>
          <div ref={(el) => (sectionsRef.current[2] = el)}>
            <SkillsZone />
          </div>
          <div ref={(el) => (sectionsRef.current[3] = el)}>
            <AboutZone />
          </div>
          <div ref={(el) => (sectionsRef.current[4] = el)}>
            <ContactZone />
          </div>
        </main>
      )}

      {/* Section Indicator */}
      {!isLoading && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1 }}
          className="fixed right-8 top-1/2 -translate-y-1/2 z-40 hidden lg:flex flex-col gap-3"
          data-testid="section-indicator"
        >
          {[0, 1, 2, 3, 4].map((index) => (
            <button
              key={index}
              onClick={() => scrollToSection(index)}
              className={`w-2 h-2 rounded-full transition-all duration-300 ${
                currentSection === index
                  ? 'bg-[var(--accent-primary)] scale-125'
                  : 'bg-[var(--text-muted)] hover:bg-[var(--text-secondary)]'
              }`}
              aria-label={`Go to section ${index + 1}`}
              data-testid={`section-dot-${index}`}
            />
          ))}
        </motion.div>
      )}
    </div>
  );
}

export default App;
