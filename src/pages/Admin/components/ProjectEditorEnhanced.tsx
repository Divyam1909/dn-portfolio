// import React, { useState, useEffect } from 'react';
// import {
//   Paper,
//   Typography,
//   Button,
//   Box,
//   Alert,
//   Dialog,
//   DialogTitle,
//   DialogContent,
//   DialogActions,
//   TextField,
//   Grid,
//   IconButton,
//   Card,
//   CardContent,
//   CardActions,
//   Chip,
//   Switch,
//   FormControlLabel,
//   Skeleton,
//   useMediaQuery,
//   useTheme,
// } from '@mui/material';
// import {
//   Add as AddIcon,
//   Edit as EditIcon,
//   Delete as DeleteIcon,
//   Close as CloseIcon,
//   DragIndicator as DragIcon,
// } from '@mui/icons-material';
// import { adminAPI } from '../../../services/api';
// import {
//   DndContext,
//   closestCenter,
//   KeyboardSensor,
//   PointerSensor,
//   useSensor,
//   useSensors,
//   DragEndEvent,
// } from '@dnd-kit/core';
// import {
//   arrayMove,
//   SortableContext,
//   sortableKeyboardCoordinates,
//   verticalListSortingStrategy,
//   useSortable,
// } from '@dnd-kit/sortable';
// import { CSS } from '@dnd-kit/utilities';
// import ReactQuill from 'react-quill';
// import 'react-quill/dist/quill.snow.css';

// interface Project {
//   _id: string;
//   title: string;
//   description: string;
//   technologies: string[];
//   image: string;
//   demoLink: string;
//   sourceLink: string;
//   featured: boolean;
//   status: 'active' | 'archived' | 'draft';
//   order: number;
// }

// // Sortable Card Component
// const SortableProjectCard: React.FC<{ 
//   project: Project; 
//   onEdit: () => void; 
//   onDelete: () => void;
// }> = ({ project, onEdit, onDelete }) => {
//   const {
//     attributes,
//     listeners,
//     setNodeRef,
//     transform,
//     transition,
//     isDragging,
//   } = useSortable({ id: project._id });

//   const style = {
//     transform: CSS.Transform.toString(transform),
//     transition,
//     opacity: isDragging ? 0.5 : 1,
//   };

//   return (
//     <Grid item xs={12} md={6} ref={setNodeRef} style={style}>
//       <Card sx={{ touchAction: 'none' }}>
//         <CardContent>
//           <Box sx={{ display: 'flex', alignItems: 'start', gap: 1 }}>
//             {/* Drag Handle */}
//             <Box
//               {...attributes}
//               {...listeners}
//               sx={{
//                 cursor: 'grab',
//                 '&:active': { cursor: 'grabbing' },
//                 color: 'text.secondary',
//                 pt: 0.5,
//               }}
//             >
//               <DragIcon />
//             </Box>

//             <Box sx={{ flex: 1 }}>
//               <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'start', mb: 1 }}>
//                 <Typography variant="h6" fontWeight={600}>
//                   {project.title}
//                 </Typography>
//                 <Box>
//                   {project.featured && <Chip label="Featured" color="primary" size="small" sx={{ mr: 1 }} />}
//                   <Chip label={project.status} size="small" />
//                 </Box>
//               </Box>
//               <Typography 
//                 variant="body2" 
//                 color="text.secondary" 
//                 sx={{ mb: 2 }}
//                 dangerouslySetInnerHTML={{ __html: project.description }}
//               />
//               <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5, mb: 2 }}>
//                 {project.technologies.map((tech, idx) => (
//                   <Chip key={idx} label={tech} size="small" variant="outlined" />
//                 ))}
//               </Box>
//               {project.demoLink && (
//                 <Typography variant="caption" display="block">
//                   Demo: {project.demoLink}
//                 </Typography>
//               )}
//               {project.sourceLink && (
//                 <Typography variant="caption" display="block">
//                   Source: {project.sourceLink}
//                 </Typography>
//               )}
//             </Box>
//           </Box>
//         </CardContent>
//         <CardActions>
//           <IconButton size="small" color="primary" onClick={onEdit}>
//             <EditIcon />
//           </IconButton>
//           <IconButton size="small" color="error" onClick={onDelete}>
//             <DeleteIcon />
//           </IconButton>
//         </CardActions>
//       </Card>
//     </Grid>
//   );
// };

// const ProjectEditorEnhanced: React.FC = () => {
//   const theme = useTheme();
//   const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
//   const [projects, setProjects] = useState<Project[]>([]);
//   const [loading, setLoading] = useState(false);
//   const [dialogOpen, setDialogOpen] = useState(false);
//   const [editingProject, setEditingProject] = useState<Project | null>(null);
//   const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);
  
//   const [formData, setFormData] = useState({
//     title: '',
//     description: '',
//     technologies: '',
//     image: '',
//     demoLink: '',
//     sourceLink: '',
//     featured: false,
//     status: 'active' as 'active' | 'archived' | 'draft',
//   });

//   // Drag and drop sensors
//   const sensors = useSensors(
//     useSensor(PointerSensor),
//     useSensor(KeyboardSensor, {
//       coordinateGetter: sortableKeyboardCoordinates,
//     })
//   );

//   useEffect(() => {
//     loadProjects();
//   }, []);

//   const loadProjects = async () => {
//     setLoading(true);
//     try {
//       const response = await adminAPI.getAllProjects();
//       if (response.data.success) {
//         setProjects(response.data.data);
//       }
//     } catch (error) {
//       console.error('Error loading projects:', error);
//       setMessage({ type: 'error', text: 'Failed to load projects' });
//     } finally {
//       setLoading(false);
//     }
//   };

//   const handleDragEnd = (event: DragEndEvent) => {
//     const { active, over } = event;

//     if (over && active.id !== over.id) {
//       const oldIndex = projects.findIndex(p => p._id === active.id);
//       const newIndex = projects.findIndex(p => p._id === over.id);

//       const reorderedProjects = arrayMove(projects, oldIndex, newIndex);
//       setProjects(reorderedProjects);

//       // You can save the new order to backend here if you add reorder endpoint
//       setMessage({ type: 'success', text: 'Drag and drop order updated! (Note: Order saved locally)' });
//     }
//   };

//   const handleOpenDialog = (project?: Project) => {
//     if (project) {
//       setEditingProject(project);
//       setFormData({
//         title: project.title,
//         description: project.description,
//         technologies: project.technologies.join(', '),
//         image: project.image,
//         demoLink: project.demoLink,
//         sourceLink: project.sourceLink,
//         featured: project.featured,
//         status: project.status,
//       });
//     } else {
//       setEditingProject(null);
//       setFormData({
//         title: '',
//         description: '',
//         technologies: '',
//         image: '',
//         demoLink: '',
//         sourceLink: '',
//         featured: false,
//         status: 'active',
//       });
//     }
//     setDialogOpen(true);
//   };

//   const handleCloseDialog = () => {
//     setDialogOpen(false);
//     setEditingProject(null);
//   };

//   const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
//     const { name, value, type, checked } = e.target;
//     setFormData({
//       ...formData,
//       [name]: type === 'checkbox' ? checked : value,
//     });
//   };

//   const handleDescriptionChange = (value: string) => {
//     setFormData({
//       ...formData,
//       description: value,
//     });
//   };

//   const handleSubmit = async (e: React.FormEvent) => {
//     e.preventDefault();
//     setMessage(null);

//     try {
//       const payload = {
//         ...formData,
//         technologies: formData.technologies.split(',').map(t => t.trim()).filter(t => t),
//       };

//       if (editingProject) {
//         await adminAPI.updateProject(editingProject._id, payload);
//         setMessage({ type: 'success', text: 'Project updated successfully!' });
//       } else {
//         await adminAPI.createProject(payload);
//         setMessage({ type: 'success', text: 'Project created successfully!' });
//       }

//       handleCloseDialog();
//       loadProjects();
//     } catch (error: any) {
//       setMessage({ type: 'error', text: error.response?.data?.message || 'Operation failed' });
//     }
//   };

//   const handleDelete = async (id: string) => {
//     if (!window.confirm('Are you sure you want to delete this project?')) return;

//     try {
//       await adminAPI.deleteProject(id);
//       setMessage({ type: 'success', text: 'Project deleted successfully!' });
//       loadProjects();
//     } catch (error: any) {
//       setMessage({ type: 'error', text: error.response?.data?.message || 'Delete failed' });
//     }
//   };

//   // Rich text editor modules
//   const modules = {
//     toolbar: [
//       [{ 'header': [1, 2, false] }],
//       ['bold', 'italic', 'underline'],
//       [{ 'list': 'ordered'}, { 'list': 'bullet' }],
//       ['link'],
//       ['clean']
//     ],
//   };

//   return (
//     <Paper sx={{ p: { xs: 2, sm: 3 } }}>
//       <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3, flexWrap: 'wrap', gap: 2 }}>
//         <Typography variant="h5" fontWeight={600}>
//           Projects ({projects.length})
//         </Typography>
//         <Button 
//           variant="contained" 
//           startIcon={<AddIcon />} 
//           onClick={() => handleOpenDialog()}
//           fullWidth={isMobile}
//         >
//           Add Project
//         </Button>
//       </Box>

//       {message && (
//         <Alert severity={message.type} sx={{ mb: 3 }} onClose={() => setMessage(null)}>
//           {message.text}
//         </Alert>
//       )}

//       {loading ? (
//         // Skeleton Loaders
//         <Grid container spacing={3}>
//           {[1, 2, 3, 4].map((i) => (
//             <Grid item xs={12} md={6} key={i}>
//               <Card>
//                 <CardContent>
//                   <Skeleton variant="text" width="60%" height={32} />
//                   <Skeleton variant="text" width="100%" />
//                   <Skeleton variant="text" width="100%" />
//                   <Skeleton variant="rectangular" height={60} sx={{ mt: 1 }} />
//                 </CardContent>
//               </Card>
//             </Grid>
//           ))}
//         </Grid>
//       ) : (
//         <DndContext
//           sensors={sensors}
//           collisionDetection={closestCenter}
//           onDragEnd={handleDragEnd}
//         >
//           <SortableContext
//             items={projects.map(p => p._id)}
//             strategy={verticalListSortingStrategy}
//           >
//             <Grid container spacing={3}>
//               {projects.map((project) => (
//                 <SortableProjectCard
//                   key={project._id}
//                   project={project}
//                   onEdit={() => handleOpenDialog(project)}
//                   onDelete={() => handleDelete(project._id)}
//                 />
//               ))}
//             </Grid>
//           </SortableContext>
//         </DndContext>
//       )}

//       {!loading && projects.length === 0 && (
//         <Box sx={{ textAlign: 'center', py: 5 }}>
//           <Typography variant="body1" color="text.secondary">
//             No projects yet. Click "Add Project" to create your first project.
//           </Typography>
//         </Box>
//       )}

//       {/* Add/Edit Dialog - Mobile Optimized */}
//       <Dialog 
//         open={dialogOpen} 
//         onClose={handleCloseDialog} 
//         maxWidth="md" 
//         fullWidth
//         fullScreen={isMobile}
//       >
//         <DialogTitle>
//           <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
//             {editingProject ? 'Edit Project' : 'Add New Project'}
//             <IconButton onClick={handleCloseDialog} edge="end">
//               <CloseIcon />
//             </IconButton>
//           </Box>
//         </DialogTitle>
//         <form onSubmit={handleSubmit}>
//           <DialogContent>
//             <Grid container spacing={2}>
//               <Grid item xs={12}>
//                 <TextField
//                   fullWidth
//                   label="Project Title"
//                   name="title"
//                   value={formData.title}
//                   onChange={handleChange}
//                   required
//                 />
//               </Grid>
//               <Grid item xs={12}>
//                 <Typography variant="subtitle2" gutterBottom>
//                   Description
//                 </Typography>
//                 <Box sx={{ 
//                   '& .quill': { 
//                     bgcolor: 'background.paper',
//                   },
//                   '& .ql-container': {
//                     minHeight: '120px',
//                   }
//                 }}>
//                   <ReactQuill
//                     theme="snow"
//                     value={formData.description}
//                     onChange={handleDescriptionChange}
//                     modules={modules}
//                     placeholder="Describe your project..."
//                   />
//                 </Box>
//               </Grid>
//               <Grid item xs={12}>
//                 <TextField
//                   fullWidth
//                   label="Technologies (comma-separated)"
//                   name="technologies"
//                   value={formData.technologies}
//                   onChange={handleChange}
//                   placeholder="React, Node.js, MongoDB"
//                   helperText="Separate technologies with commas"
//                   required
//                 />
//               </Grid>
//               <Grid item xs={12}>
//                 <TextField
//                   fullWidth
//                   label="Image URL"
//                   name="image"
//                   value={formData.image}
//                   onChange={handleChange}
//                   placeholder="https://example.com/image.jpg"
//                 />
//               </Grid>
//               <Grid item xs={12} sm={6}>
//                 <TextField
//                   fullWidth
//                   label="Demo Link"
//                   name="demoLink"
//                   value={formData.demoLink}
//                   onChange={handleChange}
//                   placeholder="https://demo.example.com"
//                 />
//               </Grid>
//               <Grid item xs={12} sm={6}>
//                 <TextField
//                   fullWidth
//                   label="Source Code Link"
//                   name="sourceLink"
//                   value={formData.sourceLink}
//                   onChange={handleChange}
//                   placeholder="https://github.com/username/repo"
//                 />
//               </Grid>
//               <Grid item xs={12}>
//                 <FormControlLabel
//                   control={
//                     <Switch
//                       checked={formData.featured}
//                       onChange={handleChange}
//                       name="featured"
//                     />
//                   }
//                   label="Mark as Featured Project"
//                 />
//               </Grid>
//             </Grid>
//           </DialogContent>
//           <DialogActions sx={{ px: 3, pb: 2 }}>
//             <Button onClick={handleCloseDialog}>Cancel</Button>
//             <Button type="submit" variant="contained">
//               {editingProject ? 'Update' : 'Create'}
//             </Button>
//           </DialogActions>
//         </form>
//       </Dialog>
//     </Paper>
//   );
// };

// export default ProjectEditorEnhanced;

export {}