// import React, { useState } from 'react';
// import { useNavigate } from 'react-router-dom';
// import {
//   Box,
//   Container,
//   Paper,
//   Typography,
//   Tabs,
//   Tab,
//   Button,
//   Alert,
// } from '@mui/material';
// import {
//   Dashboard as DashboardIcon,
//   Person as PersonIcon,
//   Work as WorkIcon,
//   School as SchoolIcon,
//   Code as CodeIcon,
//   Email as EmailIcon,
//   ExitToApp as LogoutIcon,
//   EmojiEvents as CertIcon,
// } from '@mui/icons-material';
// import { useAdmin } from '../../contexts/AdminContext';
// import PersonalInfoEditor from './components/PersonalInfoEditor';
// import ProjectEditor from './components/ProjectEditorEnhanced';
// import ExperienceEditor from './components/ExperienceEditor';
// import EducationEditor from './components/EducationEditor';
// import SkillsEditor from './components/SkillsEditor';
// import ContactViewer from './components/ContactViewer';
// import CertificationEditor from './components/CertificationEditor';

// interface TabPanelProps {
//   children?: React.ReactNode;
//   index: number;
//   value: number;
// }

// const TabPanel: React.FC<TabPanelProps> = ({ children, value, index }) => {
//   return (
//     <div role="tabpanel" hidden={value !== index}>
//       {value === index && <Box sx={{ py: 3 }}>{children}</Box>}
//     </div>
//   );
// };

// const AdminDashboard: React.FC = () => {
//   const navigate = useNavigate();
//   const { admin, logout, isAuthenticated } = useAdmin();
//   const [tabValue, setTabValue] = useState(0);

//   // Redirect if not authenticated
//   React.useEffect(() => {
//     if (!isAuthenticated) {
//       navigate(`/${process.env.REACT_APP_ADMIN_PATH}/${process.env.REACT_APP_ADMIN_PASSWORD_PATH}`);
//     }
//   }, [isAuthenticated, navigate]);

//   const handleTabChange = (event: React.SyntheticEvent, newValue: number) => {
//     setTabValue(newValue);
//   };

//   const handleLogout = () => {
//     logout();
//     navigate('/');
//   };

//   if (!isAuthenticated) {
//     return null;
//   }

//   return (
//     <Box sx={{ minHeight: '100vh', bgcolor: 'background.default', py: 4 }}>
//       <Container maxWidth="xl">
//         {/* Header */}
//         <Paper sx={{ p: 3, mb: 3 }}>
//           <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
//             <Box>
//               <Typography variant="h4" gutterBottom fontWeight={700}>
//                 <DashboardIcon sx={{ mr: 1, verticalAlign: 'middle' }} />
//                 Admin Dashboard
//               </Typography>
//               <Typography variant="body2" color="text.secondary">
//                 Welcome back, {admin?.username}!
//               </Typography>
//             </Box>
//             <Button
//               variant="outlined"
//               color="error"
//               startIcon={<LogoutIcon />}
//               onClick={handleLogout}
//             >
//               Logout
//             </Button>
//           </Box>
//         </Paper>

//         {/* Info Alert */}
//         <Alert severity="info" sx={{ mb: 3 }}>
//           Manage your portfolio content below. Changes are saved to the database and will be visible on your public portfolio immediately.
//         </Alert>

//         {/* Tabs Navigation */}
//         <Paper sx={{ mb: 3 }}>
//           <Tabs
//             value={tabValue}
//             onChange={handleTabChange}
//             variant="scrollable"
//             scrollButtons="auto"
//             sx={{ borderBottom: 1, borderColor: 'divider' }}
//           >
//             <Tab icon={<PersonIcon />} label="Personal Info" />
//             <Tab icon={<WorkIcon />} label="Projects" />
//             <Tab icon={<WorkIcon />} label="Experience" />
//             <Tab icon={<SchoolIcon />} label="Education" />
//             <Tab icon={<CodeIcon />} label="Skills" />
//             <Tab icon={<CertIcon />} label="Certifications" />
//             <Tab icon={<EmailIcon />} label="Contact Messages" />
//           </Tabs>
//         </Paper>

//         {/* Tab Panels */}
//         <TabPanel value={tabValue} index={0}>
//           <PersonalInfoEditor />
//         </TabPanel>
        
//         <TabPanel value={tabValue} index={1}>
//           <ProjectEditor />
//         </TabPanel>
        
//         <TabPanel value={tabValue} index={2}>
//           <ExperienceEditor />
//         </TabPanel>
        
//         <TabPanel value={tabValue} index={3}>
//           <EducationEditor />
//         </TabPanel>
        
//         <TabPanel value={tabValue} index={4}>
//           <SkillsEditor />
//         </TabPanel>
        
//         <TabPanel value={tabValue} index={5}>
//           <CertificationEditor />
//         </TabPanel>
        
//         <TabPanel value={tabValue} index={6}>
//           <ContactViewer />
//         </TabPanel>
//       </Container>
//     </Box>
//   );
// };

// export default AdminDashboard;

export {}