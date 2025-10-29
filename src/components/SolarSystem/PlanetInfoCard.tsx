import React from 'react';
import { Html } from '@react-three/drei';
import { Box, Paper, Typography, Chip, Divider } from '@mui/material';
import { motion, AnimatePresence } from 'framer-motion';

interface PlanetInfoCardProps {
  name: string;
  description: string;
  orbitPeriod: string;
  rotationPeriod: string;
  size: string;
  features: string[];
  show: boolean;
}

const PlanetInfoCard: React.FC<PlanetInfoCardProps> = ({
  name,
  description,
  orbitPeriod,
  rotationPeriod,
  size,
  features,
  show,
}) => {
  return (
    <Html center distanceFactor={15}>
      <AnimatePresence>
        {show && (
          <motion.div
            initial={{ opacity: 0, scale: 0.8, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.8, y: 20 }}
            transition={{ duration: 0.3 }}
          >
            <Paper
              elevation={8}
              sx={{
                p: 2.5,
                minWidth: 280,
                maxWidth: 320,
                background: 'linear-gradient(135deg, rgba(18, 18, 62, 0.98) 0%, rgba(30, 30, 90, 0.95) 100%)',
                backdropFilter: 'blur(20px)',
                border: '2px solid rgba(147, 197, 253, 0.3)',
                borderRadius: 3,
                boxShadow: '0 8px 32px rgba(0, 0, 0, 0.5)',
              }}
            >
              {/* Planet Name */}
              <Typography
                variant="h5"
                sx={{
                  color: '#E0E7FF',
                  fontWeight: 700,
                  mb: 1,
                  textAlign: 'center',
                  textShadow: '0 2px 10px rgba(147, 197, 253, 0.5)',
                }}
              >
                {name}
              </Typography>

              {/* Description */}
              <Typography
                variant="body2"
                sx={{
                  color: '#93C5FD',
                  mb: 2,
                  textAlign: 'center',
                  fontStyle: 'italic',
                }}
              >
                {description}
              </Typography>

              <Divider sx={{ borderColor: 'rgba(147, 197, 253, 0.2)', mb: 2 }} />

              {/* Stats */}
              <Box sx={{ mb: 2 }}>
                <InfoRow label="Orbit Period" value={orbitPeriod} />
                <InfoRow label="Rotation" value={rotationPeriod} />
                <InfoRow label="Size" value={size} />
              </Box>

              {/* Features */}
              {features.length > 0 && (
                <>
                  <Typography
                    variant="caption"
                    sx={{
                      color: '#93C5FD',
                      fontWeight: 600,
                      textTransform: 'uppercase',
                      letterSpacing: 1,
                    }}
                  >
                    Features
                  </Typography>
                  <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5, mt: 1 }}>
                    {features.map((feature, index) => (
                      <Chip
                        key={index}
                        label={feature}
                        size="small"
                        sx={{
                          bgcolor: 'rgba(147, 197, 253, 0.2)',
                          color: '#E0E7FF',
                          fontSize: '0.7rem',
                          border: '1px solid rgba(147, 197, 253, 0.3)',
                        }}
                      />
                    ))}
                  </Box>
                </>
              )}
            </Paper>
          </motion.div>
        )}
      </AnimatePresence>
    </Html>
  );
};

const InfoRow: React.FC<{ label: string; value: string }> = ({ label, value }) => (
  <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 0.5 }}>
    <Typography variant="caption" sx={{ color: '#C7D2FE' }}>
      {label}:
    </Typography>
    <Typography variant="caption" sx={{ color: '#E0E7FF', fontWeight: 600 }}>
      {value}
    </Typography>
  </Box>
);

export default PlanetInfoCard;

