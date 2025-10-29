const express = require('express');
const router = express.Router();
const {
  updatePersonalInfo,
  createProject,
  updateProject,
  deleteProject,
  getAllProjects,
  createExperience,
  updateExperience,
  deleteExperience,
  createEducation,
  updateEducation,
  deleteEducation,
  createSkill,
  updateSkill,
  deleteSkill,
  getContacts,
  updateContactStatus,
  deleteContact,
  createCertification,
  updateCertification,
  deleteCertification,
  getAllCertifications,
  reorderCertifications,
  createQuote,
  updateQuote,
  deleteQuote,
  getAllQuotes
} = require('../controllers/adminController');
const { protect } = require('../middleware/auth');
const { validate, validationRules } = require('../middleware/validation');

// All routes are protected
router.use(protect);

// Personal Info
router.put('/personal-info', validationRules.personalInfo, validate, updatePersonalInfo);

// Projects
router.get('/projects', getAllProjects);
router.post('/projects', validationRules.project, validate, createProject);
router.put('/projects/:id', validationRules.project, validate, updateProject);
router.delete('/projects/:id', deleteProject);

// Experience
router.post('/experience', validationRules.experience, validate, createExperience);
router.put('/experience/:id', validationRules.experience, validate, updateExperience);
router.delete('/experience/:id', deleteExperience);

// Education
router.post('/education', validationRules.education, validate, createEducation);
router.put('/education/:id', validationRules.education, validate, updateEducation);
router.delete('/education/:id', deleteEducation);

// Skills
router.post('/skills', validationRules.skill, validate, createSkill);
router.put('/skills/:id', validationRules.skill, validate, updateSkill);
router.delete('/skills/:id', deleteSkill);

// Contact Messages
router.get('/contacts', getContacts);
router.put('/contacts/:id', updateContactStatus);
router.delete('/contacts/:id', deleteContact);

// Certifications
router.get('/certifications', getAllCertifications);
router.post('/certifications', createCertification);
router.put('/certifications/reorder', reorderCertifications);
router.put('/certifications/:id', updateCertification);
router.delete('/certifications/:id', deleteCertification);

// Quotes
router.get('/quotes', getAllQuotes);
router.post('/quotes', createQuote);
router.put('/quotes/:id', updateQuote);
router.delete('/quotes/:id', deleteQuote);

module.exports = router;

