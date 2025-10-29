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
  Card,
  CardContent,
  CardActions,
  Chip,
  Skeleton,
  useMediaQuery,
  useTheme,
} from '@mui/material';
import {
  Add as AddIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
  Close as CloseIcon,
  DragIndicator as DragIcon,
  Link as LinkIcon,
} from '@mui/icons-material';
import { adminAPI } from '../../../services/api';
import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  DragEndEvent,
} from '@dnd-kit/core';
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  verticalListSortingStrategy,
  useSortable,
} from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';

interface Certification {
  _id: string;
  title: string;
  issuer: string;
  issueDate: string;
  expiryDate: string;
  credentialId: string;
  credentialUrl: string;
  description: string;
  skills: string[];
  certificateImage: string;
  order: number;
}

// Sortable Card Component
const SortableCertificationCard: React.FC<{ 
  cert: Certification; 
  onEdit: () => void; 
  onDelete: () => void;
}> = ({ cert, onEdit, onDelete }) => {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: cert._id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
  };

  return (
    <Card 
      ref={setNodeRef} 
      style={style} 
      sx={{ 
        mb: 2,
        touchAction: 'none',
      }}
    >
      <CardContent>
        <Box sx={{ display: 'flex', alignItems: 'start', gap: 1 }}>
          {/* Drag Handle */}
          <Box
            {...attributes}
            {...listeners}
            sx={{
              cursor: 'grab',
              '&:active': { cursor: 'grabbing' },
              color: 'text.secondary',
              pt: 0.5,
            }}
          >
            <DragIcon />
          </Box>

          <Box sx={{ flex: 1 }}>
            <Typography variant="h6" fontWeight={600} gutterBottom>
              {cert.title}
            </Typography>
            <Typography variant="subtitle1" color="primary" gutterBottom>
              {cert.issuer}
            </Typography>
            <Typography variant="body2" color="text.secondary" gutterBottom>
              Issued: {cert.issueDate}
              {cert.expiryDate !== 'No Expiration' && ` • Expires: ${cert.expiryDate}`}
            </Typography>
            {cert.credentialId && (
              <Typography variant="caption" display="block" color="text.secondary">
                ID: {cert.credentialId}
              </Typography>
            )}
            {cert.description && (
              <Typography 
                variant="body2" 
                sx={{ mt: 1 }}
                dangerouslySetInnerHTML={{ __html: cert.description }}
              />
            )}
            {cert.skills && cert.skills.length > 0 && (
              <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5, mt: 1 }}>
                {cert.skills.map((skill, idx) => (
                  <Chip key={idx} label={skill} size="small" variant="outlined" />
                ))}
              </Box>
            )}
            {cert.credentialUrl && (
              <Box sx={{ mt: 1 }}>
                <IconButton
                  size="small"
                  color="primary"
                  href={cert.credentialUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <LinkIcon fontSize="small" />
                </IconButton>
                <Typography variant="caption" color="text.secondary">
                  Verify Certificate
                </Typography>
              </Box>
            )}
          </Box>
        </Box>
      </CardContent>
      <CardActions>
        <IconButton size="small" color="primary" onClick={onEdit}>
          <EditIcon />
        </IconButton>
        <IconButton size="small" color="error" onClick={onDelete}>
          <DeleteIcon />
        </IconButton>
      </CardActions>
    </Card>
  );
};

const CertificationEditor: React.FC = () => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const [certifications, setCertifications] = useState<Certification[]>([]);
  const [loading, setLoading] = useState(false);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingCertification, setEditingCertification] = useState<Certification | null>(null);
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);
  
  const [formData, setFormData] = useState({
    title: '',
    issuer: '',
    issueDate: '',
    expiryDate: 'No Expiration',
    credentialId: '',
    credentialUrl: '',
    description: '',
    skills: '',
    certificateImage: '',
  });

  // Drag and drop sensors
  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  useEffect(() => {
    loadCertifications();
  }, []);

  const loadCertifications = async () => {
    setLoading(true);
    try {
      const response = await adminAPI.getAllCertifications();
      if (response.data.success) {
        setCertifications(response.data.data);
      }
    } catch (error) {
      console.error('Error loading certifications:', error);
      setMessage({ type: 'error', text: 'Failed to load certifications' });
    } finally {
      setLoading(false);
    }
  };

  const handleDragEnd = async (event: DragEndEvent) => {
    const { active, over } = event;

    if (over && active.id !== over.id) {
      const oldIndex = certifications.findIndex(cert => cert._id === active.id);
      const newIndex = certifications.findIndex(cert => cert._id === over.id);

      const reorderedCerts = arrayMove(certifications, oldIndex, newIndex);
      setCertifications(reorderedCerts);

      // Save the new order to backend
      try {
        await adminAPI.reorderCertifications(reorderedCerts);
        setMessage({ type: 'success', text: 'Order updated successfully!' });
      } catch (error) {
        setMessage({ type: 'error', text: 'Failed to update order' });
        loadCertifications(); // Reload on error
      }
    }
  };

  const handleOpenDialog = (certification?: Certification) => {
    if (certification) {
      setEditingCertification(certification);
      setFormData({
        title: certification.title,
        issuer: certification.issuer,
        issueDate: certification.issueDate,
        expiryDate: certification.expiryDate,
        credentialId: certification.credentialId || '',
        credentialUrl: certification.credentialUrl || '',
        description: certification.description || '',
        skills: certification.skills?.join(', ') || '',
        certificateImage: certification.certificateImage || '',
      });
    } else {
      setEditingCertification(null);
      setFormData({
        title: '',
        issuer: '',
        issueDate: '',
        expiryDate: 'No Expiration',
        credentialId: '',
        credentialUrl: '',
        description: '',
        skills: '',
        certificateImage: '',
      });
    }
    setDialogOpen(true);
  };

  const handleCloseDialog = () => {
    setDialogOpen(false);
    setEditingCertification(null);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleDescriptionChange = (value: string) => {
    setFormData({
      ...formData,
      description: value,
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setMessage(null);

    try {
      const payload = {
        ...formData,
        skills: formData.skills.split(',').map(s => s.trim()).filter(s => s),
      };

      if (editingCertification) {
        await adminAPI.updateCertification(editingCertification._id, payload);
        setMessage({ type: 'success', text: 'Certification updated successfully!' });
      } else {
        await adminAPI.createCertification(payload);
        setMessage({ type: 'success', text: 'Certification created successfully!' });
      }

      handleCloseDialog();
      loadCertifications();
    } catch (error: any) {
      setMessage({ type: 'error', text: error.response?.data?.message || 'Operation failed' });
    }
  };

  const handleDelete = async (id: string) => {
    if (!window.confirm('Are you sure you want to delete this certification?')) return;

    try {
      await adminAPI.deleteCertification(id);
      setMessage({ type: 'success', text: 'Certification deleted successfully!' });
      loadCertifications();
    } catch (error: any) {
      setMessage({ type: 'error', text: error.response?.data?.message || 'Delete failed' });
    }
  };

  // Rich text editor modules
  const modules = {
    toolbar: [
      [{ 'header': [1, 2, false] }],
      ['bold', 'italic', 'underline'],
      [{ 'list': 'ordered'}, { 'list': 'bullet' }],
      ['link'],
      ['clean']
    ],
  };

  return (
    <Paper sx={{ p: { xs: 2, sm: 3 } }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3, flexWrap: 'wrap', gap: 2 }}>
        <Typography variant="h5" fontWeight={600}>
          Certifications ({certifications.length})
        </Typography>
        <Button 
          variant="contained" 
          startIcon={<AddIcon />} 
          onClick={() => handleOpenDialog()}
          fullWidth={isMobile}
        >
          Add Certification
        </Button>
      </Box>

      {message && (
        <Alert severity={message.type} sx={{ mb: 3 }} onClose={() => setMessage(null)}>
          {message.text}
        </Alert>
      )}

      {loading ? (
        // Skeleton Loaders
        <Box>
          {[1, 2, 3].map((i) => (
            <Card key={i} sx={{ mb: 2 }}>
              <CardContent>
                <Skeleton variant="text" width="60%" height={32} />
                <Skeleton variant="text" width="40%" />
                <Skeleton variant="text" width="30%" />
                <Skeleton variant="rectangular" height={60} sx={{ mt: 1 }} />
              </CardContent>
            </Card>
          ))}
        </Box>
      ) : (
        <DndContext
          sensors={sensors}
          collisionDetection={closestCenter}
          onDragEnd={handleDragEnd}
        >
          <SortableContext
            items={certifications.map(cert => cert._id)}
            strategy={verticalListSortingStrategy}
          >
            {certifications.map((cert) => (
              <SortableCertificationCard
                key={cert._id}
                cert={cert}
                onEdit={() => handleOpenDialog(cert)}
                onDelete={() => handleDelete(cert._id)}
              />
            ))}
          </SortableContext>
        </DndContext>
      )}

      {!loading && certifications.length === 0 && (
        <Box sx={{ textAlign: 'center', py: 5 }}>
          <Typography variant="body1" color="text.secondary">
            No certifications yet. Click "Add Certification" to create your first one.
          </Typography>
        </Box>
      )}

      {/* Add/Edit Dialog - Mobile Optimized */}
      <Dialog 
        open={dialogOpen} 
        onClose={handleCloseDialog} 
        maxWidth="md" 
        fullWidth
        fullScreen={isMobile}
      >
        <DialogTitle>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            {editingCertification ? 'Edit Certification' : 'Add New Certification'}
            <IconButton onClick={handleCloseDialog} edge="end">
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
                  label="Certification Title"
                  name="title"
                  value={formData.title}
                  onChange={handleChange}
                  required
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  label="Issuing Organization"
                  name="issuer"
                  value={formData.issuer}
                  onChange={handleChange}
                  required
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  label="Issue Date"
                  name="issueDate"
                  value={formData.issueDate}
                  onChange={handleChange}
                  placeholder="Jan 2024"
                  required
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  label="Expiry Date"
                  name="expiryDate"
                  value={formData.expiryDate}
                  onChange={handleChange}
                  placeholder="No Expiration or Jan 2027"
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  label="Credential ID"
                  name="credentialId"
                  value={formData.credentialId}
                  onChange={handleChange}
                  placeholder="ABC123XYZ"
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  label="Credential URL (Verification Link)"
                  name="credentialUrl"
                  value={formData.credentialUrl}
                  onChange={handleChange}
                  placeholder="https://verify.example.com/cert/123"
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  label="Certificate Image URL"
                  name="certificateImage"
                  value={formData.certificateImage}
                  onChange={handleChange}
                  placeholder="https://example.com/certificate.jpg"
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  label="Related Skills (comma-separated)"
                  name="skills"
                  value={formData.skills}
                  onChange={handleChange}
                  placeholder="React, Node.js, AWS"
                  helperText="Separate skills with commas"
                />
              </Grid>
              <Grid item xs={12}>
                <Typography variant="subtitle2" gutterBottom>
                  Description
                </Typography>
                <Box sx={{ 
                  '& .quill': { 
                    bgcolor: 'background.paper',
                  },
                  '& .ql-container': {
                    minHeight: '150px',
                  }
                }}>
                  <ReactQuill
                    theme="snow"
                    value={formData.description}
                    onChange={handleDescriptionChange}
                    modules={modules}
                    placeholder="Describe what this certification covers..."
                  />
                </Box>
              </Grid>
            </Grid>
          </DialogContent>
          <DialogActions sx={{ px: 3, pb: 2 }}>
            <Button onClick={handleCloseDialog}>Cancel</Button>
            <Button type="submit" variant="contained">
              {editingCertification ? 'Update' : 'Create'}
            </Button>
          </DialogActions>
        </form>
      </Dialog>
    </Paper>
  );
};

export default CertificationEditor;

