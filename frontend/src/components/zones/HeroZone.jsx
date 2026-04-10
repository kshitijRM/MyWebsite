import { useRef, useEffect } from 'react';
import { motion, useInView } from 'framer-motion';
import { ArrowDown, Github, Linkedin, Mail, Phone } from 'lucide-react';
import soundManager from '../../utils/sounds';

export const HeroZone = ({ scrollToSection }) => {
  const ref = useRef(null);
  const isInView = useInView(ref, { amount: 0.5 });

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.15,
        delayChildren: 0.3
      }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 30 },
    visible: { 
      opacity: 1, 
      y: 0,
      transition: { duration: 0.8, ease: [0.4, 0, 0.2, 1] }
    }
  };

  const handleScroll = () => {
    soundManager.playClick();
    scrollToSection(1);
  };

  return (
    <section
      ref={ref}
      className="relative min-h-screen flex items-center justify-center px-8 md:px-16"
      data-testid="hero-zone"
    >
      <motion.div
        className="text-center max-w-4xl"
        variants={containerVariants}
        initial="hidden"
        animate={isInView ? "visible" : "hidden"}
      >
        {/* Role Label */}
        <motion.p 
          variants={itemVariants}
          className="font-mono text-xs tracking-[0.3em] text-[var(--accent-primary)] mb-6"
        >
          CREATIVE FULL STACK DEVELOPER
        </motion.p>

        {/* Main Name */}
        <motion.h1 
          variants={itemVariants}
          className="font-heading text-5xl md:text-7xl lg:text-8xl tracking-tighter mb-6 leading-none"
        >
          <span className="text-[var(--text-primary)]">KSHITIJ</span>
          <br />
          <span className="text-[var(--accent-primary)] glow-text">DINNI</span>
        </motion.h1>

        {/* Tagline */}
        <motion.p 
          variants={itemVariants}
          className="font-body text-lg md:text-xl text-[var(--text-secondary)] max-w-2xl mx-auto mb-12"
        >
          Crafting immersive digital experiences through code. 
          Bridging the gap between design and technology.
        </motion.p>

        {/* Social Links */}
        <motion.div 
          variants={itemVariants}
          className="flex items-center justify-center gap-8 mb-16"
        >
          <a
            href="https://github.com/kshitijRM"
            target="_blank"
            rel="noopener noreferrer"
            className="group flex items-center gap-2 text-[var(--text-secondary)] hover:text-[var(--accent-primary)] transition-colors"
            onMouseEnter={() => soundManager.playHover()}
            data-testid="github-link"
          >
            <Github size={20} />
            <span className="font-mono text-xs tracking-wider hidden md:inline">GITHUB</span>
          </a>
          <a
            href="https://www.linkedin.com/in/kshitij-dinni"
            target="_blank"
            rel="noopener noreferrer"
            className="group flex items-center gap-2 text-[var(--text-secondary)] hover:text-[var(--accent-primary)] transition-colors"
            onMouseEnter={() => soundManager.playHover()}
            data-testid="linkedin-link"
          >
            <Linkedin size={20} />
            <span className="font-mono text-xs tracking-wider hidden md:inline">LINKEDIN</span>
          </a>
          <a
            href="mailto:support@kshitijdinni.e"
            className="group flex items-center gap-2 text-[var(--text-secondary)] hover:text-[var(--accent-primary)] transition-colors"
            onMouseEnter={() => soundManager.playHover()}
            data-testid="email-link"
          >
            <Mail size={20} />
            <span className="font-mono text-xs tracking-wider hidden md:inline">EMAIL</span>
          </a>
          <a
            href="tel:9272501980"
            className="group flex items-center gap-2 text-[var(--text-secondary)] hover:text-[var(--accent-primary)] transition-colors"
            onMouseEnter={() => soundManager.playHover()}
            data-testid="phone-link"
          >
            <Phone size={20} />
            <span className="font-mono text-xs tracking-wider hidden md:inline">CALL</span>
          </a>
        </motion.div>

        {/* Scroll Indicator */}
        <motion.button
          variants={itemVariants}
          onClick={handleScroll}
          className="flex flex-col items-center gap-2 text-[var(--text-muted)] hover:text-[var(--accent-primary)] transition-colors cursor-pointer"
          data-testid="scroll-indicator"
        >
          <span className="font-mono text-xs tracking-wider">EXPLORE</span>
          <motion.div
            animate={{ y: [0, 8, 0] }}
            transition={{ duration: 1.5, repeat: Infinity, ease: "easeInOut" }}
          >
            <ArrowDown size={20} />
          </motion.div>
        </motion.button>
      </motion.div>

      {/* Decorative Elements */}
      <div className="absolute top-1/4 left-8 md:left-16 w-px h-32 bg-gradient-to-b from-transparent via-[var(--accent-primary)] to-transparent opacity-30" />
      <div className="absolute bottom-1/4 right-8 md:right-16 w-px h-32 bg-gradient-to-b from-transparent via-[var(--accent-secondary)] to-transparent opacity-30" />
    </section>
  );
};

export default HeroZone;
