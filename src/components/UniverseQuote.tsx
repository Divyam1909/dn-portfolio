import React, { useState, useEffect } from 'react';
import { Box, Typography, Paper, IconButton, Fade } from '@mui/material';
import { Refresh as RefreshIcon } from '@mui/icons-material';
import { motion } from 'framer-motion';
import { portfolioAPI } from '../services/api';

interface UniverseQuoteProps {
  category?: string;
  variant?: 'default' | 'universe';
}

const UniverseQuote: React.FC<UniverseQuoteProps> = ({ 
  category = 'universe', 
  variant = 'universe' 
}) => {
  const [quote, setQuote] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [key, setKey] = useState(0);

  // Hardcoded fallback quotes
  const fallbackQuotes = [
    {
      text: "The cosmos is within us. We are made of star-stuff. We are a way for the universe to know itself.",
      author: "Carl Sagan"
    },
    {
      text: "Two possibilities exist: either we are alone in the Universe or we are not. Both are equally terrifying.",
      author: "Arthur C. Clarke"
    }
  ];

  const loadQuote = async () => {
    setLoading(true);
    try {
      const response = await portfolioAPI.getRandomQuote(category);
      if (response.data.success && response.data.data) {
        setQuote(response.data.data);
      } else {
        // Use fallback if no quote from DB
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
    return (
      <Fade in={true} timeout={1000}>
        <Box sx={{ 
          width: '100%',
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          px: { xs: 2, sm: 4, md: 6 }
        }}>
          <Box sx={{ 
            position: 'relative', 
            textAlign: 'center',
            maxWidth: '900px',
            width: '100%',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center'
          }}>
            {/* Static Quote Text */}
            <Typography
              variant="h5"
              sx={{
                color: 'rgba(224, 231, 255, 0.95)',
                fontStyle: 'italic',
                fontWeight: 300,
                lineHeight: 1.7,
                mb: 1.5,
                textShadow: `
                  0 0 20px rgba(147, 197, 253, 0.4),
                  0 0 40px rgba(147, 197, 253, 0.2),
                  0 2px 4px rgba(0, 0, 0, 0.8)
                `,
                fontSize: { xs: '0.95rem', sm: '1.1rem', md: '1.3rem' },
                letterSpacing: '0.5px',
                maxWidth: '100%',
                wordWrap: 'break-word',
                overflowWrap: 'break-word',
              }}
            >
              "{quote.text}"
            </Typography>
            
            {/* Author */}
            {quote.author && (
              <Typography
                variant="body1"
                sx={{
                  color: 'rgba(147, 197, 253, 0.85)',
                  fontWeight: 400,
                  fontSize: { xs: '0.85rem', sm: '1rem' },
                  textShadow: `
                    0 0 15px rgba(147, 197, 253, 0.5),
                    0 2px 4px rgba(0, 0, 0, 0.6)
                  `,
                  letterSpacing: '1px',
                }}
              >
                — {quote.author}
              </Typography>
            )}
          </Box>
        </Box>
      </Fade>
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

