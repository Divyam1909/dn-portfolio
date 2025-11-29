/**
 * PORTFOLIO DATA CONFIGURATION
 * 
 * This file contains all the configurable content for your portfolio.
 * Edit the values below to customize your portfolio website.
 */

// ======= PERSONAL INFORMATION =======
export const personalInfo = {
  name: "Divyam Navin",
  title: "Full Stack Web Developer",
  email: "divyamnavin@gmail.com",
  phone: "",
  location: "Thane, Maharashtra, India",
  profileImage: "",
  bio: "Passionate full-stack developer with expertise in React, Node.js, and modern web technologies. I love building beautiful, performant, and user-friendly applications.",
  // Social links embedded in personal info for easier access
  socialLinks: {
    github: "https://github.com/divyamnavin",
    linkedin: "https://linkedin.com/in/divyamnavin",
    twitter: "",
    instagram: "",
    website: ""
  }
};

// ======= SOCIAL LINKS (Legacy - kept for backward compatibility) =======
export const socialLinks = {
  github: "https://github.com/divyamnavin",
  linkedin: "https://linkedin.com/in/divyamnavin",
  twitter: "",
  instagram: "",
};

// ======= EDUCATION =======
// Education entries are loaded from MongoDB
export const education: any[] = [];

// ======= WORK EXPERIENCE =======
// Work experience entries are loaded from MongoDB
export const workExperience: any[] = [];

// ======= SKILLS =======
// Skills are loaded from MongoDB
export const skills = {
  technical: [] as any[],
  soft: [] as string[],
  languages: [] as any[],
};

// ======= PROJECTS =======
// Projects are loaded from MongoDB
export const projects: any[] = [];

// ======= GUIDE MESSAGES =======
export const guideMessages = {
  intro: [
    "Hey there! I'm Pixel, your portfolio guide! 👋",
    "I'm here to help you navigate through this awesome portfolio.",
    "Click 'Next' to learn about the different sections, or interact with me by clicking the buttons below!",
    "Home: Welcome to the portfolio! This page showcases highlights and quick navigation links.",
    "About: Learn about the developer's professional journey, skills, and background.",
    "Resume: View the full professional experience, skills, and qualifications.",
    "Projects: Explore a showcase of projects with detailed descriptions and technologies used.",
    "Contact: Reach out directly for collaborations, job opportunities, or questions!"
  ],
  about: [
    "The 'About' section shares the professional journey and skills.",
    "You'll find information about education, experience, and technical expertise.",
    "Want to know more about the person behind the work? Check it out!"
  ],
  resume: [
    "Need to see qualifications at a glance? Head to the 'Resume' section!",
    "It includes work history, education, and technical skills.",
    "Perfect for getting a complete picture of professional experience."
  ],
  projects: [
    "The 'Projects' section showcases the best work samples.",
    "Each project has details about technologies used and challenges overcome.",
    "It's the best place to see skills in action!"
  ],
  contact: [
    "Ready to connect? Visit the 'Contact' section.",
    "You can send a message directly or find links to social profiles.",
    "Don't be shy, reach out with any opportunities or questions!"
  ]
};

// ======= CHARACTER SETTINGS =======
export const characterSettings = {
  defaultCharacter: 'dog',
  characterColors: {
    dog: {
      primary: '#8B4513',
      secondary: '#D2B48C',
    },
    cat: {
      primary: '#808080',
      secondary: '#D3D3D3',
    },
    rabbit: {
      primary: '#6A5ACD',
      secondary: '#E6E6FA',
    },
    hamster: {
      primary: '#CD853F',
      secondary: '#F5DEB3',
    },
    fox: {
      primary: '#FF6347',
      secondary: '#FFE4B5',
    }
  },
  animations: {
    idleFrameRate: 15,
    moveFrameRate: 12,
  },
};

// ======= THEME SETTINGS =======
export const themeSettings = {
  light: {
    primary: '#3f51b5',
    secondary: '#f50057',
    background: '#e3f2fd',
    text: '#333333',
  },
  dark: {
    primary: '#7986cb',
    secondary: '#ff4081',
    background: '#121212',
    text: '#ffffff',
  },
  font: {
    primary: "'Roboto', sans-serif",
    secondary: "'Poppins', sans-serif",
  },
};

// ======= SEO SETTINGS =======
export const seoSettings = {
  title: "Divyam Navin - Full Stack Web Developer",
  description: "Portfolio of Divyam Navin, a Full Stack Web Developer specializing in React, Node.js, and modern web technologies.",
  keywords: "web developer, portfolio, react, frontend, javascript, typescript, node.js, full stack",
  ogImage: "",
  twitterHandle: "",
};

// ======= CONTACT FORM =======
// Contact form submissions are handled by the backend API
export const contactForm = {
  enableEmailService: true,
  emailServiceProvider: "backend", // Using backend API for contact form
  emailServiceId: "", // Not needed when using backend
  emailTemplateId: "", // Not needed when using backend
  emailUserId: "", // Not needed when using backend
  fields: [
    { name: "name", label: "Full Name", type: "text", required: true },
    { name: "email", label: "Email Address", type: "email", required: true },
    { name: "subject", label: "Subject", type: "text", required: true },
    { name: "message", label: "Message", type: "textarea", required: true },
  ],
  submitButtonText: "Send Message",
  successMessage: "Thank you! Your message has been sent.",
  errorMessage: "Oops! Something went wrong. Please try again.",
};

// ======= INTERACTIVE FEATURES =======
export const interactiveFeatures = {
  // Background particles
  enableParticles: true,
  particleSettings: {
    particleCount: 50,
    particleColor: '#3f51b5',
    darkModeParticleColor: '#7986cb',
    speed: 1, // 0.5 to 2
    connectParticles: true,
    responsive: [
      {
        breakpoint: 768,
        options: { particleCount: 30 }
      },
      {
        breakpoint: 425,
        options: { particleCount: 15 }
      }
    ]
  },
  
  // 3D characters settings
  characters: {
    enableHoverEffects: true,
    enableClickInteractions: true,
    unlockableCharacters: [
      {
        type: 'alien',
        requiredInteractions: 5,
        position: 'bottom-right',
      },
      {
        type: 'ninja',
        requiredInteractions: 10,
        position: 'top-right',
      }
    ]
  },
  
  // Page transitions
  pageTransitions: {
    enableTransitions: true,
    transitionType: 'fade', // fade, slide, zoom
    transitionDuration: 0.3, // seconds
  },
  
  // Easter eggs
  easterEggs: {
    enableEasterEggs: true,
    konamiCode: {
      enabled: true,
      reward: 'confetti' // confetti, character, theme
    },
    specialDates: [
      {
        date: '01-01', // MM-DD format
        effect: 'confetti',
        message: 'Happy New Year!'
      }
    ]
  },
  
  // Celebration effects
  celebrations: {
    enableAutoConfetti: true,
    confettiDensity: 'medium', // low, medium, high
    confettiColors: [], // Empty array uses theme colors
    confettiLength: 'medium' // short, medium, long
  }
};

// Create a single portfolio data object
const portfolioDataExport = {
  personalInfo,
  socialLinks,
  education,
  workExperience,
  skills,
  projects,
  guideMessages,
  characterSettings,
  themeSettings,
  seoSettings,
  contactForm,
  interactiveFeatures,
};

// Export default object for easier imports
export default portfolioDataExport; 