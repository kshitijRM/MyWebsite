import { useState, useCallback, useEffect, useRef } from 'react';

export const useMousePosition = () => {
  const [mousePosition, setMousePosition] = useState({ x: 0.5, y: 0.5 });
  const targetRef = useRef({ x: 0.5, y: 0.5 });
  const currentRef = useRef({ x: 0.5, y: 0.5 });
  const rafRef = useRef(null);

  const handleMouseMove = useCallback((event) => {
    targetRef.current = {
      x: event.clientX / window.innerWidth,
      y: event.clientY / window.innerHeight
    };
  }, []);

  useEffect(() => {
    const animate = () => {
      // Smooth interpolation
      currentRef.current.x += (targetRef.current.x - currentRef.current.x) * 0.1;
      currentRef.current.y += (targetRef.current.y - currentRef.current.y) * 0.1;
      
      setMousePosition({ ...currentRef.current });
      rafRef.current = requestAnimationFrame(animate);
    };

    window.addEventListener('mousemove', handleMouseMove);
    rafRef.current = requestAnimationFrame(animate);

    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      if (rafRef.current) {
        cancelAnimationFrame(rafRef.current);
      }
    };
  }, [handleMouseMove]);

  return mousePosition;
};

export const useScrollProgress = () => {
  const [progress, setProgress] = useState(0);
  const [section, setSection] = useState(0);

  useEffect(() => {
    const handleScroll = () => {
      const scrollY = window.scrollY;
      const docHeight = document.documentElement.scrollHeight - window.innerHeight;
      const scrollProgress = scrollY / docHeight;
      
      setProgress(scrollProgress);
      
      // Calculate current section (0-5 for 6 sections)
      const sectionIndex = Math.floor(scrollProgress * 6);
      setSection(Math.min(sectionIndex, 5));
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return { progress, section };
};

export const useSmoothValue = (targetValue, smoothing = 0.1) => {
  const [value, setValue] = useState(targetValue);
  const currentRef = useRef(targetValue);
  const rafRef = useRef(null);

  useEffect(() => {
    const animate = () => {
      currentRef.current += (targetValue - currentRef.current) * smoothing;
      setValue(currentRef.current);
      
      if (Math.abs(targetValue - currentRef.current) > 0.001) {
        rafRef.current = requestAnimationFrame(animate);
      }
    };

    rafRef.current = requestAnimationFrame(animate);
    
    return () => {
      if (rafRef.current) {
        cancelAnimationFrame(rafRef.current);
      }
    };
  }, [targetValue, smoothing]);

  return value;
};
