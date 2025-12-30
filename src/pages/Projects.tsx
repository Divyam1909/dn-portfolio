import React, { useMemo } from 'react';
import {
  Box,
  Typography,
} from '@mui/material';
import { usePortfolioData } from '../contexts/DataContext';
import { ProjectDiary } from '../components/ProjectDiary';

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
  order?: number;
}

const Projects: React.FC = () => {
  const { data } = usePortfolioData();

  // Format projects data from portfolioData 
  const projectsData: Project[] = data.projects.map((project: any, index: number) => ({
    id: index + 1,
    title: project.title,
    description: project.description,
    image: project.image || '',
    technologies: project.technologies || [],
    github: project.sourceLink,
    live: project.demoLink,
    category: (project.technologies && project.technologies[0]) || 'Other',
    featured: project.featured,
    order: project.order || index + 1,
    // Add extra fields for Diary
    quote: project.quote || "Crafted with passion and code.",
    date: project.startDate || "2024"
  }));

  // Sort by order (newest first = lowest order number first)
  const sortedProjects = useMemo(() => {
    return [...projectsData].sort((a, b) => (a.order || 0) - (b.order || 0));
  }, [projectsData]);

  return (
    <Box sx={{ width: '100%', py: 1, display: 'flex', flexDirection: 'column', alignItems: 'center' }}>

      {/* Diary Component */}
      <Box sx={{ width: '100%', display: 'flex', justifyContent: 'center', flexGrow: 1 }}>
        <ProjectDiary projects={sortedProjects} />
      </Box>

      {sortedProjects.length === 0 && (
        <Typography variant="body1" sx={{ mt: 4, color: 'text.secondary' }}>
          No projects found.
        </Typography>
      )}

    </Box>
  );
};

export default Projects;