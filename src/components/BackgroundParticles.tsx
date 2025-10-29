import React, { useRef, useEffect, useMemo } from 'react';
import { useTheme } from '@mui/material';
import { usePortfolioData } from '../contexts/DataContext';

interface Particle {
  x: number;
  y: number;
  size: number;
  speedX: number;
  speedY: number;
}

const BackgroundParticles: React.FC = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const particlesRef = useRef<Particle[]>([]);
  const animationRef = useRef<number | null>(null);
  const lastUpdateTimeRef = useRef<number>(0);
  const theme = useTheme();
  const { data } = usePortfolioData();
  const { particleSettings } = data.interactiveFeatures;
  
  // Get particle color based on theme
  const particleColor = useMemo(() => 
    theme.palette.mode === 'dark' 
      ? particleSettings.darkModeParticleColor 
      : particleSettings.particleColor,
    [theme.palette.mode, particleSettings]
  );

  // Calculate responsive particle count
  const getResponsiveParticleCount = () => {
    if (!particleSettings.responsive) return particleSettings.particleCount;
    
    const width = window.innerWidth;
    
    // Sort breakpoints in descending order
    const sortedBreakpoints = [...particleSettings.responsive]
      .sort((a, b) => b.breakpoint - a.breakpoint);
    
    // Find the first breakpoint that applies
    const matchedBreakpoint = sortedBreakpoints
      .find(bp => width <= bp.breakpoint);
    
    return matchedBreakpoint 
      ? matchedBreakpoint.options.particleCount 
      : particleSettings.particleCount;
  };
  
  // Initialize particles on component mount
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    
    // Set canvas size to match window size
    const handleResize = () => {
      const dpr = window.devicePixelRatio || 1;
      const rect = canvas.getBoundingClientRect();
      
      // Set display size (css pixels)
      canvas.width = rect.width * dpr;
      canvas.height = rect.height * dpr;
      
      // Get correct particle count based on screen size
      createParticles();
    };
    
    // Create particles
    const createParticles = () => {
      const particleCount = getResponsiveParticleCount();
      
      particlesRef.current = [];
      
      for (let i = 0; i < particleCount; i++) {
        particlesRef.current.push({
          x: Math.random() * canvas.width,
          y: Math.random() * canvas.height,
          size: Math.random() * 3 + 1,
          speedX: (Math.random() - 0.5) * particleSettings.speed,
          speedY: (Math.random() - 0.5) * particleSettings.speed
        });
      }
    };
    
    // Animation loop with frame throttling
    const animate = (timestamp: number) => {
      // Throttle updates to 30 fps for better performance
      if (timestamp - lastUpdateTimeRef.current < 33) {
        animationRef.current = requestAnimationFrame(animate);
        return;
      }
      
      lastUpdateTimeRef.current = timestamp;
      
      const ctx = canvas.getContext('2d');
      if (!ctx) return;
      
      // Clear canvas
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      
      // Update and draw particles
      particlesRef.current.forEach((particle, index) => {
        // Update position
        particle.x += particle.speedX;
        particle.y += particle.speedY;
        
        // Bounce off edges
        if (particle.x < 0 || particle.x > canvas.width) {
          particle.speedX *= -1;
        }
        
        if (particle.y < 0 || particle.y > canvas.height) {
          particle.speedY *= -1;
        }
        
        // Draw particle
        ctx.beginPath();
        ctx.arc(particle.x, particle.y, particle.size, 0, Math.PI * 2);
        ctx.fillStyle = particleColor;
        ctx.fill();
        
        // Draw connections if enabled
        if (particleSettings.connectParticles) {
          // Skip half the particles for connection checks to improve performance
          for (let j = index + 1; j < particlesRef.current.length; j++) {
            const otherParticle = particlesRef.current[j];
            
            const dx = particle.x - otherParticle.x;
            const dy = particle.y - otherParticle.y;
            const distance = Math.hypot(dx, dy);
            
            if (distance < 150) {
              ctx.beginPath();
              ctx.strokeStyle = particleColor;
              ctx.globalAlpha = 1 - (distance / 150);
              ctx.lineWidth = 0.5;
              ctx.moveTo(particle.x, particle.y);
              ctx.lineTo(otherParticle.x, otherParticle.y);
              ctx.stroke();
              ctx.globalAlpha = 1;
            }
          }
        }
      });
      
      // Request next frame
      animationRef.current = requestAnimationFrame(animate);
    };
    
    // Set up and start animation
    handleResize();
    window.addEventListener('resize', handleResize);
    animationRef.current = requestAnimationFrame(animate);
    
    // Clean up
    return () => {
      window.removeEventListener('resize', handleResize);
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [particleColor, particleSettings]);
  
  return (
    <canvas
      ref={canvasRef}
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        width: '100%',
        height: '100%',
        pointerEvents: 'none',
        zIndex: -1
      }}
      aria-hidden="true"
    />
  );
};

export default React.memo(BackgroundParticles); 