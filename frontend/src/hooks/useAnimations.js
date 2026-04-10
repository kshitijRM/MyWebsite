import { useState, useCallback, useEffect, useRef } from 'react';

// Enhanced mouse position hook with smooth interpolation and inertia
export const useMousePosition = () => {
  const [mousePosition, setMousePosition] = useState({ x: 0.5, y: 0.5 });
  const targetRef = useRef({ x: 0.5, y: 0.5 });
  const currentRef = useRef({ x: 0.5, y: 0.5 });
  const velocityRef = useRef({ x: 0, y: 0 });
  const rafRef = useRef(null);
  const lastUpdateRef = useRef(Date.now());

  const handleMouseMove = useCallback((event) => {
    targetRef.current = {
      x: event.clientX / window.innerWidth,
      y: event.clientY / window.innerHeight
    };
  }, []);

  useEffect(() => {
    const animate = () => {
      const now = Date.now();
      const deltaTime = Math.min((now - lastUpdateRef.current) / 16.67, 2); // Normalize to ~60fps
      lastUpdateRef.current = now;
      
      // Calculate velocity (difference between target and current)
      const dx = targetRef.current.x - currentRef.current.x;
      const dy = targetRef.current.y - currentRef.current.y;
      
      // Apply spring-like smoothing with damping
      const springStrength = 0.08;
      const damping = 0.85;
      
      velocityRef.current.x = velocityRef.current.x * damping + dx * springStrength * deltaTime;
      velocityRef.current.y = velocityRef.current.y * damping + dy * springStrength * deltaTime;
      
      currentRef.current.x += velocityRef.current.x;
      currentRef.current.y += velocityRef.current.y;
      
      setMousePosition({ 
        x: currentRef.current.x, 
        y: currentRef.current.y 
      });
      
      rafRef.current = requestAnimationFrame(animate);
    };

    window.addEventListener('mousemove', handleMouseMove, { passive: true });
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

// Scroll progress hook with smooth interpolation
export const useScrollProgress = () => {
  const [progress, setProgress] = useState(0);
  const [section, setSection] = useState(0);
  const currentProgressRef = useRef(0);
  const targetProgressRef = useRef(0);
  const rafRef = useRef(null);

  useEffect(() => {
    const handleScroll = () => {
      const scrollY = window.scrollY;
      const docHeight = document.documentElement.scrollHeight - window.innerHeight;
      targetProgressRef.current = docHeight > 0 ? scrollY / docHeight : 0;
    };

    const animate = () => {
      // Smooth interpolation
      currentProgressRef.current += (targetProgressRef.current - currentProgressRef.current) * 0.1;
      
      setProgress(currentProgressRef.current);
      setSection(Math.min(Math.floor(currentProgressRef.current * 6), 5));
      
      rafRef.current = requestAnimationFrame(animate);
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    rafRef.current = requestAnimationFrame(animate);
    
    return () => {
      window.removeEventListener('scroll', handleScroll);
      if (rafRef.current) {
        cancelAnimationFrame(rafRef.current);
      }
    };
  }, []);

  return { progress, section };
};

// Smooth value interpolation hook
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

// Intersection observer hook for animations
export const useInViewAnimation = (options = {}) => {
  const ref = useRef(null);
  const [isInView, setIsInView] = useState(false);
  const [hasAnimated, setHasAnimated] = useState(false);

  useEffect(() => {
    const element = ref.current;
    if (!element) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && !hasAnimated) {
          setIsInView(true);
          if (options.once !== false) {
            setHasAnimated(true);
          }
        } else if (!options.once) {
          setIsInView(false);
        }
      },
      {
        threshold: options.threshold || 0.1,
        rootMargin: options.rootMargin || '0px',
      }
    );

    observer.observe(element);
    return () => observer.disconnect();
  }, [hasAnimated, options.once, options.threshold, options.rootMargin]);

  return [ref, isInView];
};
