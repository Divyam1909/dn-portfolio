const PersonalInfo = require('../models/PersonalInfo');
const Project = require('../models/Project');
const Experience = require('../models/Experience');
const Education = require('../models/Education');
const Skill = require('../models/Skill');
const Contact = require('../models/Contact');
const Certification = require('../models/Certification');
const Quote = require('../models/Quote');

/**
 * @desc    Get all portfolio data
 * @route   GET /api/portfolio
 * @access  Public
 */
const getPortfolioData = async (req, res, next) => {
  try {
    const [personalInfo, projects, experiences, education, skills] = await Promise.all([
      PersonalInfo.findOne(),
      Project.find({ status: 'active' }).sort({ order: 1, createdAt: -1 }),
      Experience.find().sort({ current: -1, order: 1 }),
      Education.find().sort({ order: 1 }),
      Skill.find().sort({ category: 1, order: 1 })
    ]);

    // Organize skills by category
    const organizedSkills = {
      technical: skills.filter(s => s.category === 'technical').map(s => ({ name: s.name, level: s.level })),
      soft: skills.filter(s => s.category === 'soft').map(s => s.name),
      languages: skills.filter(s => s.category === 'language').map(s => ({ name: s.name, proficiency: s.proficiency }))
    };

    res.json({
      success: true,
      data: {
        personalInfo: personalInfo || {},
        projects,
        workExperience: experiences,
        education,
        skills: organizedSkills
      }
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Get personal info
 * @route   GET /api/personal-info
 * @access  Public
 */
const getPersonalInfo = async (req, res, next) => {
  try {
    const personalInfo = await PersonalInfo.findOne();
    res.json({
      success: true,
      data: personalInfo || {}
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Get all projects
 * @route   GET /api/projects
 * @access  Public
 */
const getProjects = async (req, res, next) => {
  try {
    const projects = await Project.find({ status: 'active' }).sort({ order: 1, createdAt: -1 });
    res.json({
      success: true,
      count: projects.length,
      data: projects
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Get single project
 * @route   GET /api/projects/:id
 * @access  Public
 */
const getProject = async (req, res, next) => {
  try {
    const project = await Project.findById(req.params.id);
    if (!project) {
      return res.status(404).json({
        success: false,
        message: 'Project not found'
      });
    }
    res.json({
      success: true,
      data: project
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Get all work experiences
 * @route   GET /api/experience
 * @access  Public
 */
const getExperiences = async (req, res, next) => {
  try {
    const experiences = await Experience.find().sort({ current: -1, order: 1 });
    res.json({
      success: true,
      count: experiences.length,
      data: experiences
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Get all education
 * @route   GET /api/education
 * @access  Public
 */
const getEducation = async (req, res, next) => {
  try {
    const education = await Education.find().sort({ order: 1 });
    res.json({
      success: true,
      count: education.length,
      data: education
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Get all skills
 * @route   GET /api/skills
 * @access  Public
 */
const getSkills = async (req, res, next) => {
  try {
    const skills = await Skill.find().sort({ category: 1, order: 1 });
    
    // Organize by category
    const organizedSkills = {
      technical: skills.filter(s => s.category === 'technical'),
      soft: skills.filter(s => s.category === 'soft'),
      languages: skills.filter(s => s.category === 'language')
    };

    res.json({
      success: true,
      data: organizedSkills
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Submit contact form
 * @route   POST /api/contact
 * @access  Public
 */
const submitContact = async (req, res, next) => {
  try {
    const { name, email, subject, message } = req.body;

    // Get IP address
    const ipAddress = req.ip || req.connection.remoteAddress;

    const contact = await Contact.create({
      name,
      email,
      subject,
      message,
      ipAddress
    });

    // TODO: Send email notification (optional)

    res.status(201).json({
      success: true,
      message: 'Message sent successfully',
      data: contact
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getPortfolioData,
  getPersonalInfo,
  getProjects,
  getProject,
  getExperiences,
  getEducation,
  getSkills,
  submitContact
};

/**
 * @desc    Get certifications
 * @route   GET /api/certifications
 * @access  Public
 */
const getCertifications = async (req, res, next) => {
  try {
    const certifications = await Certification.find().sort({ order: 1, issueDate: -1 });
    res.json({
      success: true,
      data: certifications
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Get random quote
 * @route   GET /api/quotes/random
 * @access  Public
 */
const getRandomQuote = async (req, res, next) => {
  try {
    const { category } = req.query;
    const query = { isActive: true };
    
    if (category) {
      query.category = category;
    }
    
    const count = await Quote.countDocuments(query);
    
    if (count === 0) {
      // Return a default hardcoded quote if no quotes in database
      return res.json({
        success: true,
        data: {
          text: "The cosmos is within us. We are made of star-stuff. We are a way for the universe to know itself.",
          author: "Carl Sagan",
          category: "universe"
        }
      });
    }
    
    const random = Math.floor(Math.random() * count);
    const quote = await Quote.findOne(query).skip(random);
    
    res.json({
      success: true,
      data: quote
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Get all quotes
 * @route   GET /api/quotes
 * @access  Public
 */
const getQuotes = async (req, res, next) => {
  try {
    const { category } = req.query;
    const query = { isActive: true };
    
    if (category) {
      query.category = category;
    }
    
    const quotes = await Quote.find(query).sort({ order: 1, createdAt: -1 });
    res.json({
      success: true,
      data: quotes
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
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
};

