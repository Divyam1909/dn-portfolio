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
  CircularProgress,
  Divider,
} from '@mui/material';
import {
  Add as AddIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
  Close as CloseIcon,
  School as SchoolIcon,
} from '@mui/icons-material';
import { adminAPI, portfolioAPI } from '../../../services/api';

interface Education {
  _id: string;
  degree: string;
  institution: string;
  location: string;
  startDate: string;
  endDate: string;
  description: string;
  achievements: string[];
  gpa?: string;
}

const EducationEditor: React.FC = () => {
  const [educations, setEducations] = useState<Education[]>([]);
  const [loading, setLoading] = useState(false);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingEducation, setEditingEducation] = useState<Education | null>(null);
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);
  
  const [formData, setFormData] = useState({
    degree: '',
    institution: '',
    location: '',
    startDate: '',
    endDate: '',
    description: '',
    achievements: '',
    gpa: '',
  });

  useEffect(() => {
    loadEducations();
  }, []);

  const loadEducations = async () => {
    setLoading(true);
    try {
      const response = await portfolioAPI.getEducation();
      if (response.data.success) {
        setEducations(response.data.data);
      }
    } catch (error) {
      console.error('Error loading education:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleOpenDialog = (education?: Education) => {
    if (education) {
      setEditingEducation(education);
      setFormData({
        degree: education.degree,
        institution: education.institution,
        location: education.location,
        startDate: education.startDate,
        endDate: education.endDate,
        description: education.description,
        achievements: education.achievements?.join('\n') || '',
        gpa: education.gpa || '',
      });
    } else {
      setEditingEducation(null);
      setFormData({
        degree: '',
        institution: '',
        location: '',
        startDate: '',
        endDate: '',
        description: '',
        achievements: '',
        gpa: '',
      });
    }
    setDialogOpen(true);
  };

  const handleCloseDialog = () => {
    setDialogOpen(false);
    setEditingEducation(null);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setMessage(null);

    try {
      const payload = {
        ...formData,
        achievements: formData.achievements.split('\n').map(a => a.trim()).filter(a => a),
      };

      if (editingEducation) {
        await adminAPI.updateEducation(editingEducation._id, payload);
        setMessage({ type: 'success', text: 'Education updated successfully!' });
      } else {
        await adminAPI.createEducation(payload);
        setMessage({ type: 'success', text: 'Education created successfully!' });
      }

      handleCloseDialog();
      loadEducations();
    } catch (error: any) {
      setMessage({ type: 'error', text: error.response?.data?.message || 'Operation failed' });
    }
  };

  const handleDelete = async (id: string) => {
    if (!window.confirm('Are you sure you want to delete this education entry?')) return;

    try {
      await adminAPI.deleteEducation(id);
      setMessage({ type: 'success', text: 'Education deleted successfully!' });
      loadEducations();
    } catch (error: any) {
      setMessage({ type: 'error', text: error.response?.data?.message || 'Delete failed' });
    }
  };

  if (loading && educations.length === 0) {
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
          Education ({educations.length})
        </Typography>
        <Button variant="contained" startIcon={<AddIcon />} onClick={() => handleOpenDialog()}>
          Add Education
        </Button>
      </Box>

      {message && (
        <Alert severity={message.type} sx={{ mb: 3 }} onClose={() => setMessage(null)}>
          {message.text}
        </Alert>
      )}

      <List>
        {educations.map((edu, index) => (
          <React.Fragment key={edu._id}>
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
                        <SchoolIcon color="primary" />
                        <Typography variant="h6">{edu.degree}</Typography>
                      </Box>
                    }
                    secondary={
                      <>
                        <Typography variant="subtitle1" color="primary">
                          {edu.institution} • {edu.location}
                        </Typography>
                        <Typography variant="body2" color="text.secondary">
                          {edu.startDate} - {edu.endDate}
                          {edu.gpa && ` • GPA: ${edu.gpa}`}
                        </Typography>
                        {edu.description && (
                          <Typography variant="body2" sx={{ mt: 1 }}>
                            {edu.description}
                          </Typography>
                        )}
                      </>
                    }
                  />
                </Box>
                <Box>
                  <IconButton size="small" color="primary" onClick={() => handleOpenDialog(edu)}>
                    <EditIcon />
                  </IconButton>
                  <IconButton size="small" color="error" onClick={() => handleDelete(edu._id)}>
                    <DeleteIcon />
                  </IconButton>
                </Box>
              </Box>
            </ListItem>
            {index < educations.length - 1 && <Divider />}
          </React.Fragment>
        ))}
      </List>

      {educations.length === 0 && (
        <Box sx={{ textAlign: 'center', py: 5 }}>
          <Typography variant="body1" color="text.secondary">
            No education entries yet. Click "Add Education" to add your first entry.
          </Typography>
        </Box>
      )}

      {/* Add/Edit Dialog */}
      <Dialog open={dialogOpen} onClose={handleCloseDialog} maxWidth="md" fullWidth>
        <DialogTitle>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            {editingEducation ? 'Edit Education' : 'Add Education'}
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
                  label="Degree / Qualification"
                  name="degree"
                  value={formData.degree}
                  onChange={handleChange}
                  placeholder="Bachelor of Science in Computer Science"
                  required
                />
              </Grid>
              <Grid item xs={12} md={6}>
                <TextField
                  fullWidth
                  label="Institution"
                  name="institution"
                  value={formData.institution}
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
              <Grid item xs={12} md={4}>
                <TextField
                  fullWidth
                  label="Start Date"
                  name="startDate"
                  value={formData.startDate}
                  onChange={handleChange}
                  placeholder="Aug 2016"
                  required
                />
              </Grid>
              <Grid item xs={12} md={4}>
                <TextField
                  fullWidth
                  label="End Date"
                  name="endDate"
                  value={formData.endDate}
                  onChange={handleChange}
                  placeholder="May 2020"
                  required
                />
              </Grid>
              <Grid item xs={12} md={4}>
                <TextField
                  fullWidth
                  label="GPA (Optional)"
                  name="gpa"
                  value={formData.gpa}
                  onChange={handleChange}
                  placeholder="3.8/4.0"
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  label="Description"
                  name="description"
                  value={formData.description}
                  onChange={handleChange}
                  multiline
                  rows={3}
                  placeholder="Brief description of coursework, focus areas, etc."
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  label="Achievements (one per line)"
                  name="achievements"
                  value={formData.achievements}
                  onChange={handleChange}
                  multiline
                  rows={3}
                  placeholder="Dean's List 2018-2020&#10;Best Project Award&#10;Graduated with Honors"
                  helperText="Enter each achievement on a new line (optional)"
                />
              </Grid>
            </Grid>
          </DialogContent>
          <DialogActions sx={{ px: 3, pb: 2 }}>
            <Button onClick={handleCloseDialog}>Cancel</Button>
            <Button type="submit" variant="contained">
              {editingEducation ? 'Update' : 'Create'}
            </Button>
          </DialogActions>
        </form>
      </Dialog>
    </Paper>
  );
};

export default EducationEditor;
