import React, { useState } from 'react';
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
}

const Projects: React.FC = () => {
  const theme = useTheme();
  const isDark = theme.palette.mode === 'dark';
  const { data } = usePortfolioData();
  const [search, setSearch] = useState('');
  const [category, setCategory] = useState('All');
  
  // Format projects data from portfolioData 
  const projectsData: Project[] = data.projects.map((project: any, index: number) => ({
    id: index + 1,
    title: project.title,
    description: project.description,
    image: project.image || `https://via.placeholder.com/400x250?text=${encodeURIComponent(project.title)}`,
    technologies: project.technologies,
    github: project.sourceLink,
    live: project.demoLink,
    category: project.technologies[0] || 'Other', // Using first technology as category for filtering
    featured: project.featured
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
  
  const categories = ['All', ...Array.from(new Set(projectsData.map(project => project.category)))];
  
  return (
    <Box sx={{ width: '100%', overflow: 'hidden' }}>
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
          </Grid>
        </Grid>
      </motion.div>
      
      <Grid container spacing={{ xs: 2, sm: 3, md: 4 }}>
        {filteredProjects.length === 0 ? (
          <Container sx={{ py: 8 }}>
            <Typography variant="h6" align="center" color="text.secondary">
              No projects match your search criteria.
            </Typography>
            <Typography variant="body1" align="center" color="text.secondary" sx={{ mt: 2 }}>
              Try adjusting your search or filter.
            </Typography>
          </Container>
        ) : (
          filteredProjects.map((project, index) => (
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
                    <Button 
                      size="small" 
                      color="primary" 
                      startIcon={<GitHubIcon />}
                      sx={{ mr: 1 }}
                    >
                      Code
                    </Button>
                    <Button 
                      size="small" 
                      color="primary"
                      startIcon={<LaunchIcon />}
                    >
                      Demo
                    </Button>
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