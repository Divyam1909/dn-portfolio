import React, { useState, useEffect } from 'react';
import { Box, Typography, IconButton, Fade } from '@mui/material';
import { Refresh as RefreshIcon } from '@mui/icons-material';
import { motion } from 'framer-motion';

// Import quotes from local JSON
import quotesData from '../data/quotes.json';

interface UniverseQuoteProps {
  category?: string;
  variant?: 'default' | 'universe';
  cameraDistance?: number;
}

const UniverseQuote: React.FC<UniverseQuoteProps> = ({
  category = 'universe',
  variant = 'universe',
  cameraDistance = 45
}) => {
  const [quote, setQuote] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [key, setKey] = useState(0);

  // Hardcoded fallback quotes - Tech + Space themed
  const fallbackQuotes = [
    {
      text: "Any sufficiently advanced technology is indistinguishable from magic. Our code explores the cosmos, bridging silicon and stardust.",
      author: "Inspired by Arthur C. Clarke"
    },
    {
      text: "We are the architects of tomorrow's universe, writing algorithms that reach beyond the stars, turning cosmic dreams into digital reality.",
      author: "Modern Tech Philosophy"
    },
    {
      text: "In the vast expanse of space and data, we find infinite possibilities. Every line of code is a step toward understanding the universe.",
      author: "Tech & Space Vision"
    },
    {
      text: "From quantum computing to interstellar travel, technology is our spacecraft, and innovation is the fuel that propels humanity forward.",
      author: "Digital Space Age"
    }
  ];

  const loadQuote = () => {
    setLoading(true);
    try {
      // Filter quotes by category if provided, otherwise use all quotes
      const availableQuotes = category
        ? quotesData.filter((q: any) => q.category === category && q.isActive)
        : quotesData.filter((q: any) => q.isActive);

      if (availableQuotes.length > 0) {
        // Select a random quote from available quotes
        const randomQuote = availableQuotes[Math.floor(Math.random() * availableQuotes.length)];
        setQuote(randomQuote);
      } else {
        // Use fallback if no matching quotes found
        const randomFallback = fallbackQuotes[Math.floor(Math.random() * fallbackQuotes.length)];
        setQuote(randomFallback);
      }
    } catch (error) {
      // Use fallback on error
      const randomFallback = fallbackQuotes[Math.floor(Math.random() * fallbackQuotes.length)];
      setQuote(randomFallback);
    }
    setLoading(false);
  };

  useEffect(() => {
    loadQuote();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleRefresh = () => {
    setKey(prev => prev + 1);
    loadQuote();
  };

  if (loading || !quote) {
    return null;
  }

  if (variant === 'universe') {
    // Calculate visibility based on camera distance
    // Show quote when distance > 30, hide when distance < 30
    const isVisible = cameraDistance > 30;
    const shouldScatter = cameraDistance <= 30;

    // Split quote into individual characters for letter-by-letter particle effect
    const text = quote.text;
    const characters = text.split('');

    return (
      <Box sx={{
        position: 'absolute',
        top: '100px',
        left: '50%',
        transform: 'translateX(-50%)',
        width: '100%',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'flex-start',
        px: { xs: 2, sm: 4, md: 6 }
      }}>
        <Box sx={{
          textAlign: 'center',
          maxWidth: '1100px',
          width: '100%',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center'
        }}>
          {/* Animated Quote Text with Letter-by-Letter Particle Effect */}
          <Box sx={{
            display: 'flex',
            flexWrap: 'wrap',
            justifyContent: 'center',
            gap: '0.1rem',
            mb: 1.5,
            lineHeight: 1.8
          }}>
            {characters.map((char: string, index: number) => {
              // Skip spaces for cleaner animation
              if (char === ' ') {
                return <span key={`${key}-${index}`} style={{ width: '0.3em', display: 'inline-block' }} />;
              }

              // Subtle particle-like movement - much gentler
              const randomX = (Math.random() - 0.5) * 40; // Reduced from 300
              const randomY = (Math.random() - 0.5) * 30;  // Reduced from 200
              const randomRotate = (Math.random() - 0.5) * 20; // Reduced from 720
              const randomScale = Math.random() * 0.2 + 0.8; // Less dramatic scaling

              return (
                <motion.span
                  key={`${key}-${index}`}
                  initial={{ opacity: 0 }}
                  animate={
                    isVisible
                      ? {
                        opacity: 1,
                        y: 0,
                        x: 0,
                        scale: 1,
                        rotate: 0
                      }
                      : {
                        opacity: 0,
                        y: randomY,
                        x: randomX,
                        scale: randomScale,
                        rotate: randomRotate
                      }
                  }
                  transition={{
                    duration: 0.6, // Slower, more subtle
                    delay: isVisible
                      ? index * 0.015 + Math.random() * 0.02 // Gentle staggered appearance
                      : index * 0.008, // Gentle staggered disappearance
                    ease: "easeInOut", // Smooth easing
                  }}
                  style={{
                    color: 'rgba(224, 231, 255, 0.95)',
                    fontStyle: 'italic',
                    fontWeight: 300,
                    fontSize: 'clamp(0.95rem, 2vw, 1.3rem)',
                    letterSpacing: '0.5px',
                    textShadow: `
                      0 0 20px rgba(147, 197, 253, 0.4),
                      0 0 40px rgba(147, 197, 253, 0.2),
                      0 2px 4px rgba(0, 0, 0, 0.8)
                    `,
                    display: 'inline-block',
                    willChange: 'transform, opacity',
                  }}
                >
                  {char}
                </motion.span>
              );
            })}
          </Box>

          {/* Author with Letter-by-Letter Particle Effect */}
          {quote.author && (
            <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '0.1rem' }}>
              {('— ' + quote.author).split('').map((char: string, index: number) => {
                if (char === ' ') {
                  return <span key={`author-${key}-${index}`} style={{ width: '0.3em', display: 'inline-block' }} />;
                }

                // Subtle particle-like movement - much gentler
                const randomX = (Math.random() - 0.5) * 30;
                const randomY = (Math.random() - 0.5) * 25;
                const randomRotate = (Math.random() - 0.5) * 15;
                const randomScale = Math.random() * 0.15 + 0.85;

                return (
                  <motion.span
                    key={`author-${key}-${index}`}
                    initial={{ opacity: 0 }}
                    animate={
                      isVisible
                        ? {
                          opacity: 0.85,
                          y: 0,
                          x: 0,
                          scale: 1,
                          rotate: 0
                        }
                        : {
                          opacity: 0,
                          y: randomY,
                          x: randomX,
                          scale: randomScale,
                          rotate: randomRotate
                        }
                    }
                    transition={{
                      duration: 0.5,
                      delay: isVisible
                        ? index * 0.02 + Math.random() * 0.015
                        : index * 0.006,
                      ease: "easeInOut",
                    }}
                    style={{
                      color: 'rgba(147, 197, 253, 0.85)',
                      fontWeight: 400,
                      fontSize: 'clamp(0.85rem, 1.5vw, 1rem)',
                      textAlign: 'center',
                      textShadow: `
                        0 0 15px rgba(147, 197, 253, 0.5),
                        0 2px 4px rgba(0, 0, 0, 0.6)
                      `,
                      letterSpacing: '1px',
                      display: 'inline-block',
                      willChange: 'transform, opacity',
                    }}
                  >
                    {char}
                  </motion.span>
                );
              })}
            </Box>
          )}
        </Box>
      </Box>
    );
  }

  // Default variant for homepage
  return (
    <Fade in={true} timeout={1000}>
      <motion.div
        key={key}
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
      >
        <Box
          sx={{
            p: 3,
            borderLeft: '4px solid',
            borderImage: 'linear-gradient(to bottom, #667eea, #764ba2) 1',
            background: 'rgba(255, 255, 255, 0.02)',
            borderRadius: '0 8px 8px 0',
          }}
        >
          <Typography
            variant="body1"
            sx={{
              fontStyle: 'italic',
              color: 'text.secondary',
              mb: 1,
              lineHeight: 1.7
            }}
          >
            "{quote.text}"
          </Typography>
          {quote.author && (
            <Typography
              variant="body2"
              sx={{
                color: 'primary.main',
                textAlign: 'right',
                fontWeight: 600
              }}
            >
              — {quote.author}
            </Typography>
          )}
          <IconButton
            size="small"
            onClick={handleRefresh}
            sx={{
              ml: 'auto',
              display: 'block',
              mt: 1,
              '&:hover': {
                transform: 'rotate(180deg)',
                transition: 'transform 0.4s ease'
              }
            }}
          >
            <RefreshIcon fontSize="small" />
          </IconButton>
        </Box>
      </motion.div>
    </Fade>
  );
};

export default UniverseQuote;
