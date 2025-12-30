import React, { useState, useEffect, useMemo } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import {
  Box,
  Typography,
  Grid,
  Paper,
  Tabs,
  Tab,
  Button,
  Chip,
  useTheme,
  useMediaQuery,
  alpha,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  CircularProgress,
} from '@mui/material';
import {
  Work as WorkIcon,
  School as SchoolIcon,
  Code as CodeIcon,
  EmojiEvents as AchievementsIcon,
  Download as DownloadIcon,
  CalendarMonth as CalendarIcon,
  LocationOn as LocationIcon,
  Business as BusinessIcon,
  ExpandMore as ExpandMoreIcon,
  KeyboardArrowDown as ArrowDownIcon,
  KeyboardArrowUp as ArrowUpIcon,
  Sort as SortIcon,
} from '@mui/icons-material';
import { motion, AnimatePresence } from 'framer-motion';
import { usePortfolioData } from '../contexts/DataContext';
import { dateForSorting } from "../utils/date";

// --- Types ---
interface TimelineItemData {
  id: string | number;
  title: string;
  subtitle: string;
  date: string;
  location: string;
  description: string;
  tags: string[];
  isCurrent?: boolean;
}

// --- Shared Components ---

const TabPanel: React.FC<{ children?: React.ReactNode; index: number; value: number }> = ({ children, value, index }) => (
  <div role="tabpanel" hidden={value !== index} style={{ width: '100%' }}>
    {value === index && <Box sx={{ py: 3 }}>{children}</Box>}
  </div>
);

// The Vertical Line Container
const TimelineContainer: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const theme = useTheme();
  return (
    <Box sx={{ position: 'relative', pl: { xs: 2, md: 4 } }}>
      {/* The Continuous Line */}
      <Box
        sx={{
          position: 'absolute',
          left: { xs: 6, md: 15 }, // Aligned with the dots
          top: 20,
          bottom: 40,
          width: 2,
          background: `linear-gradient(to bottom, ${alpha(theme.palette.primary.main, 0.5)}, ${alpha(theme.palette.divider, 0.1)})`,
          borderRadius: 1,
          zIndex: 0,
        }}
      />
      {children}
    </Box>
  );
};

// The Dot that reacts to Hover
const TimelineDot: React.FC<{ color?: string }> = ({ color }) => {
  const theme = useTheme();
  const activeColor = color || theme.palette.primary.main;

  return (
    <Box
      className="timeline-dot"
      sx={{
        position: 'absolute',
        left: { xs: -3, md: 6 }, // Positioning relative to the item wrapper
        top: 28,
        width: 20,
        height: 20,
        borderRadius: '50%',
        bgcolor: theme.palette.background.default,
        border: `2px solid ${alpha(activeColor, 0.5)}`,
        zIndex: 1,
        transition: 'all 0.3s ease',
        boxShadow: `0 0 0 0px ${alpha(activeColor, 0)}`,
        // The inner fill circle (initially small)
        '&::after': {
          content: '""',
          position: 'absolute',
          top: '50%',
          left: '50%',
          transform: 'translate(-50%, -50%) scale(0)',
          width: 10,
          height: 10,
          borderRadius: '50%',
          bgcolor: activeColor,
          transition: 'transform 0.3s cubic-bezier(0.175, 0.885, 0.32, 1.275)',
        }
      }}
    />
  );
};

// 1. Accordion Component for Experience
const ExperienceAccordion: React.FC<{ items: TimelineItemData[] }> = ({ items }) => {
  const theme = useTheme();
  const isDark = theme.palette.mode === 'dark';

  // State for "One open at a time"
  const [expanded, setExpanded] = useState<string | false>(false);
  // State for "View More"
  const [showAll, setShowAll] = useState(false);

  const handleChange = (panel: string) => (event: React.SyntheticEvent, isExpanded: boolean) => {
    setExpanded(isExpanded ? panel : false);
  };

  const visibleItems = showAll ? items : items.slice(0, 5);
  const hasMore = items.length > 5;

  if (!items || items.length === 0) {
    return (
      <Box sx={{ textAlign: 'center', py: 8, opacity: 0.6 }}>
        <Typography variant="h6">No experience entries found.</Typography>
      </Box>
    );
  }

  return (
    <TimelineContainer>
      {visibleItems.map((item, index) => {
        const panelId = `panel-${item.id}-${index}`;
        const isPanelExpanded = expanded === panelId;

        return (
          <Box
            key={item.id}
            sx={{
              position: 'relative',
              mb: 3,
              pl: { xs: 3, md: 5 },
              // HOVER EFFECT: Triggers changes in the child .timeline-dot
              '&:hover .timeline-dot': {
                borderColor: theme.palette.primary.main,
                boxShadow: `0 0 0 4px ${alpha(theme.palette.primary.main, 0.2)}`,
                transform: 'scale(1.1)',
              },
              '&:hover .timeline-dot::after': {
                transform: 'translate(-50%, -50%) scale(1)',
              }
            }}
          >
            <TimelineDot />

            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-50px" }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
            >
              <Accordion
                expanded={isPanelExpanded}
                onChange={handleChange(panelId)}
                sx={{
                  borderRadius: '16px !important',
                  background: isDark
                    ? `linear-gradient(145deg, ${alpha(theme.palette.background.paper, 0.6)} 0%, ${alpha(theme.palette.background.default, 0.8)} 100%)`
                    : `linear-gradient(145deg, #ffffff 0%, #f8faff 100%)`,
                  backdropFilter: 'blur(12px)',
                  border: `1px solid ${isDark ? alpha(theme.palette.common.white, 0.08) : alpha(theme.palette.primary.main, 0.08)}`,
                  boxShadow: isDark
                    ? '0 4px 20px rgba(0, 0, 0, 0.2)'
                    : '0 4px 20px rgba(100, 100, 100, 0.05)',
                  '&:before': { display: 'none' },
                  transition: 'all 0.3s ease',
                  '&.Mui-expanded': {
                    boxShadow: isDark
                      ? `0 8px 30px rgba(0, 0, 0, 0.5)`
                      : `0 8px 30px ${alpha(theme.palette.primary.main, 0.15)}`,
                    borderColor: theme.palette.primary.main,
                  }
                }}
              >
                <AccordionSummary
                  expandIcon={<ExpandMoreIcon sx={{ color: theme.palette.primary.main }} />}
                  sx={{
                    px: 3,
                    py: 1,
                    '& .MuiAccordionSummary-content': {
                      display: 'flex',
                      justifyContent: 'space-between',
                      alignItems: 'center',
                      flexWrap: 'wrap',
                      gap: 2
                    }
                  }}
                >
                  <Box>
                    <Typography variant="h6" sx={{ fontWeight: 700, fontSize: '1.05rem', color: isPanelExpanded ? theme.palette.primary.main : theme.palette.text.primary }}>
                      {item.title}
                    </Typography>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mt: 0.5 }}>
                      <BusinessIcon sx={{ fontSize: 16, opacity: 0.7 }} />
                      <Typography variant="body2" sx={{ fontWeight: 600, opacity: 0.9 }}>
                        {item.subtitle}
                      </Typography>
                    </Box>
                  </Box>

                  <Box sx={{ textAlign: { xs: 'left', sm: 'right' }, minWidth: { sm: '120px' } }}>
                    <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: { xs: 'flex-start', sm: 'flex-end' }, gap: 1, mb: 0.5 }}>
                      <CalendarIcon sx={{ fontSize: 14, opacity: 0.7 }} />
                      <Typography variant="caption" sx={{ fontWeight: 600, color: theme.palette.primary.main }}>
                        {item.date}
                      </Typography>
                    </Box>
                    {item.location && (
                      <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: { xs: 'flex-start', sm: 'flex-end' }, gap: 1 }}>
                        <LocationIcon sx={{ fontSize: 14, opacity: 0.5 }} />
                        <Typography variant="caption" sx={{ opacity: 0.7 }}>
                          {item.location}
                        </Typography>
                      </Box>
                    )}
                  </Box>
                </AccordionSummary>

                <AccordionDetails sx={{ px: 3, pb: 3, pt: 0 }}>
                  <Box sx={{ height: '1px', width: '100%', bgcolor: alpha(theme.palette.divider, 0.1), mb: 2 }} />

                  <Typography variant="body2" sx={{ lineHeight: 1.8, color: theme.palette.text.secondary, mb: 2 }}>
                    {item.description}
                  </Typography>

                  {item.tags && item.tags.length > 0 && (
                    <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1, mt: 2 }}>
                      {item.tags.map((tag, i) => (
                        <Chip
                          key={i}
                          label={tag}
                          size="small"
                          sx={{
                            backgroundColor: isDark ? alpha(theme.palette.primary.main, 0.1) : alpha(theme.palette.primary.main, 0.05),
                            color: isDark ? theme.palette.primary.light : theme.palette.primary.dark,
                            fontWeight: 500,
                            fontSize: '0.75rem',
                            border: `1px solid ${isDark ? alpha(theme.palette.primary.main, 0.2) : 'transparent'}`,
                          }}
                        />
                      ))}
                    </Box>
                  )}
                </AccordionDetails>
              </Accordion>
            </motion.div>
          </Box>
        );
      })}

      {hasMore && (
        <Box sx={{ display: 'flex', justifyContent: 'center', mt: 3, pl: { xs: 0, md: 4 } }}>
          <Button
            onClick={() => setShowAll(!showAll)}
            endIcon={showAll ? <ArrowUpIcon /> : <ArrowDownIcon />}
            sx={{
              borderRadius: 20,
              px: 4,
              textTransform: 'none',
              fontWeight: 600,
              backgroundColor: alpha(theme.palette.primary.main, 0.1),
              '&:hover': {
                backgroundColor: alpha(theme.palette.primary.main, 0.2),
              }
            }}
          >
            {showAll ? 'Show Less' : `View ${items.length - 5} More Experiences`}
          </Button>
        </Box>
      )}
    </TimelineContainer>
  );
};

// 2. Modern Card for Education & Certifications
const ModernTimelineCard: React.FC<{ item: TimelineItemData; index: number }> = ({ item, index }) => {
  const theme = useTheme();
  const isDark = theme.palette.mode === 'dark';

  return (
    <Box
      sx={{
        position: 'relative',
        mb: 3,
        pl: { xs: 3, md: 5 },
        '&:hover .timeline-dot': {
          borderColor: theme.palette.secondary.main,
          boxShadow: `0 0 0 4px ${alpha(theme.palette.secondary.main, 0.2)}`,
          transform: 'scale(1.1)',
        },
        '&:hover .timeline-dot::after': {
          transform: 'translate(-50%, -50%) scale(1)',
        }
      }}
    >
      <TimelineDot color={theme.palette.secondary.main} />

      <motion.div
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-50px" }}
        transition={{ duration: 0.5, delay: index * 0.1 }}
      >
        <Paper
          elevation={0}
          sx={{
            p: 3,
            borderRadius: 4,
            position: 'relative',
            background: isDark
              ? `linear-gradient(145deg, ${alpha(theme.palette.background.paper, 0.6)} 0%, ${alpha(theme.palette.background.default, 0.8)} 100%)`
              : `linear-gradient(145deg, #ffffff 0%, #f8faff 100%)`,
            backdropFilter: 'blur(12px)',
            border: `1px solid ${isDark ? alpha(theme.palette.common.white, 0.08) : alpha(theme.palette.primary.main, 0.08)}`,
            boxShadow: isDark
              ? '0 8px 32px rgba(0, 0, 0, 0.2)'
              : '0 8px 32px rgba(100, 100, 100, 0.05)',
            transition: 'transform 0.3s ease, box-shadow 0.3s ease, border-color 0.3s ease',
            '&:hover': {
              transform: 'translateY(-4px)',
              boxShadow: isDark
                ? `0 12px 40px rgba(0, 0, 0, 0.4)`
                : `0 12px 40px ${alpha(theme.palette.secondary.main, 0.1)}`,
              borderColor: theme.palette.secondary.main,
            },
          }}
        >
          <Box sx={{ display: 'flex', flexDirection: { xs: 'column', md: 'row' }, justifyContent: 'space-between', mb: 2, gap: 1 }}>
            <Box>
              <Typography variant="h6" sx={{ fontWeight: 700, color: theme.palette.text.primary, fontSize: '1.1rem' }}>
                {item.title}
              </Typography>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mt: 0.5 }}>
                <SchoolIcon sx={{ fontSize: 18, color: theme.palette.secondary.main }} />
                <Typography variant="subtitle1" sx={{ color: theme.palette.secondary.main, fontWeight: 600 }}>
                  {item.subtitle}
                </Typography>
              </Box>
            </Box>

            <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: { xs: 'flex-start', md: 'flex-end' }, gap: 0.5 }}>
              <Typography variant="caption" sx={{ fontSize: '0.85rem', fontWeight: 500, color: theme.palette.text.secondary }}>
                {item.date}
              </Typography>
              {item.location && (
                <Typography variant="caption" sx={{ fontSize: '0.85rem', color: theme.palette.text.secondary }}>
                  {item.location}
                </Typography>
              )}
            </Box>
          </Box>

          <Typography variant="body2" sx={{ color: theme.palette.text.secondary, lineHeight: 1.7, mb: 2 }}>
            {item.description}
          </Typography>

          {item.tags && item.tags.length > 0 && (
            <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1, mt: 2 }}>
              {item.tags.map((tag, i) => (
                <Chip
                  key={i}
                  label={tag}
                  size="small"
                  sx={{
                    backgroundColor: isDark ? alpha(theme.palette.secondary.main, 0.1) : alpha(theme.palette.secondary.main, 0.05),
                    color: isDark ? theme.palette.secondary.light : theme.palette.secondary.dark,
                    fontWeight: 500,
                    fontSize: '0.75rem',
                  }}
                />
              ))}
            </Box>
          )}
        </Paper>
      </motion.div>
    </Box>
  );
};

// Timeline Container for Education/Certs
const ModernTimeline: React.FC<{ items: TimelineItemData[] }> = ({ items }) => {
  if (!items || items.length === 0) {
    return <Box sx={{ textAlign: 'center', py: 8, opacity: 0.6 }}><Typography>No entries.</Typography></Box>;
  }

  return (
    <TimelineContainer>
      {items.map((item, index) => (
        <ModernTimelineCard key={index} item={item} index={index} />
      ))}
    </TimelineContainer>
  );
};

// Skill Bar Component (Unchanged)
const ModernSkillBar: React.FC<{ name: string; level: number; delay: number }> = ({ name, level, delay }) => {
  const theme = useTheme();
  const isDark = theme.palette.mode === 'dark';

  return (
    <Box sx={{ mb: 2.5 }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
        <Typography variant="body2" sx={{ fontWeight: 600 }}>{name}</Typography>
        <Typography variant="body2" color="primary">{level}%</Typography>
      </Box>
      <Box sx={{
        height: 8,
        width: '100%',
        bgcolor: isDark ? alpha(theme.palette.common.white, 0.05) : alpha(theme.palette.common.black, 0.05),
        borderRadius: 4,
        overflow: 'hidden'
      }}>
        <motion.div
          initial={{ width: 0 }}
          whileInView={{ width: `${level}%` }}
          viewport={{ once: true }}
          transition={{ duration: 1, delay, ease: "easeOut" }}
          style={{
            height: '100%',
            background: `linear-gradient(90deg, ${theme.palette.primary.main}, ${theme.palette.secondary.main})`,
            borderRadius: 4,
          }}
        />
      </Box>
    </Box>
  );
};

// --- Main Page Component ---
const Resume: React.FC = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const theme = useTheme();
  const isDark = theme.palette.mode === 'dark';
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

  const { data, loading } = usePortfolioData();
  const { workExperience, education, skills, certifications } = data;

  const [orderDesc, setOrderDesc] = useState(true);

  const tabKeys = useMemo(() => ['experience', 'education', 'skills', 'certifications'] as const, []);

  const getInitialTab = () => {
    // In this app, the URL hash is reserved for view state (#simplified / #universe),
    // so Resume tabs must NOT rely on location.hash.
    // We store the active tab in the query string instead: ?resume=skills
    const params = new URLSearchParams(location.search);
    const tabFromQuery = params.get('resume')?.toLowerCase();
    const idx = tabKeys.indexOf((tabFromQuery as any) ?? 'experience');
    if (idx >= 0) return idx;

    // Backwards-compatibility: if not in simplified view and hash was used before.
    const hash = location.hash.replace('#', '').toLowerCase();
    if (hash === 'education') return 1;
    if (hash === 'skills') return 2;
    if (hash === 'certifications') return 3;
    return 0;
  };

  const [tabValue, setTabValue] = useState(getInitialTab);

  useEffect(() => {
    setTabValue(getInitialTab());
  }, [location.search, location.hash]);

  // Certifications now loaded from DataContext (local JSON)

  const handleTabChange = (event: React.SyntheticEvent, newValue: number) => {
    setTabValue(newValue);
    const key = tabKeys[newValue] ?? 'experience';
    const params = new URLSearchParams(location.search);
    params.set('resume', key);

    // Preserve #simplified (or any existing hash) while updating query param.
    navigate(
      {
        pathname: location.pathname,
        search: `?${params.toString()}`,
        hash: location.hash,
      },
      { replace: true }
    );
  };

  const transformData = (items: any[], type: 'work' | 'education' | 'certification'): TimelineItemData[] => {
    if (!items) return [];

    const sorted = [...items].sort((a, b) => {
      const dateA = dateForSorting(a)?.valueOf() || 0;
      const dateB = dateForSorting(b)?.valueOf() || 0;
      return orderDesc ? dateB - dateA : dateA - dateB;
    });

    return sorted.map((item, index) => {
      let tags: string[] = [];
      if (type === 'work') tags = item.highlights || item.achievements || [];
      if (type === 'education') tags = item.achievements || [];
      if (type === 'certification') tags = item.skills || [];

      let dateStr = "";
      if (item.startDate && item.endDate) dateStr = `${item.startDate} - ${item.endDate}`;
      else if (item.issueDate) dateStr = item.issueDate;
      else dateStr = item.date || "";

      return {
        id: item._id || index,
        title: item.title || item.degree || "",
        subtitle: item.company || item.institution || item.issuer || "",
        date: dateStr,
        location: item.location || (item.credentialId ? `ID: ${item.credentialId}` : ""),
        description: item.description || "",
        tags: Array.isArray(tags) ? tags : [],
        isCurrent: item.current || false
      };
    });
  };

  const timelineExperience = useMemo(() => transformData(workExperience || [], 'work'), [workExperience, orderDesc]);
  const timelineEducation = useMemo(() => transformData(education || [], 'education'), [education, orderDesc]);
  const timelineCertifications = useMemo(() => transformData(certifications || [], 'certification'), [certifications, orderDesc]);

  const technicalSkills = Array.isArray(skills?.technical) ? skills.technical : [];
  const softSkills = Array.isArray(skills?.soft) ? skills.soft : [];

  const tabProps = {
    sx: {
      textTransform: 'none',
      fontWeight: 600,
      fontSize: '1rem',
      minHeight: 48,
    }
  };

  if (loading && timelineExperience.length === 0) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '50vh' }}>
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Box sx={{ width: '100%', maxWidth: 1200, mx: 'auto', px: { xs: 2, sm: 4 }, py: 4 }}>
      {/* Header Area */}
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 4, flexWrap: 'wrap', gap: 2 }}>
        <Tabs
          value={tabValue}
          onChange={handleTabChange}
          variant={isMobile ? "scrollable" : "standard"}
          scrollButtons="auto"
          sx={{
            '& .MuiTabs-indicator': {
              height: 3,
              borderRadius: '3px 3px 0 0',
              background: `linear-gradient(90deg, ${theme.palette.primary.main}, ${theme.palette.secondary.main})`
            }
          }}
        >
          <Tab icon={<WorkIcon fontSize="small" />} iconPosition="start" label="Experience" {...tabProps} />
          <Tab icon={<SchoolIcon fontSize="small" />} iconPosition="start" label="Education" {...tabProps} />
          <Tab icon={<CodeIcon fontSize="small" />} iconPosition="start" label="Skills" {...tabProps} />
          <Tab icon={<AchievementsIcon fontSize="small" />} iconPosition="start" label="Certifications" {...tabProps} />
        </Tabs>

        <Box sx={{ display: 'flex', gap: 1 }}>
          <Button
            startIcon={<DownloadIcon />}
            variant="contained"
            color="primary"
            href={`${process.env.PUBLIC_URL}/uploads/divyam_resume.pdf`}
            download
            sx={{ borderRadius: 20, textTransform: 'none', fontWeight: 600 }}
          >
            Download CV
          </Button>
        </Box>
      </Box>

      {/* Improved Sort Button */}
      {tabValue !== 2 && (
        <Box sx={{ display: 'flex', justifyContent: 'flex-end', mb: 2 }}>
          <Button
            size="small"
            startIcon={<SortIcon />}
            variant="outlined"
            onClick={() => setOrderDesc(!orderDesc)}
            sx={{
              textTransform: 'none',
              borderRadius: 4,
              borderColor: alpha(theme.palette.text.secondary, 0.3),
              color: theme.palette.text.secondary,
              '&:hover': {
                borderColor: theme.palette.primary.main,
                color: theme.palette.primary.main,
                bgcolor: alpha(theme.palette.primary.main, 0.05)
              }
            }}
          >
            {orderDesc ? "Newest First" : "Oldest First"}
          </Button>
        </Box>
      )}

      {/* Content Area */}
      <AnimatePresence mode="wait">
        <motion.div
          key={tabValue}
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -20 }}
          transition={{ duration: 0.3 }}
        >
          {/* TAB 0: EXPERIENCE */}
          <TabPanel value={tabValue} index={0}>
            <ExperienceAccordion items={timelineExperience} />
          </TabPanel>

          {/* TAB 1: EDUCATION */}
          <TabPanel value={tabValue} index={1}>
            <ModernTimeline items={timelineEducation} />
          </TabPanel>

          {/* TAB 2: SKILLS */}
          <TabPanel value={tabValue} index={2}>
            <Grid container spacing={4}>
              <Grid item xs={12} md={6}>
                <Paper sx={{ p: 4, borderRadius: 4, height: '100%', bgcolor: isDark ? alpha(theme.palette.background.paper, 0.4) : alpha(theme.palette.background.paper, 0.8) }}>
                  <Typography variant="h6" sx={{ mb: 3, fontWeight: 700, display: 'flex', alignItems: 'center', gap: 1 }}>
                    <CodeIcon color="primary" /> Technical Proficiency
                  </Typography>
                  {technicalSkills.map((skill: any, i: number) => (
                    <ModernSkillBar key={i} name={skill.name} level={skill.level} delay={i * 0.1} />
                  ))}
                </Paper>
              </Grid>
              <Grid item xs={12} md={6}>
                <Paper sx={{ p: 4, borderRadius: 4, height: '100%', bgcolor: isDark ? alpha(theme.palette.background.paper, 0.4) : alpha(theme.palette.background.paper, 0.8) }}>
                  <Typography variant="h6" sx={{ mb: 3, fontWeight: 700, display: 'flex', alignItems: 'center', gap: 1 }}>
                    <AchievementsIcon color="secondary" /> Soft Skills
                  </Typography>
                  {softSkills.map((skill: any, i: number) => (
                    <ModernSkillBar key={i} name={skill.name} level={skill.level} delay={i * 0.1} />
                  ))}
                </Paper>
              </Grid>
            </Grid>
          </TabPanel>

          {/* TAB 3: CERTIFICATIONS */}
          <TabPanel value={tabValue} index={3}>
            <ModernTimeline items={timelineCertifications} />
          </TabPanel>
        </motion.div>
      </AnimatePresence>
    </Box>
  );
};

export default Resume;