const PersonalInfo = require('../models/PersonalInfo');
const Project = require('../models/Project');
const Experience = require('../models/Experience');
const Education = require('../models/Education');
const Skill = require('../models/Skill');
const Contact = require('../models/Contact');
const Certification = require('../models/Certification');
const Quote = require('../models/Quote');

// ==================== PERSONAL INFO ====================

/**
 * @desc    Update personal info
 * @route   PUT /api/admin/personal-info
 * @access  Private
 */
const updatePersonalInfo = async (req, res, next) => {
  try {
    let personalInfo = await PersonalInfo.findOne();

    if (personalInfo) {
      // Update existing
      personalInfo = await PersonalInfo.findByIdAndUpdate(
        personalInfo._id,
        req.body,
        { new: true, runValidators: true }
      );
    } else {
      // Create new
      personalInfo = await PersonalInfo.create(req.body);
    }

    res.json({
      success: true,
      message: 'Personal info updated successfully',
      data: personalInfo
    });
  } catch (error) {
    next(error);
  }
};

// ==================== PROJECTS ====================

/**
 * @desc    Create project
 * @route   POST /api/admin/projects
 * @access  Private
 */
const createProject = async (req, res, next) => {
  try {
    const project = await Project.create(req.body);
    res.status(201).json({
      success: true,
      message: 'Project created successfully',
      data: project
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Update project
 * @route   PUT /api/admin/projects/:id
 * @access  Private
 */
const updateProject = async (req, res, next) => {
  try {
    const project = await Project.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );

    if (!project) {
      return res.status(404).json({
        success: false,
        message: 'Project not found'
      });
    }

    res.json({
      success: true,
      message: 'Project updated successfully',
      data: project
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Delete project
 * @route   DELETE /api/admin/projects/:id
 * @access  Private
 */
const deleteProject = async (req, res, next) => {
  try {
    const project = await Project.findByIdAndDelete(req.params.id);

    if (!project) {
      return res.status(404).json({
        success: false,
        message: 'Project not found'
      });
    }

    res.json({
      success: true,
      message: 'Project deleted successfully'
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Get all projects (including drafts and archived)
 * @route   GET /api/admin/projects
 * @access  Private
 */
const getAllProjects = async (req, res, next) => {
  try {
    const projects = await Project.find().sort({ order: 1, createdAt: -1 });
    res.json({
      success: true,
      count: projects.length,
      data: projects
    });
  } catch (error) {
    next(error);
  }
};

// ==================== EXPERIENCE ====================

/**
 * @desc    Create experience
 * @route   POST /api/admin/experience
 * @access  Private
 */
const createExperience = async (req, res, next) => {
  try {
    const experience = await Experience.create(req.body);
    res.status(201).json({
      success: true,
      message: 'Experience created successfully',
      data: experience
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Update experience
 * @route   PUT /api/admin/experience/:id
 * @access  Private
 */
const updateExperience = async (req, res, next) => {
  try {
    const experience = await Experience.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );

    if (!experience) {
      return res.status(404).json({
        success: false,
        message: 'Experience not found'
      });
    }

    res.json({
      success: true,
      message: 'Experience updated successfully',
      data: experience
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Delete experience
 * @route   DELETE /api/admin/experience/:id
 * @access  Private
 */
const deleteExperience = async (req, res, next) => {
  try {
    const experience = await Experience.findByIdAndDelete(req.params.id);

    if (!experience) {
      return res.status(404).json({
        success: false,
        message: 'Experience not found'
      });
    }

    res.json({
      success: true,
      message: 'Experience deleted successfully'
    });
  } catch (error) {
    next(error);
  }
};

// ==================== EDUCATION ====================

/**
 * @desc    Create education
 * @route   POST /api/admin/education
 * @access  Private
 */
const createEducation = async (req, res, next) => {
  try {
    const education = await Education.create(req.body);
    res.status(201).json({
      success: true,
      message: 'Education created successfully',
      data: education
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Update education
 * @route   PUT /api/admin/education/:id
 * @access  Private
 */
const updateEducation = async (req, res, next) => {
  try {
    const education = await Education.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );

    if (!education) {
      return res.status(404).json({
        success: false,
        message: 'Education not found'
      });
    }

    res.json({
      success: true,
      message: 'Education updated successfully',
      data: education
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Delete education
 * @route   DELETE /api/admin/education/:id
 * @access  Private
 */
const deleteEducation = async (req, res, next) => {
  try {
    const education = await Education.findByIdAndDelete(req.params.id);

    if (!education) {
      return res.status(404).json({
        success: false,
        message: 'Education not found'
      });
    }

    res.json({
      success: true,
      message: 'Education deleted successfully'
    });
  } catch (error) {
    next(error);
  }
};

// ==================== SKILLS ====================

/**
 * @desc    Create skill
 * @route   POST /api/admin/skills
 * @access  Private
 */
const createSkill = async (req, res, next) => {
  try {
    const skill = await Skill.create(req.body);
    res.status(201).json({
      success: true,
      message: 'Skill created successfully',
      data: skill
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Update skill
 * @route   PUT /api/admin/skills/:id
 * @access  Private
 */
const updateSkill = async (req, res, next) => {
  try {
    const skill = await Skill.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );

    if (!skill) {
      return res.status(404).json({
        success: false,
        message: 'Skill not found'
      });
    }

    res.json({
      success: true,
      message: 'Skill updated successfully',
      data: skill
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Delete skill
 * @route   DELETE /api/admin/skills/:id
 * @access  Private
 */
const deleteSkill = async (req, res, next) => {
  try {
    const skill = await Skill.findByIdAndDelete(req.params.id);

    if (!skill) {
      return res.status(404).json({
        success: false,
        message: 'Skill not found'
      });
    }

    res.json({
      success: true,
      message: 'Skill deleted successfully'
    });
  } catch (error) {
    next(error);
  }
};

// ==================== CONTACT MESSAGES ====================

/**
 * @desc    Get all contact messages
 * @route   GET /api/admin/contacts
 * @access  Private
 */
const getContacts = async (req, res, next) => {
  try {
    const { status } = req.query;
    const filter = status ? { status } : {};
    
    const contacts = await Contact.find(filter).sort({ createdAt: -1 });
    res.json({
      success: true,
      count: contacts.length,
      data: contacts
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Update contact message status
 * @route   PUT /api/admin/contacts/:id
 * @access  Private
 */
const updateContactStatus = async (req, res, next) => {
  try {
    const { status, replied } = req.body;
    const update = { status };
    
    if (replied) {
      update.replied = true;
      update.replyDate = new Date();
    }

    const contact = await Contact.findByIdAndUpdate(
      req.params.id,
      update,
      { new: true }
    );

    if (!contact) {
      return res.status(404).json({
        success: false,
        message: 'Contact message not found'
      });
    }

    res.json({
      success: true,
      message: 'Contact status updated',
      data: contact
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Delete contact message
 * @route   DELETE /api/admin/contacts/:id
 * @access  Private
 */
const deleteContact = async (req, res, next) => {
  try {
    const contact = await Contact.findByIdAndDelete(req.params.id);

    if (!contact) {
      return res.status(404).json({
        success: false,
        message: 'Contact message not found'
      });
    }

    res.json({
      success: true,
      message: 'Contact message deleted successfully'
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
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
  deleteContact
};

// ==================== CERTIFICATIONS ====================

/**
 * @desc    Create certification
 * @route   POST /api/admin/certifications
 * @access  Private
 */
const createCertification = async (req, res, next) => {
  try {
    const certification = await Certification.create(req.body);
    res.status(201).json({
      success: true,
      data: certification
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Update certification
 * @route   PUT /api/admin/certifications/:id
 * @access  Private
 */
const updateCertification = async (req, res, next) => {
  try {
    const certification = await Certification.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );

    if (!certification) {
      return res.status(404).json({
        success: false,
        message: 'Certification not found'
      });
    }

    res.json({
      success: true,
      data: certification
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Delete certification
 * @route   DELETE /api/admin/certifications/:id
 * @access  Private
 */
const deleteCertification = async (req, res, next) => {
  try {
    const certification = await Certification.findByIdAndDelete(req.params.id);

    if (!certification) {
      return res.status(404).json({
        success: false,
        message: 'Certification not found'
      });
    }

    res.json({
      success: true,
      message: 'Certification deleted'
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Get all certifications (for admin)
 * @route   GET /api/admin/certifications
 * @access  Private
 */
const getAllCertifications = async (req, res, next) => {
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
 * @desc    Update certification order
 * @route   PUT /api/admin/certifications/reorder
 * @access  Private
 */
const reorderCertifications = async (req, res, next) => {
  try {
    const { certifications } = req.body;
    
    // Update order for each certification
    const updatePromises = certifications.map((cert, index) =>
      Certification.findByIdAndUpdate(cert._id, { order: index })
    );

    await Promise.all(updatePromises);

    res.json({
      success: true,
      message: 'Certifications reordered successfully'
    });
  } catch (error) {
    next(error);
  }
};

// ==================== QUOTES ====================

/**
 * @desc    Create quote
 * @route   POST /api/admin/quotes
 * @access  Private
 */
const createQuote = async (req, res, next) => {
  try {
    const quote = await Quote.create(req.body);
    res.status(201).json({
      success: true,
      data: quote,
      message: 'Quote created successfully'
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Update quote
 * @route   PUT /api/admin/quotes/:id
 * @access  Private
 */
const updateQuote = async (req, res, next) => {
  try {
    const quote = await Quote.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );

    if (!quote) {
      const error = new Error('Quote not found');
      error.statusCode = 404;
      throw error;
    }

    res.json({
      success: true,
      data: quote,
      message: 'Quote updated successfully'
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Delete quote
 * @route   DELETE /api/admin/quotes/:id
 * @access  Private
 */
const deleteQuote = async (req, res, next) => {
  try {
    const quote = await Quote.findByIdAndDelete(req.params.id);

    if (!quote) {
      const error = new Error('Quote not found');
      error.statusCode = 404;
      throw error;
    }

    res.json({
      success: true,
      message: 'Quote deleted successfully'
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Get all quotes
 * @route   GET /api/admin/quotes
 * @access  Private
 */
const getAllQuotes = async (req, res, next) => {
  try {
    const quotes = await Quote.find().sort({ order: 1, createdAt: -1 });
    res.json({
      success: true,
      data: quotes
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
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
};

