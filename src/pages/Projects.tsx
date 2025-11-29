import React, { useState, useMemo } from 'react';
import { 
  Box, 
  Typography, 
  Grid, 
  Card, 
  CardMedia, 
  CardContent, 
  CardActions, 
  Button, 
  Chip, 
  useTheme, 
  Container, 
  InputBase, 
  IconButton, 
  Paper,
  FormControl,
  Select,
  MenuItem,
  SelectChangeEvent,
  InputLabel,
} from '@mui/material';
import { 
  Search as SearchIcon, 
  GitHub as GitHubIcon, 
  Launch as LaunchIcon,
} from '@mui/icons-material';
import { motion } from 'framer-motion';
import { usePortfolioData } from '../contexts/DataContext';
import { dateForSorting } from "../utils/date"; // Import dateForSorting

interface Project {
  id?: number;
  title: string;
  description: string;
  image: string;
  technologies: string[];
  github?: string;
  sourceLink?: string;
  live?: string;
  demoLink?: string;
  category?: string;
  featured?: boolean;
  startDate?: string; // Add startDate for sorting
  endDate?: string; // Add endDate for sorting
  startDateISO?: string; // Add startDateISO for sorting
  endDateISO?: string; // Add endDateISO for sorting
}

const Projects: React.FC = () => {
  const theme = useTheme();
  const isDark = theme.palette.mode === 'dark';
  const { data } = usePortfolioData();
  const [search, setSearch] = useState('');
  const [category, setCategory] = useState('All');
  const [orderDesc, setOrderDesc] = useState(true); // New state for sorting order
  
  // Generate a gradient placeholder based on project title
  const getGradientForProject = (title: string) => {
    const hash = title.split('').reduce((acc, char) => char.charCodeAt(0) + acc, 0);
    const gradients = [
      'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
      'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)',
      'linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)',
      'linear-gradient(135deg, #43e97b 0%, #38f9d7 100%)',
      'linear-gradient(135deg, #fa709a 0%, #fee140 100%)',
      'linear-gradient(135deg, #a8edea 0%, #fed6e3 100%)',
      'linear-gradient(135deg, #ff9a9e 0%, #fecfef 100%)',
      'linear-gradient(135deg, #ffecd2 0%, #fcb69f 100%)',
    ];
    return gradients[hash % gradients.length];
  };

  // Format projects data from portfolioData 
  const projectsData: Project[] = data.projects.map((project: any, index: number) => ({
    id: index + 1,
    title: project.title,
    description: project.description,
    image: project.image || '', // Empty string triggers gradient fallback
    technologies: project.technologies || [],
    github: project.sourceLink,
    live: project.demoLink,
    category: (project.technologies && project.technologies[0]) || 'Other',
    featured: project.featured,
    startDate: project.startDate,
    endDate: project.endDate,
    startDateISO: project.startDateISO,
    endDateISO: project.endDateISO,
  }));
  
  const handleCategoryChange = (event: SelectChangeEvent) => {
    setCategory(event.target.value);
  };
  
  const filteredProjects = projectsData.filter(project => {
    const matchesSearch = project.title.toLowerCase().includes(search.toLowerCase()) || 
                         project.description.toLowerCase().includes(search.toLowerCase()) ||
                         project.technologies.some(tech => tech.toLowerCase().includes(search.toLowerCase()));
    
    const matchesCategory = category === 'All' || project.category === category;
    
    return matchesSearch && matchesCategory;
  });

  const sortedAndFilteredProjects = useMemo(() => {
    const copy = [...filteredProjects];
    copy.sort((a, b) => {
      const da = dateForSorting(a);
      const db = dateForSorting(b);
      const va = da ? da.valueOf() : 0;
      const vb = db ? db.valueOf() : 0;
      return orderDesc ? vb - va : va - vb;
    });
    return copy;
  }, [filteredProjects, orderDesc]);
  
  const categories = ['All', ...Array.from(new Set(projectsData.map(project => project.category)))];
  
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
            mb: 3,
            background: isDark 
              ? 'linear-gradient(90deg, #90CAF9 0%, #F48FB1 100%)'
              : 'linear-gradient(90deg, #3F51B5 0%, #F50057 100%)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
          }}
        >
          My Projects
        </Typography>
        
        <Grid container spacing={{ xs: 2, sm: 3 }} sx={{ mb: 4 }}>
          <Grid item xs={12} md={6}>
            <Paper
              elevation={1}
              sx={{
                p: '2px 4px',
                display: 'flex',
                alignItems: 'center',
                borderRadius: 2,
                width: '100%',
                boxSizing: 'border-box',
              }}
            >
              <IconButton sx={{ p: '10px' }} aria-label="search">
                <SearchIcon />
              </IconButton>
              <InputBase
                sx={{ ml: 1, flex: 1 }}
                placeholder="Search projects by name, description, or technology"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
            </Paper>
          </Grid>
          <Grid item xs={12} md={6}>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: 2 }}>
              <FormControl fullWidth variant="outlined" size="small">
                <InputLabel id="category-filter-label">Category</InputLabel>
                <Select
                  labelId="category-filter-label"
                  id="category-filter"
                  value={category}
                  onChange={handleCategoryChange}
                  label="Category"
                >
                  {categories.map((cat) => (
                    <MenuItem key={cat} value={cat}>
                      {cat}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
              <Button onClick={() => setOrderDesc((s) => !s)} variant="outlined" size="small">
                {orderDesc ? "Newest first" : "Oldest first"}
              </Button>
            </Box>
          </Grid>
        </Grid>
      </motion.div>
      
      <Grid container spacing={{ xs: 2, sm: 3, md: 4 }}>
        {sortedAndFilteredProjects.length === 0 ? (
          <Container sx={{ py: 8 }}>
            <Typography variant="h6" align="center" color="text.secondary">
              No projects match your search criteria.
            </Typography>
            <Typography variant="body1" align="center" color="text.secondary" sx={{ mt: 2 }}>
              Try adjusting your search or filter.
            </Typography>
          </Container>
        ) : (
          sortedAndFilteredProjects.map((project, index) => (
            <Grid item key={project.id} xs={12} sm={6} md={4}>
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                style={{ height: '100%' }}
              >
                <Card 
                  elevation={1}
                  sx={{ 
                    height: '100%', 
                    display: 'flex', 
                    flexDirection: 'column',
                    borderRadius: 2,
                    transition: 'transform 0.3s, box-shadow 0.3s',
                    '&:hover': {
                      transform: 'translateY(-8px)',
                      boxShadow: theme.shadows[8],
                    },
                    overflow: 'hidden',
                  }}
                >
                  {project.image ? (
                    <CardMedia
                      sx={{ 
                        height: 200,
                        width: '100%',
                        objectFit: 'cover',
                        objectPosition: 'center',
                      }}
                      image={project.image}
                      title={project.title}
                    />
                  ) : (
                    <Box
                      sx={{
                        height: 200,
                        width: '100%',
                        background: getGradientForProject(project.title),
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                      }}
                    >
                      <Typography
                        variant="h4"
                        sx={{
                          color: 'white',
                          fontWeight: 700,
                          textShadow: '0 2px 10px rgba(0,0,0,0.3)',
                          textAlign: 'center',
                          px: 2,
                        }}
                      >
                        {project.title.split(' ').map(word => word[0]).join('').slice(0, 3)}
                      </Typography>
                    </Box>
                  )}
                  <CardContent sx={{ 
                    flexGrow: 1, 
                    p: { xs: 2, sm: 3 },
                    display: 'flex',
                    flexDirection: 'column',
                  }}>
                    <Typography gutterBottom variant="h6" component="h2" sx={{ fontWeight: 600 }}>
                      {project.title}
                    </Typography>
                    <Typography 
                      variant="body2" 
                      color="text.secondary" 
                      sx={{ 
                        mb: 2,
                        display: '-webkit-box',
                        WebkitLineClamp: 3,
                        WebkitBoxOrient: 'vertical',
                        overflow: 'hidden',
                        height: '4.5em',
                      }}
                    >
                      {project.description}
                    </Typography>
                    <Box sx={{ 
                      display: 'flex', 
                      flexWrap: 'wrap', 
                      gap: 0.5, 
                      mt: 'auto',
                      height: '4em',
                      overflow: 'hidden'
                    }}>
                      {project.technologies.map((tech, index) => (
                        <Chip
                          key={index}
                          label={tech}
                          size="small"
                          sx={{
                            backgroundColor: isDark
                              ? 'rgba(144, 202, 249, 0.1)'
                              : 'rgba(63, 81, 181, 0.1)',
                            color: theme.palette.primary.main,
                            my: 0.5,
                          }}
                        />
                      ))}
                    </Box>
                  </CardContent>
                  <CardActions sx={{ p: { xs: 1.5, sm: 2 }, mt: 'auto' }}>
                    {project.github && (
                      <Button 
                        size="small" 
                        color="primary" 
                        startIcon={<GitHubIcon />}
                        component="a"
                        href={project.github}
                        target="_blank"
                        rel="noopener noreferrer"
                        sx={{ mr: 1 }}
                      >
                        Code
                      </Button>
                    )}
                    {project.live && (
                      <Button 
                        size="small" 
                        color="primary"
                        startIcon={<LaunchIcon />}
                        component="a"
                        href={project.live}
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        Demo
                      </Button>
                    )}
                    {!project.github && !project.live && (
                      <Typography variant="caption" color="text.secondary" sx={{ px: 1 }}>
                        Links coming soon
                      </Typography>
                    )}
                  </CardActions>
                </Card>
              </motion.div>
            </Grid>
          ))
        )}
      </Grid>
    </Box>
  );
};

export default Projects; 