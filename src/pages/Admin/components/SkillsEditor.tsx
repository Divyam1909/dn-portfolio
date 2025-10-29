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
  Tabs,
  Tab,
  Slider,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
} from '@mui/material';
import {
  Add as AddIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
  Close as CloseIcon,
} from '@mui/icons-material';
import { adminAPI, portfolioAPI } from '../../../services/api';

interface Skill {
  _id: string;
  name: string;
  level: number;
  category: 'technical' | 'soft' | 'language';
  proficiency?: string;
}

const SkillsEditor: React.FC = () => {
  const [skills, setSkills] = useState<Skill[]>([]);
  const [loading, setLoading] = useState(false);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingSkill, setEditingSkill] = useState<Skill | null>(null);
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);
  const [tabValue, setTabValue] = useState(0);
  
  const [formData, setFormData] = useState({
    name: '',
    level: 50,
    category: 'technical' as 'technical' | 'soft' | 'language',
    proficiency: '',
  });

  useEffect(() => {
    loadSkills();
  }, []);

  const loadSkills = async () => {
    setLoading(true);
    try {
      const response = await portfolioAPI.getSkills();
      if (response.data.success) {
        const allSkills = [
          ...(response.data.data.technical || []),
          ...(response.data.data.soft || []),
          ...(response.data.data.languages || [])
        ];
        setSkills(allSkills);
      }
    } catch (error) {
      console.error('Error loading skills:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleTabChange = (event: React.SyntheticEvent, newValue: number) => {
    setTabValue(newValue);
  };

  const handleOpenDialog = (skill?: Skill, category?: 'technical' | 'soft' | 'language') => {
    if (skill) {
      setEditingSkill(skill);
      setFormData({
        name: skill.name,
        level: skill.level || 50,
        category: skill.category,
        proficiency: skill.proficiency || '',
      });
    } else {
      setEditingSkill(null);
      setFormData({
        name: '',
        level: 50,
        category: category || 'technical',
        proficiency: '',
      });
    }
    setDialogOpen(true);
  };

  const handleCloseDialog = () => {
    setDialogOpen(false);
    setEditingSkill(null);
  };

  const handleChange = (e: any) => {
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
      const payload = formData;

      if (editingSkill) {
        await adminAPI.updateSkill(editingSkill._id, payload);
        setMessage({ type: 'success', text: 'Skill updated successfully!' });
      } else {
        await adminAPI.createSkill(payload);
        setMessage({ type: 'success', text: 'Skill created successfully!' });
      }

      handleCloseDialog();
      loadSkills();
    } catch (error: any) {
      setMessage({ type: 'error', text: error.response?.data?.message || 'Operation failed' });
    }
  };

  const handleDelete = async (id: string) => {
    if (!window.confirm('Are you sure you want to delete this skill?')) return;

    try {
      await adminAPI.deleteSkill(id);
      setMessage({ type: 'success', text: 'Skill deleted successfully!' });
      loadSkills();
    } catch (error: any) {
      setMessage({ type: 'error', text: error.response?.data?.message || 'Delete failed' });
    }
  };

  const filterSkillsByCategory = (category: string) => {
    return skills.filter(s => s.category === category);
  };

  const renderSkillsList = (category: 'technical' | 'soft' | 'language') => {
    const filteredSkills = filterSkillsByCategory(category);

    if (filteredSkills.length === 0) {
      return (
        <Box sx={{ textAlign: 'center', py: 5 }}>
          <Typography variant="body1" color="text.secondary">
            No {category} skills yet. Click "Add {category.charAt(0).toUpperCase() + category.slice(1)} Skill" to add one.
          </Typography>
        </Box>
      );
    }

    return (
      <List>
        {filteredSkills.map((skill) => (
          <ListItem
            key={skill._id}
            sx={{
              bgcolor: 'background.paper',
              mb: 1,
              borderRadius: 1,
              border: 1,
              borderColor: 'divider',
            }}
          >
            <ListItemText
              primary={skill.name}
              secondary={
                category === 'language' 
                  ? skill.proficiency 
                  : `Level: ${skill.level}%`
              }
            />
            <Box>
              <IconButton size="small" color="primary" onClick={() => handleOpenDialog(skill)}>
                <EditIcon />
              </IconButton>
              <IconButton size="small" color="error" onClick={() => handleDelete(skill._id)}>
                <DeleteIcon />
              </IconButton>
            </Box>
          </ListItem>
        ))}
      </List>
    );
  };

  if (loading && skills.length === 0) {
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
          Skills ({skills.length})
        </Typography>
        <Button 
          variant="contained" 
          startIcon={<AddIcon />} 
          onClick={() => handleOpenDialog(undefined, 
            tabValue === 0 ? 'technical' : tabValue === 1 ? 'soft' : 'language'
          )}
        >
          Add Skill
        </Button>
      </Box>

      {message && (
        <Alert severity={message.type} sx={{ mb: 3 }} onClose={() => setMessage(null)}>
          {message.text}
        </Alert>
      )}

      <Tabs value={tabValue} onChange={handleTabChange} sx={{ borderBottom: 1, borderColor: 'divider', mb: 2 }}>
        <Tab label={`Technical (${filterSkillsByCategory('technical').length})`} />
        <Tab label={`Soft Skills (${filterSkillsByCategory('soft').length})`} />
        <Tab label={`Languages (${filterSkillsByCategory('language').length})`} />
      </Tabs>

      {tabValue === 0 && renderSkillsList('technical')}
      {tabValue === 1 && renderSkillsList('soft')}
      {tabValue === 2 && renderSkillsList('language')}

      {/* Add/Edit Dialog */}
      <Dialog open={dialogOpen} onClose={handleCloseDialog} maxWidth="sm" fullWidth>
        <DialogTitle>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            {editingSkill ? 'Edit Skill' : 'Add New Skill'}
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
                  label="Skill Name"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  required
                />
              </Grid>
              <Grid item xs={12}>
                <FormControl fullWidth>
                  <InputLabel>Category</InputLabel>
                  <Select
                    name="category"
                    value={formData.category}
                    onChange={handleChange}
                    label="Category"
                    required
                  >
                    <MenuItem value="technical">Technical</MenuItem>
                    <MenuItem value="soft">Soft Skill</MenuItem>
                    <MenuItem value="language">Language</MenuItem>
                  </Select>
                </FormControl>
              </Grid>
              
              {formData.category === 'language' ? (
                <Grid item xs={12}>
                  <FormControl fullWidth>
                    <InputLabel>Proficiency</InputLabel>
                    <Select
                      name="proficiency"
                      value={formData.proficiency}
                      onChange={handleChange}
                      label="Proficiency"
                      required
                    >
                      <MenuItem value="Native">Native</MenuItem>
                      <MenuItem value="Fluent">Fluent</MenuItem>
                      <MenuItem value="Intermediate">Intermediate</MenuItem>
                      <MenuItem value="Basic">Basic</MenuItem>
                    </Select>
                  </FormControl>
                </Grid>
              ) : (
                <Grid item xs={12}>
                  <Typography gutterBottom>Skill Level: {formData.level}%</Typography>
                  <Slider
                    name="level"
                    value={formData.level}
                    onChange={(e, value) => setFormData({ ...formData, level: value as number })}
                    min={0}
                    max={100}
                    step={5}
                    marks
                    valueLabelDisplay="auto"
                  />
                </Grid>
              )}
            </Grid>
          </DialogContent>
          <DialogActions sx={{ px: 3, pb: 2 }}>
            <Button onClick={handleCloseDialog}>Cancel</Button>
            <Button type="submit" variant="contained">
              {editingSkill ? 'Update' : 'Create'}
            </Button>
          </DialogActions>
        </form>
      </Dialog>
    </Paper>
  );
};

export default SkillsEditor;
