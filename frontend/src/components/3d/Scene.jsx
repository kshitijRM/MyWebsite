import React, { useRef, useEffect, useState, useMemo, useCallback } from 'react';

// Particle class for canvas-based particles
class Particle {
  constructor(canvas) {
    this.canvas = canvas;
    this.reset();
  }
  
  reset() {
    this.x = Math.random() * this.canvas.width;
    this.y = Math.random() * this.canvas.height;
    this.size = Math.random() * 2 + 0.5;
    this.speedX = (Math.random() - 0.5) * 0.5;
    this.speedY = (Math.random() - 0.5) * 0.5;
    this.opacity = Math.random() * 0.6 + 0.2;
    
    const colorRand = Math.random();
    if (colorRand < 0.1) {
      this.color = '#E0FF00'; // Volt Yellow
    } else if (colorRand < 0.15) {
      this.color = '#FF003C'; // Crimson
    } else {
      this.color = '#F2F2F2'; // White
    }
  }
  
  update() {
    this.x += this.speedX;
    this.y += this.speedY;
    
    if (this.x < 0 || this.x > this.canvas.width) this.speedX *= -1;
    if (this.y < 0 || this.y > this.canvas.height) this.speedY *= -1;
  }
  
  draw(ctx) {
    ctx.beginPath();
    ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
    ctx.fillStyle = this.color;
    ctx.globalAlpha = this.opacity;
    ctx.fill();
    ctx.globalAlpha = 1;
  }
}

// Canvas-based particle background
export const Scene = ({ currentSection, mousePosition }) => {
  const canvasRef = useRef(null);
  const animationRef = useRef(null);
  const particlesRef = useRef([]);
  const [dimensions, setDimensions] = useState({ width: 0, height: 0 });
  
  // Initialize canvas and particles
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    
    const resize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
      setDimensions({ width: canvas.width, height: canvas.height });
      
      // Reinitialize particles on resize
      particlesRef.current = Array.from({ length: 150 }, () => new Particle(canvas));
    };
    
    resize();
    window.addEventListener('resize', resize);
    
    return () => window.removeEventListener('resize', resize);
  }, []);
  
  // Animation loop
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    
    const ctx = canvas.getContext('2d');
    let mouseX = canvas.width / 2;
    let mouseY = canvas.height / 2;
    
    const animate = () => {
      // Clear with trail effect
      ctx.fillStyle = 'rgba(3, 3, 3, 0.1)';
      ctx.fillRect(0, 0, canvas.width, canvas.height);
      
      // Update mouse position effect
      if (mousePosition) {
        mouseX = mousePosition.x * canvas.width;
        mouseY = mousePosition.y * canvas.height;
      }
      
      // Draw and update particles
      particlesRef.current.forEach(particle => {
        // Add subtle attraction to mouse
        const dx = mouseX - particle.x;
        const dy = mouseY - particle.y;
        const dist = Math.sqrt(dx * dx + dy * dy);
        
        if (dist < 200) {
          particle.speedX += dx * 0.00005;
          particle.speedY += dy * 0.00005;
        }
        
        particle.update();
        particle.draw(ctx);
      });
      
      // Draw grid lines
      ctx.strokeStyle = 'rgba(224, 255, 0, 0.03)';
      ctx.lineWidth = 1;
      
      const gridSize = 50;
      for (let x = 0; x < canvas.width; x += gridSize) {
        ctx.beginPath();
        ctx.moveTo(x, 0);
        ctx.lineTo(x, canvas.height);
        ctx.stroke();
      }
      for (let y = 0; y < canvas.height; y += gridSize) {
        ctx.beginPath();
        ctx.moveTo(0, y);
        ctx.lineTo(canvas.width, y);
        ctx.stroke();
      }
      
      // Draw floating shapes
      const time = Date.now() * 0.001;
      const shapes = [
        { x: canvas.width * 0.2, y: canvas.height * 0.3, size: 30, speed: 0.5 },
        { x: canvas.width * 0.8, y: canvas.height * 0.7, size: 25, speed: 0.7 },
        { x: canvas.width * 0.5, y: canvas.height * 0.2, size: 20, speed: 0.4 },
        { x: canvas.width * 0.15, y: canvas.height * 0.8, size: 35, speed: 0.6 },
        { x: canvas.width * 0.85, y: canvas.height * 0.25, size: 28, speed: 0.55 },
      ];
      
      shapes.forEach((shape, i) => {
        const yOffset = Math.sin(time * shape.speed + i) * 20;
        const rotation = time * shape.speed;
        
        ctx.save();
        ctx.translate(shape.x, shape.y + yOffset);
        ctx.rotate(rotation);
        ctx.strokeStyle = i % 2 === 0 ? 'rgba(224, 255, 0, 0.2)' : 'rgba(255, 0, 60, 0.15)';
        ctx.lineWidth = 1;
        
        // Draw octahedron-like shape
        ctx.beginPath();
        ctx.moveTo(0, -shape.size);
        ctx.lineTo(shape.size * 0.7, 0);
        ctx.lineTo(0, shape.size);
        ctx.lineTo(-shape.size * 0.7, 0);
        ctx.closePath();
        ctx.stroke();
        
        ctx.restore();
      });
      
      // Glow effect at mouse position
      const gradient = ctx.createRadialGradient(mouseX, mouseY, 0, mouseX, mouseY, 150);
      gradient.addColorStop(0, 'rgba(224, 255, 0, 0.05)');
      gradient.addColorStop(1, 'rgba(224, 255, 0, 0)');
      ctx.fillStyle = gradient;
      ctx.fillRect(0, 0, canvas.width, canvas.height);
      
      animationRef.current = requestAnimationFrame(animate);
    };
    
    animate();
    
    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
    };
  }, [mousePosition]);
  
  return (
    <div 
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        width: '100%',
        height: '100%',
        zIndex: 0,
        background: '#030303'
      }}
    >
      <canvas
        ref={canvasRef}
        style={{
          position: 'absolute',
          top: 0,
          left: 0,
          width: '100%',
          height: '100%'
        }}
      />
      
      {/* Vignette overlay */}
      <div
        style={{
          position: 'absolute',
          inset: 0,
          background: 'radial-gradient(ellipse at center, transparent 0%, rgba(3,3,3,0.8) 100%)',
          pointerEvents: 'none'
        }}
      />
      
      {/* Noise overlay */}
      <div
        style={{
          position: 'absolute',
          inset: 0,
          opacity: 0.03,
          backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.7' numOctaves='4'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E")`,
          pointerEvents: 'none'
        }}
      />
    </div>
  );
};

export default Scene;
