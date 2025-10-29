const express = require('express');
const router = express.Router();
const {
  getPortfolioData,
  getPersonalInfo,
  getProjects,
  getProject,
  getExperiences,
  getEducation,
  getSkills,
  submitContact,
  getCertifications,
  getRandomQuote,
  getQuotes
} = require('../controllers/portfolioController');
const { validate, validationRules } = require('../middleware/validation');

// Public routes
router.get('/portfolio', getPortfolioData);
router.get('/personal-info', getPersonalInfo);
router.get('/projects', getProjects);
router.get('/projects/:id', getProject);
router.get('/experience', getExperiences);
router.get('/education', getEducation);
router.get('/skills', getSkills);
router.get('/certifications', getCertifications);
router.get('/quotes/random', getRandomQuote);
router.get('/quotes', getQuotes);
router.post('/contact', validationRules.contact, validate, submitContact);

module.exports = router;

