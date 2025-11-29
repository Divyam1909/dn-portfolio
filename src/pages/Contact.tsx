import React, { useState } from 'react';
import {
  Box,
  Typography,
  Grid,
  TextField,
  Button,
  Paper,
  useTheme,
  Card,
  CardContent,
  Alert,
  Snackbar,
  CircularProgress,
} from '@mui/material';
import {
  Email as EmailIcon,
  Phone as PhoneIcon,
  LocationOn as LocationIcon,
  Send as SendIcon,
  GitHub as GitHubIcon,
  LinkedIn as LinkedInIcon,
  Instagram as InstagramIcon,
} from '@mui/icons-material';
import { motion } from 'framer-motion';
import { usePortfolioData } from '../contexts/DataContext';
import { portfolioAPI } from '../services/api';

interface ContactInfo {
  icon: React.ReactNode;
  title: string;
  content: string;
  color: string;
}

const Contact: React.FC = () => {
  const theme = useTheme();
  const isDark = theme.palette.mode === 'dark';
  const { data } = usePortfolioData();
  const { personalInfo, contactForm } = data;
  
  // Social links from data
  const socialLinks = personalInfo.socialLinks || {};
  
  // Dynamic contact info from portfolioData
  const contactInfo: ContactInfo[] = [
    {
      icon: <EmailIcon fontSize="large" />,
      title: 'Email',
      content: personalInfo.email,
      color: '#3f51b5',
    },
    {
      icon: <PhoneIcon fontSize="large" />,
      title: 'Phone',
      content: personalInfo.phone || 'Not available',
      color: '#f50057',
    },
    {
      icon: <LocationIcon fontSize="large" />,
      title: 'Location',
      content: personalInfo.location,
      color: '#00bcd4',
    },
  ];
  
  const [formValues, setFormValues] = useState({
    name: '',
    email: '',
    subject: '',
    message: '',
  });
  const [formErrors, setFormErrors] = useState({
    name: false,
    email: false,
    message: false,
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const [showError, setShowError] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormValues({
      ...formValues,
      [name]: value,
    });
    
    // Clear error when user types
    if (formErrors[name as keyof typeof formErrors]) {
      setFormErrors({
        ...formErrors,
        [name]: false,
      });
    }
  };

  const validateForm = () => {
    const errors = {
      name: formValues.name.trim() === '',
      email: !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formValues.email),
      message: formValues.message.trim() === '',
    };
    
    setFormErrors(errors);
    return !Object.values(errors).some(Boolean);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (validateForm()) {
      setIsSubmitting(true);
      
      try {
        await portfolioAPI.submitContact({
          name: formValues.name,
          email: formValues.email,
          subject: formValues.subject || 'Contact Form Submission',
          message: formValues.message,
        });
        
        setShowSuccess(true);
        setFormValues({
          name: '',
          email: '',
          subject: '',
          message: '',
        });
      } catch (error) {
        console.error('Error submitting contact form:', error);
        setShowError(true);
      } finally {
        setIsSubmitting(false);
      }
    }
  };

  const handleCloseSnackbar = () => {
    setShowSuccess(false);
    setShowError(false);
  };

  return (
    <Box sx={{ width: '100%', overflow: 'hidden', px: { xs: 2, sm: 4, md: 6 }, py: { xs: 2, sm: 3, md: 4 } }}>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <Typography
          variant="h3"
          component="h1"
          gutterBottom
          sx={{
            fontWeight: 700,
            mb: 4,
            background: isDark
              ? 'linear-gradient(90deg, #90CAF9 0%, #F48FB1 100%)'
              : 'linear-gradient(90deg, #3F51B5 0%, #F50057 100%)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
          }}
        >
          Get In Touch
        </Typography>

        <Grid container spacing={{ xs: 2, sm: 3, md: 4 }}>
          <Grid item xs={12} md={5}>
            <Box sx={{ mb: 4 }}>
              <Typography variant="h5" gutterBottom fontWeight={600}>
                Contact Information
              </Typography>
              <Typography variant="body1" color="text.secondary" sx={{ mb: 3 }}>
                Feel free to reach out to me through any of these channels. I'm always open to new opportunities,
                collaborations, or just a friendly chat about technology and development.
              </Typography>
              
              <Grid container spacing={2}>
                {contactInfo.map((info, index) => (
                  <Grid item xs={12} key={index}>
                    <motion.div
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ duration: 0.4, delay: index * 0.1 }}
                    >
                      <Card
                        elevation={1}
                        sx={{
                          borderLeft: `4px solid ${info.color}`,
                          borderRadius: 2,
                          transition: 'transform 0.3s',
                          '&:hover': {
                            transform: 'translateY(-5px)',
                          },
                          width: '100%',
                          boxSizing: 'border-box',
                        }}
                      >
                        <CardContent sx={{ display: 'flex', alignItems: 'center', p: { xs: 2, sm: 3 } }}>
                          <Box
                            sx={{
                              display: 'flex',
                              alignItems: 'center',
                              justifyContent: 'center',
                              p: 1.5,
                              borderRadius: '50%',
                              bgcolor: `${info.color}20`,
                              color: info.color,
                              mr: 2,
                              flexShrink: 0,
                            }}
                          >
                            {info.icon}
                          </Box>
                          <Box sx={{ overflow: 'hidden', width: '100%' }}>
                            <Typography variant="h6" fontWeight={600}>
                              {info.title}
                            </Typography>
                            <Typography variant="body1" color="text.secondary" sx={{ wordBreak: 'break-word' }}>
                              {info.content}
                            </Typography>
                          </Box>
                        </CardContent>
                      </Card>
                    </motion.div>
                  </Grid>
                ))}
              </Grid>
            </Box>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.3 }}
            >
              <Paper
                elevation={1}
                sx={{
                  p: { xs: 2, sm: 3 },
                  borderRadius: 2,
                  mb: { xs: 3, md: 0 },
                  boxSizing: 'border-box',
                  width: '100%',
                }}
              >
                <Typography variant="h5" gutterBottom fontWeight={600}>
                  Find Me
                </Typography>
                <Typography variant="body2" color="text.secondary" paragraph>
                  You can also find me on these platforms:
                </Typography>
                <Box sx={{ display: 'flex', gap: 2, flexWrap: 'wrap' }}>
                  {socialLinks.github && (
                    <Button
                      variant="outlined"
                      startIcon={<GitHubIcon />}
                      component="a"
                      href={socialLinks.github}
                      target="_blank"
                      rel="noopener noreferrer"
                      sx={{ borderRadius: 8 }}
                    >
                      GitHub
                    </Button>
                  )}
                  {socialLinks.linkedin && (
                    <Button
                      variant="outlined"
                      startIcon={<LinkedInIcon />}
                      component="a"
                      href={socialLinks.linkedin}
                      target="_blank"
                      rel="noopener noreferrer"
                      sx={{ borderRadius: 8 }}
                    >
                      LinkedIn
                    </Button>
                  )}
                  {socialLinks.instagram && (
                    <Button
                      variant="outlined"
                      startIcon={<InstagramIcon />}
                      component="a"
                      href={socialLinks.instagram}
                      target="_blank"
                      rel="noopener noreferrer"
                      sx={{ 
                        borderRadius: 8,
                        borderColor: '#E1306C',
                        color: '#E1306C',
                        '&:hover': {
                          borderColor: '#E1306C',
                          backgroundColor: 'rgba(225, 48, 108, 0.08)',
                        }
                      }}
                    >
                      Instagram
                    </Button>
                  )}
                  {!socialLinks.github && !socialLinks.linkedin && !socialLinks.instagram && (
                    <Typography variant="body2" color="text.secondary">
                      Social links coming soon.
                    </Typography>
                  )}
                </Box>
              </Paper>
            </motion.div>
          </Grid>

          <Grid item xs={12} md={7}>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
            >
              <Paper
                elevation={1}
                sx={{
                  p: { xs: 2, sm: 3 },
                  borderRadius: 2,
                  overflow: 'hidden',
                  boxSizing: 'border-box',
                  width: '100%',
                }}
              >
                <Typography variant="h5" gutterBottom fontWeight={600}>
                  Send Message
                </Typography>
                <Typography variant="body1" color="text.secondary" paragraph>
                  Have a question or want to work together? Fill out the form below and I'll get back to you as soon as possible.
                </Typography>

                <form onSubmit={handleSubmit}>
                  <Grid container spacing={2}>
                    <Grid item xs={12} sm={6}>
                      <TextField
                        fullWidth
                        label="Name"
                        name="name"
                        value={formValues.name}
                        onChange={handleChange}
                        variant="outlined"
                        required
                        error={formErrors.name}
                        helperText={formErrors.name ? "Name is required" : ""}
                        sx={{ mb: 2 }}
                      />
                    </Grid>
                    <Grid item xs={12} sm={6}>
                      <TextField
                        fullWidth
                        label="Email"
                        name="email"
                        type="email"
                        value={formValues.email}
                        onChange={handleChange}
                        variant="outlined"
                        required
                        error={formErrors.email}
                        helperText={formErrors.email ? "Valid email is required" : ""}
                        sx={{ mb: 2 }}
                      />
                    </Grid>
                    <Grid item xs={12}>
                      <TextField
                        fullWidth
                        label="Subject"
                        name="subject"
                        value={formValues.subject}
                        onChange={handleChange}
                        variant="outlined"
                        sx={{ mb: 2 }}
                      />
                    </Grid>
                    <Grid item xs={12}>
                      <TextField
                        fullWidth
                        label="Message"
                        name="message"
                        multiline
                        rows={4}
                        value={formValues.message}
                        onChange={handleChange}
                        variant="outlined"
                        required
                        error={formErrors.message}
                        helperText={formErrors.message ? "Message is required" : ""}
                        sx={{ mb: 2 }}
                      />
                    </Grid>
                    <Grid item xs={12}>
                      <Button
                        type="submit"
                        variant="contained"
                        color="primary"
                        size="large"
                        endIcon={isSubmitting ? <CircularProgress size={20} color="inherit" /> : <SendIcon />}
                        disabled={isSubmitting}
                        sx={{ 
                          borderRadius: 8,
                          px: 3,
                          py: 1.5,
                        }}
                      >
                        {isSubmitting ? "Sending..." : contactForm.submitButtonText}
                      </Button>
                    </Grid>
                  </Grid>
                </form>
              </Paper>
            </motion.div>
          </Grid>
        </Grid>
      </motion.div>

      {/* Success message */}
      <Snackbar open={showSuccess} autoHideDuration={6000} onClose={handleCloseSnackbar}>
        <Alert onClose={handleCloseSnackbar} severity="success" variant="filled">
          {contactForm.successMessage}
        </Alert>
      </Snackbar>
      
      {/* Error message */}
      <Snackbar open={showError} autoHideDuration={6000} onClose={handleCloseSnackbar}>
        <Alert onClose={handleCloseSnackbar} severity="error" variant="filled">
          {contactForm.errorMessage}
        </Alert>
      </Snackbar>
    </Box>
  );
};

export default Contact; 