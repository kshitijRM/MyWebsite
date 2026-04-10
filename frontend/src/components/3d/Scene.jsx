import React, { useRef, useEffect, useState, useCallback } from 'react';

// Easing functions for smooth animations
const easing = {
  easeOutExpo: (t) => (t === 1 ? 1 : 1 - Math.pow(2, -10 * t)),
  easeOutCubic: (t) => 1 - Math.pow(1 - t, 3),
  easeInOutSine: (t) => -(Math.cos(Math.PI * t) - 1) / 2,
  easeOutQuart: (t) => 1 - Math.pow(1 - t, 4),
};

// Lerp utility for smooth interpolation
const lerp = (start, end, factor) => start + (end - start) * factor;

// Particle class with enhanced physics
class Particle {
  constructor(canvas, layer = 0) {
    this.canvas = canvas;
    this.layer = layer; // 0 = far, 1 = mid, 2 = near
    this.reset();
  }
  
  reset() {
    const layerConfig = [
      { sizeRange: [0.3, 1], speedRange: [0.1, 0.3], opacityRange: [0.2, 0.4] },
      { sizeRange: [0.8, 1.5], speedRange: [0.2, 0.5], opacityRange: [0.3, 0.6] },
      { sizeRange: [1.2, 2.5], speedRange: [0.3, 0.7], opacityRange: [0.5, 0.8] },
    ][this.layer];
    
    this.x = Math.random() * this.canvas.width;
    this.y = Math.random() * this.canvas.height;
    this.size = layerConfig.sizeRange[0] + Math.random() * (layerConfig.sizeRange[1] - layerConfig.sizeRange[0]);
    this.baseSpeedX = (Math.random() - 0.5) * layerConfig.speedRange[1];
    this.baseSpeedY = (Math.random() - 0.5) * layerConfig.speedRange[1];
    this.speedX = this.baseSpeedX;
    this.speedY = this.baseSpeedY;
    this.opacity = layerConfig.opacityRange[0] + Math.random() * (layerConfig.opacityRange[1] - layerConfig.opacityRange[0]);
    this.baseOpacity = this.opacity;
    this.pulseOffset = Math.random() * Math.PI * 2;
    this.pulseSpeed = 0.5 + Math.random() * 1;
    
    // Color selection with weighted distribution
    const colorRand = Math.random();
    if (colorRand < 0.08) {
      this.color = { r: 224, g: 255, b: 0 }; // Volt Yellow
      this.isAccent = true;
    } else if (colorRand < 0.12) {
      this.color = { r: 255, g: 0, b: 60 }; // Crimson
      this.isAccent = true;
    } else {
      const brightness = 180 + Math.random() * 62;
      this.color = { r: brightness, g: brightness, b: brightness };
      this.isAccent = false;
    }
  }
  
  update(time, mouseX, mouseY, mouseActive) {
    // Pulse effect
    const pulse = Math.sin(time * this.pulseSpeed + this.pulseOffset);
    this.opacity = this.baseOpacity + pulse * 0.15;
    
    // Mouse interaction with layer-based parallax
    if (mouseActive) {
      const dx = mouseX - this.x;
      const dy = mouseY - this.y;
      const dist = Math.sqrt(dx * dx + dy * dy);
      const maxDist = 250 - this.layer * 50;
      
      if (dist < maxDist) {
        const force = (1 - dist / maxDist) * (0.02 + this.layer * 0.015);
        this.speedX = lerp(this.speedX, this.baseSpeedX + dx * force, 0.05);
        this.speedY = lerp(this.speedY, this.baseSpeedY + dy * force, 0.05);
        
        // Brighten particles near mouse
        if (this.isAccent) {
          this.opacity = Math.min(1, this.baseOpacity + (1 - dist / maxDist) * 0.4);
        }
      }
    }
    
    // Apply velocity with damping
    this.speedX = lerp(this.speedX, this.baseSpeedX, 0.02);
    this.speedY = lerp(this.speedY, this.baseSpeedY, 0.02);
    
    this.x += this.speedX;
    this.y += this.speedY;
    
    // Wrap around edges
    if (this.x < -10) this.x = this.canvas.width + 10;
    if (this.x > this.canvas.width + 10) this.x = -10;
    if (this.y < -10) this.y = this.canvas.height + 10;
    if (this.y > this.canvas.height + 10) this.y = -10;
  }
  
  draw(ctx) {
    const { r, g, b } = this.color;
    
    // Draw glow for accent particles
    if (this.isAccent && this.size > 1) {
      const gradient = ctx.createRadialGradient(this.x, this.y, 0, this.x, this.y, this.size * 4);
      gradient.addColorStop(0, `rgba(${r}, ${g}, ${b}, ${this.opacity * 0.3})`);
      gradient.addColorStop(1, `rgba(${r}, ${g}, ${b}, 0)`);
      ctx.fillStyle = gradient;
      ctx.beginPath();
      ctx.arc(this.x, this.y, this.size * 4, 0, Math.PI * 2);
      ctx.fill();
    }
    
    // Draw particle
    ctx.beginPath();
    ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
    ctx.fillStyle = `rgba(${r}, ${g}, ${b}, ${this.opacity})`;
    ctx.fill();
  }
}

// Floating shape class with smooth physics
class FloatingShape {
  constructor(canvas, index) {
    this.canvas = canvas;
    this.index = index;
    this.reset();
  }
  
  reset() {
    this.baseX = Math.random() * this.canvas.width;
    this.baseY = Math.random() * this.canvas.height;
    this.x = this.baseX;
    this.y = this.baseY;
    this.targetX = this.baseX;
    this.targetY = this.baseY;
    this.size = 20 + Math.random() * 30;
    this.rotation = Math.random() * Math.PI * 2;
    this.rotationSpeed = (Math.random() - 0.5) * 0.02;
    this.floatSpeed = 0.3 + Math.random() * 0.4;
    this.floatOffset = Math.random() * Math.PI * 2;
    this.floatAmplitude = 15 + Math.random() * 20;
    this.sides = Math.floor(Math.random() * 3) + 3; // 3-5 sides
    this.opacity = 0.15 + Math.random() * 0.15;
    this.baseOpacity = this.opacity;
    
    // Color
    const colorChoice = Math.random();
    if (colorChoice < 0.4) {
      this.color = '#E0FF00';
      this.glowColor = 'rgba(224, 255, 0, 0.3)';
    } else if (colorChoice < 0.6) {
      this.color = '#FF003C';
      this.glowColor = 'rgba(255, 0, 60, 0.2)';
    } else {
      this.color = '#F2F2F2';
      this.glowColor = 'rgba(242, 242, 242, 0.1)';
    }
  }
  
  update(time, mouseX, mouseY, scrollProgress) {
    // Floating motion
    const floatY = Math.sin(time * this.floatSpeed + this.floatOffset) * this.floatAmplitude;
    const floatX = Math.cos(time * this.floatSpeed * 0.7 + this.floatOffset) * this.floatAmplitude * 0.5;
    
    this.targetX = this.baseX + floatX;
    this.targetY = this.baseY + floatY;
    
    // Mouse parallax
    const parallaxStrength = 0.03;
    const centerX = this.canvas.width / 2;
    const centerY = this.canvas.height / 2;
    this.targetX += (mouseX - centerX) * parallaxStrength * (1 + this.index * 0.1);
    this.targetY += (mouseY - centerY) * parallaxStrength * (1 + this.index * 0.1);
    
    // Smooth position interpolation
    this.x = lerp(this.x, this.targetX, 0.03);
    this.y = lerp(this.y, this.targetY, 0.03);
    
    // Rotation
    this.rotation += this.rotationSpeed;
    
    // Pulse opacity
    this.opacity = this.baseOpacity + Math.sin(time * 0.5 + this.index) * 0.05;
  }
  
  draw(ctx) {
    ctx.save();
    ctx.translate(this.x, this.y);
    ctx.rotate(this.rotation);
    
    // Draw glow
    ctx.strokeStyle = this.glowColor;
    ctx.lineWidth = 2;
    this.drawPolygon(ctx, this.size * 1.2);
    ctx.stroke();
    
    // Draw shape
    ctx.strokeStyle = this.color;
    ctx.lineWidth = 1;
    ctx.globalAlpha = this.opacity;
    this.drawPolygon(ctx, this.size);
    ctx.stroke();
    
    ctx.restore();
  }
  
  drawPolygon(ctx, size) {
    ctx.beginPath();
    for (let i = 0; i <= this.sides; i++) {
      const angle = (i / this.sides) * Math.PI * 2 - Math.PI / 2;
      const x = Math.cos(angle) * size;
      const y = Math.sin(angle) * size;
      if (i === 0) ctx.moveTo(x, y);
      else ctx.lineTo(x, y);
    }
    ctx.closePath();
  }
}

// Main Scene Component
export const Scene = ({ currentSection, mousePosition }) => {
  const canvasRef = useRef(null);
  const animationRef = useRef(null);
  const particlesRef = useRef({ far: [], mid: [], near: [] });
  const shapesRef = useRef([]);
  const mouseRef = useRef({ x: 0, y: 0, targetX: 0, targetY: 0, active: false });
  const timeRef = useRef(0);
  const lastTimeRef = useRef(0);
  const fpsRef = useRef(60);
  
  // Initialize
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    
    const resize = () => {
      const dpr = Math.min(window.devicePixelRatio, 2);
      canvas.width = window.innerWidth * dpr;
      canvas.height = window.innerHeight * dpr;
      canvas.style.width = `${window.innerWidth}px`;
      canvas.style.height = `${window.innerHeight}px`;
      
      const ctx = canvas.getContext('2d');
      ctx.scale(dpr, dpr);
      
      // Reinitialize particles with layers
      particlesRef.current = {
        far: Array.from({ length: 80 }, () => new Particle(canvas, 0)),
        mid: Array.from({ length: 60 }, () => new Particle(canvas, 1)),
        near: Array.from({ length: 40 }, () => new Particle(canvas, 2)),
      };
      
      // Reinitialize shapes
      shapesRef.current = Array.from({ length: 8 }, (_, i) => new FloatingShape(canvas, i));
    };
    
    resize();
    window.addEventListener('resize', resize);
    
    return () => window.removeEventListener('resize', resize);
  }, []);
  
  // Update mouse position with smoothing
  useEffect(() => {
    if (mousePosition) {
      const canvas = canvasRef.current;
      if (canvas) {
        mouseRef.current.targetX = mousePosition.x * canvas.width / (window.devicePixelRatio || 1);
        mouseRef.current.targetY = mousePosition.y * canvas.height / (window.devicePixelRatio || 1);
        mouseRef.current.active = true;
      }
    }
  }, [mousePosition]);
  
  // Animation loop
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    
    const ctx = canvas.getContext('2d');
    const width = window.innerWidth;
    const height = window.innerHeight;
    
    const animate = (timestamp) => {
      // Calculate delta time for consistent animation speed
      const deltaTime = timestamp - lastTimeRef.current;
      lastTimeRef.current = timestamp;
      fpsRef.current = lerp(fpsRef.current, 1000 / deltaTime, 0.1);
      
      timeRef.current = timestamp * 0.001;
      const time = timeRef.current;
      
      // Smooth mouse interpolation
      mouseRef.current.x = lerp(mouseRef.current.x, mouseRef.current.targetX, 0.08);
      mouseRef.current.y = lerp(mouseRef.current.y, mouseRef.current.targetY, 0.08);
      const { x: mouseX, y: mouseY, active: mouseActive } = mouseRef.current;
      
      // Clear with motion blur effect
      ctx.fillStyle = 'rgba(3, 3, 3, 0.15)';
      ctx.fillRect(0, 0, width, height);
      
      // Draw grid with perspective effect
      drawGrid(ctx, width, height, time, mouseX, mouseY);
      
      // Draw particles by layer (far to near for depth)
      Object.values(particlesRef.current).forEach((layer) => {
        layer.forEach(particle => {
          particle.update(time, mouseX, mouseY, mouseActive);
          particle.draw(ctx);
        });
      });
      
      // Draw floating shapes
      shapesRef.current.forEach(shape => {
        shape.update(time, mouseX, mouseY, currentSection / 4);
        shape.draw(ctx);
      });
      
      // Draw mouse glow
      if (mouseActive) {
        drawMouseGlow(ctx, mouseX, mouseY, time);
      }
      
      // Draw scan lines for cinematic effect
      drawScanLines(ctx, width, height, time);
      
      animationRef.current = requestAnimationFrame(animate);
    };
    
    animationRef.current = requestAnimationFrame(animate);
    
    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
    };
  }, [currentSection]);
  
  // Grid drawing with perspective
  const drawGrid = (ctx, width, height, time, mouseX, mouseY) => {
    const gridSize = 60;
    const parallaxX = (mouseX - width / 2) * 0.02;
    const parallaxY = (mouseY - height / 2) * 0.02;
    
    ctx.strokeStyle = 'rgba(224, 255, 0, 0.025)';
    ctx.lineWidth = 1;
    
    // Vertical lines
    for (let x = -gridSize; x < width + gridSize; x += gridSize) {
      const offsetX = x + parallaxX + Math.sin(time * 0.5 + x * 0.01) * 2;
      ctx.beginPath();
      ctx.moveTo(offsetX, 0);
      ctx.lineTo(offsetX, height);
      ctx.stroke();
    }
    
    // Horizontal lines with wave effect
    for (let y = -gridSize; y < height + gridSize; y += gridSize) {
      const offsetY = y + parallaxY;
      ctx.beginPath();
      ctx.moveTo(0, offsetY);
      for (let x = 0; x <= width; x += 20) {
        const wave = Math.sin(time * 0.3 + x * 0.005) * 1;
        ctx.lineTo(x, offsetY + wave);
      }
      ctx.stroke();
    }
  };
  
  // Mouse glow effect
  const drawMouseGlow = (ctx, x, y, time) => {
    const pulse = Math.sin(time * 2) * 0.2 + 0.8;
    
    // Outer glow
    const gradient = ctx.createRadialGradient(x, y, 0, x, y, 180 * pulse);
    gradient.addColorStop(0, 'rgba(224, 255, 0, 0.08)');
    gradient.addColorStop(0.5, 'rgba(224, 255, 0, 0.02)');
    gradient.addColorStop(1, 'rgba(224, 255, 0, 0)');
    ctx.fillStyle = gradient;
    ctx.beginPath();
    ctx.arc(x, y, 180 * pulse, 0, Math.PI * 2);
    ctx.fill();
    
    // Inner bright spot
    const innerGradient = ctx.createRadialGradient(x, y, 0, x, y, 30);
    innerGradient.addColorStop(0, 'rgba(224, 255, 0, 0.15)');
    innerGradient.addColorStop(1, 'rgba(224, 255, 0, 0)');
    ctx.fillStyle = innerGradient;
    ctx.beginPath();
    ctx.arc(x, y, 30, 0, Math.PI * 2);
    ctx.fill();
  };
  
  // Scan lines for cinematic effect
  const drawScanLines = (ctx, width, height, time) => {
    ctx.fillStyle = 'rgba(0, 0, 0, 0.03)';
    for (let y = 0; y < height; y += 4) {
      ctx.fillRect(0, y, width, 1);
    }
  };
  
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
          background: 'radial-gradient(ellipse at center, transparent 0%, transparent 40%, rgba(3,3,3,0.6) 100%)',
          pointerEvents: 'none'
        }}
      />
      
      {/* Film grain overlay */}
      <div
        style={{
          position: 'absolute',
          inset: 0,
          opacity: 0.025,
          backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.8' numOctaves='4'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E")`,
          pointerEvents: 'none',
          mixBlendMode: 'overlay'
        }}
      />
    </div>
  );
};

export default Scene;
