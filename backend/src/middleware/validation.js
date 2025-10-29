const { body, validationResult } = require('express-validator');

/**
 * Middleware to check validation results
 */
const validate = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({
      success: false,
      errors: errors.array().map(err => ({
        field: err.param,
        message: err.msg
      }))
    });
  }
  next();
};

/**
 * Validation rules for different resources
 */
const validationRules = {
  // Personal Info validation
  personalInfo: [
    body('name').trim().notEmpty().withMessage('Name is required'),
    body('title').trim().notEmpty().withMessage('Professional title is required'),
    body('email').isEmail().withMessage('Valid email is required'),
    body('phone').optional().trim(),
    body('location').optional().trim(),
    body('bio').optional().trim()
  ],

  // Project validation
  project: [
    body('title').trim().notEmpty().withMessage('Project title is required'),
    body('description').trim().notEmpty().withMessage('Project description is required'),
    body('technologies').isArray().withMessage('Technologies must be an array'),
    body('featured').optional().isBoolean().withMessage('Featured must be a boolean')
  ],

  // Experience validation
  experience: [
    body('title').trim().notEmpty().withMessage('Job title is required'),
    body('company').trim().notEmpty().withMessage('Company name is required'),
    body('location').trim().notEmpty().withMessage('Location is required'),
    body('startDate').trim().notEmpty().withMessage('Start date is required'),
    body('description').trim().notEmpty().withMessage('Job description is required')
  ],

  // Education validation
  education: [
    body('degree').trim().notEmpty().withMessage('Degree name is required'),
    body('institution').trim().notEmpty().withMessage('Institution name is required'),
    body('location').trim().notEmpty().withMessage('Location is required'),
    body('startDate').trim().notEmpty().withMessage('Start date is required'),
    body('endDate').trim().notEmpty().withMessage('End date is required')
  ],

  // Skill validation
  skill: [
    body('name').trim().notEmpty().withMessage('Skill name is required'),
    body('level').optional().isInt({ min: 0, max: 100 }).withMessage('Level must be between 0 and 100'),
    body('category').isIn(['technical', 'soft', 'language']).withMessage('Invalid category')
  ],

  // Contact form validation
  contact: [
    body('name').trim().notEmpty().withMessage('Name is required'),
    body('email').isEmail().withMessage('Valid email is required'),
    body('subject').trim().notEmpty().withMessage('Subject is required'),
    body('message').trim().notEmpty().withMessage('Message is required')
  ],

  // Admin login validation
  login: [
    body('username').trim().notEmpty().withMessage('Username is required'),
    body('password').notEmpty().withMessage('Password is required')
  ]
};

module.exports = { validate, validationRules };

