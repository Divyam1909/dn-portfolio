import React, { useEffect, useRef } from 'react';

interface CometCursorProps {
  enabled?: boolean;
}

interface Particle {
  x: number;
  y: number;
  vx: number;
  vy: number;
  life: number;
  maxLife: number;
  size: number;
}

interface Position {
  x: number;
  y: number;
}

const CometCursor: React.FC<CometCursorProps> = ({ enabled = true }) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const animationFrameRef = useRef<number | undefined>(undefined);
  const posRef = useRef<Position>({ x: 0, y: 0 });
  const lastPosRef = useRef<Position>({ x: 0, y: 0 });
  const mouseRef = useRef<Position>({ x: 0, y: 0 });
  const lastMouseRef = useRef<Position>({ x: 0, y: 0 });
  const particlesRef = useRef<Particle[]>([]);
  const isHoveringRef = useRef<boolean>(false);
  const hoveredElementRef = useRef<HTMLElement | null>(null);
  const cursorOpacityRef = useRef<number>(1);
  const outlineOpacityRef = useRef<number>(0);
  const borderProgressRef = useRef<number>(0);
  const borderCompletedRef = useRef<boolean>(false);
  const borderPositionRef = useRef<Position>({ x: 0, y: 0 });

  // Configuration - using colors from cursor.html
  const params = {
    coreSize: 4,
    glowSize: 25,
    trailLength: 20,
    colorCore: '255, 255, 255', // Pure White center
    colorComa: '0, 200, 255',    // Cyan/Electric Blue glow
    colorTail: '160, 50, 255'    // Vibrant Purple tail
  };

  useEffect(() => {
    if (!enabled || !canvasRef.current) {
      // Clean up when disabled
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
        animationFrameRef.current = undefined;
      }
      particlesRef.current = [];
      return;
    }

    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Initialize positions
    const initPos = {
      x: window.innerWidth / 2,
      y: window.innerHeight / 2
    };
    posRef.current = { ...initPos };
    lastPosRef.current = { ...initPos };
    mouseRef.current = { ...initPos };
    lastMouseRef.current = { ...initPos };

    const resize = () => {
      if (canvas) {
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;
      }
    };

    resize();
    window.addEventListener('resize', resize);

    const handleMouseMove = (e: MouseEvent) => {
      mouseRef.current.x = e.clientX;
      mouseRef.current.y = e.clientY;
      
      // Check if hovering over specific clickable elements only
      const target = e.target as HTMLElement;
      
      // Check for elements with data-comet-clickable attribute
      let clickableElement = target.closest('[data-comet-clickable]') as HTMLElement;
      
      // If not found, check if we're over a planet label by checking all elements at mouse position
      if (!clickableElement) {
        const elementsAtPoint = document.elementsFromPoint(e.clientX, e.clientY);
        for (const el of elementsAtPoint) {
          if (el instanceof HTMLElement && el.hasAttribute('data-comet-clickable')) {
            clickableElement = el;
            break;
          }
        }
      }
      
      const isClickable = clickableElement !== null;
      
      if (isClickable !== isHoveringRef.current) {
        // Reset border animation when starting to hover
        if (isClickable) {
          borderProgressRef.current = 0;
          borderCompletedRef.current = false;
          // Clear existing particles when starting new hover
          particlesRef.current = [];
        }
      }
      
      isHoveringRef.current = isClickable;
      hoveredElementRef.current = clickableElement;
    };

    const handleTouchMove = (e: TouchEvent) => {
      if (e.touches.length > 0) {
        mouseRef.current.x = e.touches[0].clientX;
        mouseRef.current.y = e.touches[0].clientY;
      }
    };
    
      // Also check on mouseover for better hover detection
    const handleMouseOver = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      
      // Check for elements with data-comet-clickable attribute
      let clickableElement = target.closest('[data-comet-clickable]') as HTMLElement;
      
      // If not found, check if we're over a planet label by checking all elements at mouse position
      if (!clickableElement) {
        const elementsAtPoint = document.elementsFromPoint(e.clientX, e.clientY);
        for (const el of elementsAtPoint) {
          if (el instanceof HTMLElement && el.hasAttribute('data-comet-clickable')) {
            clickableElement = el;
            break;
          }
        }
      }
      
      const isClickable = clickableElement !== null;
      
      if (isClickable !== isHoveringRef.current) {
        // Reset border animation when starting to hover
        if (isClickable) {
          borderProgressRef.current = 0;
          borderCompletedRef.current = false;
          // Clear existing particles when starting new hover
          particlesRef.current = [];
        }
        
        isHoveringRef.current = isClickable;
        hoveredElementRef.current = clickableElement;
        
        // Add glow effect to the element
        if (hoveredElementRef.current && isClickable) {
          hoveredElementRef.current.style.transition = 'box-shadow 0.3s ease';
          hoveredElementRef.current.style.boxShadow = '0 0 20px rgba(0, 200, 255, 0.6), 0 0 40px rgba(160, 50, 255, 0.4)';
        }
      }
    };
    
    const handleMouseOut = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      const clickableElement = target.closest('button, a, [role="button"], [onclick]') as HTMLElement;
      
      // Only remove hover if we're actually leaving the clickable element
      if (clickableElement === hoveredElementRef.current || (!clickableElement && isHoveringRef.current)) {
        // Remove glow effect
        if (hoveredElementRef.current) {
          hoveredElementRef.current.style.boxShadow = '';
          hoveredElementRef.current = null;
        }
        isHoveringRef.current = false;
      }
    };

    // Linear interpolation for smooth movement
    const lerp = (start: number, end: number, amt: number): number => {
      return (1 - amt) * start + amt * end;
    };

    const createParticle = (x: number, y: number) => {
      // Longer lifespan when hovering (for border trail)
      const baseLife = isHoveringRef.current ? 1.0 : 0.5;
      const life = Math.random() * 0.3 + baseLife; // Longer when hovering
      // Thinner trail - reduced size range
      const size = Math.random() * 1.5 + 1; // 1 to 2.5 (thinner than original 2-6)

      particlesRef.current.push({
        x: x,
        y: y,
        // STATIONARY TRAIL: No directional velocity
        // Just a tiny bit of random expansion to look like cooling gas
        vx: (Math.random() - 0.5) * 0.2,
        vy: (Math.random() - 0.5) * 0.2,
        life: life,
        maxLife: life,
        size: size
      });
    };

    const updateParticles = () => {
      for (let i = 0; i < particlesRef.current.length; i++) {
        const p = particlesRef.current[i];

        // Move particle (just the tiny expansion)
        p.x += p.vx;
        p.y += p.vy;

        // Slower fade when hovering (border animation) to keep trail visible
        const fadeSpeed = isHoveringRef.current ? 0.005 : 0.015;
        p.life -= fadeSpeed;

        // Remove dead particles
        if (p.life <= 0) {
          particlesRef.current.splice(i, 1);
          i--;
        }
      }
    };

    const drawParticles = () => {
      // Always draw particles - use outline opacity when hovering, cursor opacity when not
      const baseOpacity = isHoveringRef.current ? outlineOpacityRef.current : cursorOpacityRef.current;
      if (baseOpacity <= 0 && particlesRef.current.length === 0) return;
      
      // Use lighter blend mode for intense brightness
      ctx.globalCompositeOperation = 'lighter';

      for (const p of particlesRef.current) {
        // Use base opacity for particles - ensure full visibility during border animation
        const particleLifeRatio = p.life / p.maxLife;
        // When hovering (border animation), use full opacity, otherwise fade with cursor
        const opacity = isHoveringRef.current 
          ? particleLifeRatio * 1.0  // Full visibility during border
          : particleLifeRatio * baseOpacity; // Fade with cursor when not hovering

        ctx.beginPath();
        // Shrink particle as it dies to simulate burning out
        const currentSize = p.size * particleLifeRatio;
        ctx.arc(p.x, p.y, currentSize, 0, Math.PI * 2);

        // Color blending:
        // High life = Blue/Cyan (Hot)
        // Low life = Purple (Cooling)
        let color = params.colorTail;
        if (particleLifeRatio > 0.5) {
          color = params.colorComa;
        }

        ctx.fillStyle = `rgba(${color}, ${opacity})`;
        ctx.fill();
      }

      // Reset composite operation
      ctx.globalCompositeOperation = 'source-over';
    };

    const getPointOnBorder = (rect: DOMRect, padding: number, radius: number, progress: number): Position => {
      const left = rect.left - padding;
      const top = rect.top - padding;
      const right = rect.right + padding;
      const bottom = rect.bottom + padding;
      const width = right - left;
      const height = bottom - top;
      
      // Calculate perimeter segments
      const topEdge = width - 2 * radius;
      const rightEdge = height - 2 * radius;
      const bottomEdge = width - 2 * radius;
      const leftEdge = height - 2 * radius;
      const topRightCorner = Math.PI * radius / 2;
      const bottomRightCorner = Math.PI * radius / 2;
      const bottomLeftCorner = Math.PI * radius / 2;
      const topLeftCorner = Math.PI * radius / 2;
      
      const perimeter = topEdge + rightEdge + bottomEdge + leftEdge + 
                        topRightCorner + bottomRightCorner + bottomLeftCorner + topLeftCorner;
      
      let currentLength = progress * perimeter;
      
      // Top edge
      if (currentLength <= topEdge) {
        return { x: left + radius + currentLength, y: top };
      }
      currentLength -= topEdge;
      
      // Top-right corner
      if (currentLength <= topRightCorner) {
        const angle = -Math.PI / 2 + (currentLength / radius);
        return { x: right - radius + radius * Math.cos(angle), y: top + radius + radius * Math.sin(angle) };
      }
      currentLength -= topRightCorner;
      
      // Right edge
      if (currentLength <= rightEdge) {
        return { x: right, y: top + radius + currentLength };
      }
      currentLength -= rightEdge;
      
      // Bottom-right corner
      if (currentLength <= bottomRightCorner) {
        const angle = (currentLength / radius);
        return { x: right - radius + radius * Math.cos(angle), y: bottom - radius + radius * Math.sin(angle) };
      }
      currentLength -= bottomRightCorner;
      
      // Bottom edge
      if (currentLength <= bottomEdge) {
        return { x: right - radius - currentLength, y: bottom };
      }
      currentLength -= bottomEdge;
      
      // Bottom-left corner
      if (currentLength <= bottomLeftCorner) {
        const angle = Math.PI / 2 + (currentLength / radius);
        return { x: left + radius + radius * Math.cos(angle), y: bottom - radius + radius * Math.sin(angle) };
      }
      currentLength -= bottomLeftCorner;
      
      // Left edge
      if (currentLength <= leftEdge) {
        return { x: left, y: bottom - radius - currentLength };
      }
      currentLength -= leftEdge;
      
      // Top-left corner
      const angle = Math.PI + (currentLength / radius);
      return { x: left + radius + radius * Math.cos(angle), y: top + radius + radius * Math.sin(angle) };
    };

    const drawElementOutline = (element: HTMLElement) => {
      const rect = element.getBoundingClientRect();
      const padding = 4;
      
      // Check if element is visible
      if (rect.width === 0 || rect.height === 0) return;
      
      const opacity = outlineOpacityRef.current;
      if (opacity <= 0) return;
      
      // Animate border progress (0 to 1, stops after one complete round)
      if (!borderCompletedRef.current) {
        borderProgressRef.current += 0.008; // Speed of animation
        if (borderProgressRef.current >= 1) {
          borderProgressRef.current = 1;
          borderCompletedRef.current = true;
        }
      }
      
      // Get current position on border
      const radius = 8;
      const borderPos = getPointOnBorder(rect, padding, radius, borderProgressRef.current);
      borderPositionRef.current = borderPos;
      
      // Update comet head position to follow border
      posRef.current.x = borderPos.x;
      posRef.current.y = borderPos.y;
      
      // Spawn particles along the border path - more particles for visible trail
      if (!borderCompletedRef.current) {
        const steps = 8; // More particles for visible trail
        for (let i = 0; i < steps; i++) {
          const t = Math.max(0, borderProgressRef.current - i * 0.015);
          if (t > 0) {
            const particlePos = getPointOnBorder(rect, padding, radius, t);
            createParticle(particlePos.x, particlePos.y);
          }
        }
      } else {
        // Keep spawning particles even after completion to maintain trail
        const steps = 5;
        for (let i = 0; i < steps; i++) {
          const t = Math.max(0, 1 - i * 0.02);
          if (t > 0) {
            const particlePos = getPointOnBorder(rect, padding, radius, t);
            createParticle(particlePos.x, particlePos.y);
          }
        }
      }
    };

    const drawCometHead = (x: number, y: number, isHovering: boolean) => {
      // Use outline opacity when hovering, cursor opacity when not
      const opacity = isHovering ? outlineOpacityRef.current : cursorOpacityRef.current;
      if (opacity <= 0) return;
      
      const currentGlowSize = params.glowSize;
      const currentCoreSize = params.coreSize;
      
      // 1. Outer Glow (Coma) - fade with opacity
      const glow = ctx.createRadialGradient(
        x, y, currentCoreSize,
        x, y, currentGlowSize
      );
      glow.addColorStop(0, `rgba(${params.colorComa}, ${opacity})`);
      glow.addColorStop(0.3, `rgba(${params.colorTail}, ${0.4 * opacity})`);
      glow.addColorStop(1, `rgba(${params.colorTail}, 0)`);

      ctx.fillStyle = glow;
      ctx.beginPath();
      ctx.arc(x, y, currentGlowSize, 0, Math.PI * 2);
      ctx.fill();

      // 2. Bright Core (The "Spark") - fade with opacity
      ctx.fillStyle = `rgba(${params.colorCore}, ${opacity})`;
      ctx.shadowBlur = 15 * opacity;
      ctx.shadowColor = `rgba(${params.colorComa}, ${opacity})`;
      ctx.beginPath();
      ctx.arc(x, y, currentCoreSize, 0, Math.PI * 2);
      ctx.fill();

      // Add a second tiny intense core for the "hot" look
      ctx.fillStyle = `rgba(${params.colorCore}, ${opacity})`;
      ctx.shadowBlur = 5 * opacity;
      ctx.beginPath();
      ctx.arc(x, y, currentCoreSize * 0.5, 0, Math.PI * 2);
      ctx.fill();

      // Reset shadow
      ctx.shadowBlur = 0;
    };

    const animate = () => {
      if (!enabled || !ctx) return;

      // Clear canvas
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      // Smooth opacity transition between cursor and outline modes
      const targetCursorOpacity = isHoveringRef.current ? 0 : 1;
      const targetOutlineOpacity = isHoveringRef.current ? 1 : 0;
      
      // Smooth fade transition (lerp for opacity)
      cursorOpacityRef.current = lerp(cursorOpacityRef.current, targetCursorOpacity, 0.15);
      outlineOpacityRef.current = lerp(outlineOpacityRef.current, targetOutlineOpacity, 0.15);

      // Only follow mouse if not hovering (when hovering, comet follows border)
      if (!isHoveringRef.current) {
        // Smooth movement using Linear Interpolation (Lerp)
        // Higher lerp value (0.4) for more responsive, real cursor-like feel
        const lerpAmount = 0.4;
        posRef.current.x = lerp(posRef.current.x, mouseRef.current.x, lerpAmount);
        posRef.current.y = lerp(posRef.current.y, mouseRef.current.y, lerpAmount);
      }

      // Calculate distance the comet head moved (not mouse)
      const vx = posRef.current.x - lastPosRef.current.x;
      const vy = posRef.current.y - lastPosRef.current.y;
      const distance = Math.hypot(vx, vy);

      // Only spawn particles when cursor is visible and not hovering (when hovering, particles spawn in drawElementOutline)
      if (cursorOpacityRef.current > 0.1 && !isHoveringRef.current) {
        // Increased density for a solid continuous line
        const steps = Math.ceil(distance * 1.5);

        if (distance > 0.1) {
          for (let i = 0; i < steps; i++) {
            const t = i / steps;
            // Interpolate position along the comet head's path (not mouse path)
            const spawnX = lerp(lastPosRef.current.x, posRef.current.x, t);
            const spawnY = lerp(lastPosRef.current.y, posRef.current.y, t);

            // Spawn particle at that exact spot - attached to comet head path
            const jitter = 2;
            createParticle(
              spawnX + (Math.random() - 0.5) * jitter,
              spawnY + (Math.random() - 0.5) * jitter
            );
          }
        } else {
          // Idle "burn" effect - spawn at comet head position
          for (let i = 0; i < 2; i++) {
            createParticle(
              posRef.current.x + (Math.random() - 0.5) * 2,
              posRef.current.y + (Math.random() - 0.5) * 2
            );
          }
        }
      }

      // Draw element outline first to update border position
      // Draw outline when hovering or during transition
      if ((isHoveringRef.current || outlineOpacityRef.current > 0.01) && hoveredElementRef.current) {
        drawElementOutline(hoveredElementRef.current);
      }
      
      updateParticles();
      drawParticles();
      // Draw comet head - it will follow border when hovering, mouse when not
      drawCometHead(posRef.current.x, posRef.current.y, isHoveringRef.current);

      // Update last positions for next frame
      lastPosRef.current.x = posRef.current.x;
      lastPosRef.current.y = posRef.current.y;
      lastMouseRef.current.x = mouseRef.current.x;
      lastMouseRef.current.y = mouseRef.current.y;

      animationFrameRef.current = requestAnimationFrame(animate);
    };

    window.addEventListener('mousemove', handleMouseMove, { passive: true });
    window.addEventListener('touchmove', handleTouchMove, { passive: true });
    document.addEventListener('mouseover', handleMouseOver, { passive: true });
    document.addEventListener('mouseout', handleMouseOut, { passive: true });

    // Start animation loop
    animationFrameRef.current = requestAnimationFrame(animate);

    return () => {
      window.removeEventListener('resize', resize);
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('touchmove', handleTouchMove);
      document.removeEventListener('mouseover', handleMouseOver);
      document.removeEventListener('mouseout', handleMouseOut);
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
        animationFrameRef.current = undefined;
      }
      particlesRef.current = [];
    };
  }, [enabled]);

  if (!enabled) return null;

  return (
    <>
      <canvas
        ref={canvasRef}
        style={{
          position: 'fixed',
          top: 0,
          left: 0,
          width: '100%',
          height: '100%',
          zIndex: 9999,
          pointerEvents: 'none',
        }}
      />
      {/* CSS to hide default cursor only when enabled */}
      <style>{`
        * {
          cursor: none !important;
        }
      `}</style>
    </>
  );
};

export default CometCursor;
