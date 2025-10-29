import React, { useState, useEffect } from 'react';
import {
  Paper,
  Typography,
  Button,
  Box,
  Alert,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Grid,
  IconButton,
  List,
  ListItem,
  ListItemText,
  Chip,
  CircularProgress,
  Divider,
} from '@mui/material';
import {
  Add as AddIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
  Close as CloseIcon,
  WorkOutline as WorkIcon,
} from '@mui/icons-material';
import { adminAPI, portfolioAPI } from '../../../services/api';

interface Experience {
  _id: string;
  title: string;
  company: string;
  location: string;
  startDate: string;
  endDate: string;
  description: string;
  achievements: string[];
  current: boolean;
}

const ExperienceEditor: React.FC = () => {
  const [experiences, setExperiences] = useState<Experience[]>([]);
  const [loading, setLoading] = useState(false);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingExperience, setEditingExperience] = useState<Experience | null>(null);
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);
  
  const [formData, setFormData] = useState({
    title: '',
    company: '',
    location: '',
    startDate: '',
    endDate: '',
    description: '',
    achievements: '',
    current: false,
  });

  useEffect(() => {
    loadExperiences();
  }, []);

  const loadExperiences = async () => {
    setLoading(true);
    try {
      const response = await portfolioAPI.getExperience();
      if (response.data.success) {
        setExperiences(response.data.data);
      }
    } catch (error) {
      console.error('Error loading experiences:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleOpenDialog = (experience?: Experience) => {
    if (experience) {
      setEditingExperience(experience);
      setFormData({
        title: experience.title,
        company: experience.company,
        location: experience.location,
        startDate: experience.startDate,
        endDate: experience.endDate,
        description: experience.description,
        achievements: experience.achievements.join('\n'),
        current: experience.current,
      });
    } else {
      setEditingExperience(null);
      setFormData({
        title: '',
        company: '',
        location: '',
        startDate: '',
        endDate: 'Present',
        description: '',
        achievements: '',
        current: false,
      });
    }
    setDialogOpen(true);
  };

  const handleCloseDialog = () => {
    setDialogOpen(false);
    setEditingExperience(null);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type, checked } = e.target;
    setFormData({
      ...formData,
      [name]: type === 'checkbox' ? checked : value,
    });
    
    // Auto-set endDate to "Present" if current is checked
    if (name === 'current' && checked) {
      setFormData(prev => ({ ...prev, endDate: 'Present' }));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setMessage(null);

    try {
      const payload = {
        ...formData,
        achievements: formData.achievements.split('\n').map(a => a.trim()).filter(a => a),
      };

      if (editingExperience) {
        await adminAPI.updateExperience(editingExperience._id, payload);
        setMessage({ type: 'success', text: 'Experience updated successfully!' });
      } else {
        await adminAPI.createExperience(payload);
        setMessage({ type: 'success', text: 'Experience created successfully!' });
      }

      handleCloseDialog();
      loadExperiences();
    } catch (error: any) {
      setMessage({ type: 'error', text: error.response?.data?.message || 'Operation failed' });
    }
  };

  const handleDelete = async (id: string) => {
    if (!window.confirm('Are you sure you want to delete this experience?')) return;

    try {
      await adminAPI.deleteExperience(id);
      setMessage({ type: 'success', text: 'Experience deleted successfully!' });
      loadExperiences();
    } catch (error: any) {
      setMessage({ type: 'error', text: error.response?.data?.message || 'Delete failed' });
    }
  };

  if (loading && experiences.length === 0) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', py: 5 }}>
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Paper sx={{ p: 3 }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <Typography variant="h5" fontWeight={600}>
          Work Experience ({experiences.length})
        </Typography>
        <Button variant="contained" startIcon={<AddIcon />} onClick={() => handleOpenDialog()}>
          Add Experience
        </Button>
      </Box>

      {message && (
        <Alert severity={message.type} sx={{ mb: 3 }} onClose={() => setMessage(null)}>
          {message.text}
        </Alert>
      )}

      <List>
        {experiences.map((exp, index) => (
          <React.Fragment key={exp._id}>
            <ListItem
              sx={{
                display: 'block',
                bgcolor: 'background.paper',
                mb: 2,
                borderRadius: 2,
                border: 1,
                borderColor: 'divider',
              }}
            >
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'start' }}>
                <Box sx={{ flex: 1 }}>
                  <ListItemText
                    primary={
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                        <WorkIcon color="primary" />
                        <Typography variant="h6">{exp.title}</Typography>
                        {exp.current && <Chip label="Current" color="primary" size="small" />}
                      </Box>
                    }
                    secondary={
                      <>
                        <Typography variant="subtitle1" color="primary">
                          {exp.company} • {exp.location}
                        </Typography>
                        <Typography variant="body2" color="text.secondary">
                          {exp.startDate} - {exp.endDate}
                        </Typography>
                        <Typography variant="body2" sx={{ mt: 1 }}>
                          {exp.description}
                        </Typography>
                        {exp.achievements.length > 0 && (
                          <Box sx={{ mt: 1 }}>
                            {exp.achievements.map((achievement, idx) => (
                              <Chip
                                key={idx}
                                label={achievement}
                                size="small"
                                sx={{ mr: 0.5, mb: 0.5 }}
                              />
                            ))}
                          </Box>
                        )}
                      </>
                    }
                  />
                </Box>
                <Box>
                  <IconButton size="small" color="primary" onClick={() => handleOpenDialog(exp)}>
                    <EditIcon />
                  </IconButton>
                  <IconButton size="small" color="error" onClick={() => handleDelete(exp._id)}>
                    <DeleteIcon />
                  </IconButton>
                </Box>
              </Box>
            </ListItem>
            {index < experiences.length - 1 && <Divider />}
          </React.Fragment>
        ))}
      </List>

      {experiences.length === 0 && (
        <Box sx={{ textAlign: 'center', py: 5 }}>
          <Typography variant="body1" color="text.secondary">
            No work experience yet. Click "Add Experience" to add your first job.
          </Typography>
        </Box>
      )}

      {/* Add/Edit Dialog */}
      <Dialog open={dialogOpen} onClose={handleCloseDialog} maxWidth="md" fullWidth>
        <DialogTitle>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            {editingExperience ? 'Edit Experience' : 'Add Work Experience'}
            <IconButton onClick={handleCloseDialog}>
              <CloseIcon />
            </IconButton>
          </Box>
        </DialogTitle>
        <form onSubmit={handleSubmit}>
          <DialogContent>
            <Grid container spacing={2}>
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  label="Job Title"
                  name="title"
                  value={formData.title}
                  onChange={handleChange}
                  required
                />
              </Grid>
              <Grid item xs={12} md={6}>
                <TextField
                  fullWidth
                  label="Company"
                  name="company"
                  value={formData.company}
                  onChange={handleChange}
                  required
                />
              </Grid>
              <Grid item xs={12} md={6}>
                <TextField
                  fullWidth
                  label="Location"
                  name="location"
                  value={formData.location}
                  onChange={handleChange}
                  required
                />
              </Grid>
              <Grid item xs={12} md={6}>
                <TextField
                  fullWidth
                  label="Start Date"
                  name="startDate"
                  value={formData.startDate}
                  onChange={handleChange}
                  placeholder="Jan 2020"
                  required
                />
              </Grid>
              <Grid item xs={12} md={6}>
                <TextField
                  fullWidth
                  label="End Date"
                  name="endDate"
                  value={formData.endDate}
                  onChange={handleChange}
                  placeholder="Present or Dec 2022"
                  required
                  disabled={formData.current}
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  label="Job Description"
                  name="description"
                  value={formData.description}
                  onChange={handleChange}
                  multiline
                  rows={3}
                  required
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  label="Key Achievements (one per line)"
                  name="achievements"
                  value={formData.achievements}
                  onChange={handleChange}
                  multiline
                  rows={4}
                  placeholder="Improved performance by 40%&#10;Led team of 5 developers&#10;Implemented CI/CD pipeline"
                  helperText="Enter each achievement on a new line"
                />
              </Grid>
            </Grid>
          </DialogContent>
          <DialogActions sx={{ px: 3, pb: 2 }}>
            <Button onClick={handleCloseDialog}>Cancel</Button>
            <Button type="submit" variant="contained">
              {editingExperience ? 'Update' : 'Create'}
            </Button>
          </DialogActions>
        </form>
      </Dialog>
    </Paper>
  );
};

export default ExperienceEditor;
