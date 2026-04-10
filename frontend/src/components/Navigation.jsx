import { useState, useRef, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import soundManager from '../utils/sounds';

const NAV_ITEMS = [
  { id: 'hero', label: 'HOME', section: 0 },
  { id: 'projects', label: 'PROJECTS', section: 1 },
  { id: 'skills', label: 'SKILLS', section: 2 },
  { id: 'about', label: 'ABOUT', section: 3 },
  { id: 'contact', label: 'CONTACT', section: 4 },
];

export const Navigation = ({ currentSection, scrollToSection, isVisible }) => {
  const [isMobileOpen, setIsMobileOpen] = useState(false);

  const handleNavClick = (section) => {
    soundManager.playClick();
    scrollToSection(section);
    setIsMobileOpen(false);
  };

  return (
    <motion.header
      initial={{ y: -100, opacity: 0 }}
      animate={{ 
        y: isVisible ? 0 : -100,
        opacity: isVisible ? 1 : 0 
      }}
      transition={{ duration: 0.5 }}
      className="fixed top-0 left-0 right-0 z-50"
      data-testid="navigation"
    >
      {/* Desktop Navigation */}
      <nav className="hidden md:flex items-center justify-between px-8 lg:px-16 py-6">
        {/* Logo */}
        <motion.button
          onClick={() => handleNavClick(0)}
          className="font-heading text-xl tracking-tighter text-[var(--text-primary)] hover:text-[var(--accent-primary)] transition-colors"
          whileHover={{ scale: 1.05 }}
          onMouseEnter={() => soundManager.playHover()}
          data-testid="nav-logo"
        >
          <span className="text-[var(--accent-primary)]">K</span>D
        </motion.button>

        {/* Nav Links */}
        <div className="flex items-center gap-8">
          {NAV_ITEMS.slice(1).map((item) => (
            <button
              key={item.id}
              onClick={() => handleNavClick(item.section)}
              className={`nav-link relative ${
                currentSection === item.section ? 'text-[var(--accent-primary)]' : ''
              }`}
              onMouseEnter={() => soundManager.playHover()}
              data-testid={`nav-${item.id}`}
            >
              {item.label}
              {currentSection === item.section && (
                <motion.div
                  layoutId="navIndicator"
                  className="absolute -bottom-1 left-0 right-0 h-px bg-[var(--accent-primary)]"
                />
              )}
            </button>
          ))}
        </div>

        {/* CTA */}
        <a
          href="mailto:eng.ufoo@gmail.com"
          className="magnetic-btn text-xs py-3 px-6"
          onMouseEnter={() => soundManager.playHover()}
          data-testid="nav-cta"
        >
          HIRE ME
        </a>
      </nav>

      {/* Mobile Navigation */}
      <nav className="md:hidden flex items-center justify-between px-6 py-4">
        <motion.button
          onClick={() => handleNavClick(0)}
          className="font-heading text-xl tracking-tighter text-[var(--text-primary)]"
          data-testid="nav-logo-mobile"
        >
          <span className="text-[var(--accent-primary)]">K</span>D
        </motion.button>

        {/* Hamburger */}
        <button
          onClick={() => {
            setIsMobileOpen(!isMobileOpen);
            soundManager.playClick();
          }}
          className="relative w-8 h-8 flex flex-col justify-center gap-1.5"
          data-testid="mobile-menu-toggle"
        >
          <motion.span
            animate={{
              rotate: isMobileOpen ? 45 : 0,
              y: isMobileOpen ? 6 : 0
            }}
            className="w-full h-0.5 bg-[var(--text-primary)]"
          />
          <motion.span
            animate={{
              opacity: isMobileOpen ? 0 : 1
            }}
            className="w-full h-0.5 bg-[var(--text-primary)]"
          />
          <motion.span
            animate={{
              rotate: isMobileOpen ? -45 : 0,
              y: isMobileOpen ? -6 : 0
            }}
            className="w-full h-0.5 bg-[var(--text-primary)]"
          />
        </button>
      </nav>

      {/* Mobile Menu Overlay */}
      <AnimatePresence>
        {isMobileOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-[var(--bg-primary)]/95 backdrop-blur-xl md:hidden z-40"
            data-testid="mobile-menu"
          >
            <div className="flex flex-col items-center justify-center h-full gap-8">
              {NAV_ITEMS.map((item, index) => (
                <motion.button
                  key={item.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  transition={{ delay: index * 0.1 }}
                  onClick={() => handleNavClick(item.section)}
                  className={`font-heading text-3xl tracking-tight ${
                    currentSection === item.section 
                      ? 'text-[var(--accent-primary)]' 
                      : 'text-[var(--text-primary)]'
                  }`}
                  data-testid={`mobile-nav-${item.id}`}
                >
                  {item.label}
                </motion.button>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.header>
  );
};

export default Navigation;
