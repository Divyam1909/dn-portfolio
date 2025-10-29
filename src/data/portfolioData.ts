/**
 * PORTFOLIO DATA CONFIGURATION
 * 
 * This file contains all the configurable content for your portfolio.
 * Edit the values below to customize your portfolio website.
 */

// ======= PERSONAL INFORMATION =======
// TODO: Update with your personal information
export const personalInfo = {
  name: "Divyam Navin", // TODO: Update with your full name
  title: "Web Developer", // TODO: Update with your professional title
  email: "divyamnavin@gmail.com", // TODO: Update with your email
  phone: "", // TODO: Add your phone number (optional)
  location: "Thane, Maharashtra, India", // TODO: Update with your location
  profileImage: "", // TODO: Add your profile image URL (upload to Cloudinary or use from backend)
  bio: "", // TODO: Add your professional bio (2-3 sentences about your expertise and passion)
};

// ======= SOCIAL LINKS =======
// TODO: Update with your social media profiles
export const socialLinks = {
  github: "", // TODO: Add your GitHub profile URL
  linkedin: "", // TODO: Add your LinkedIn profile URL
  twitter: "", // TODO: Add your Twitter profile URL (optional)
  instagram: "", // TODO: Add your Instagram profile URL (optional)
  // Add or remove social profiles as needed
};

// ======= EDUCATION =======
// TODO: Add your education history
export const education = [
  // TODO: Add your education entries following this structure:
  // {
  //   degree: "Your Degree Name",
  //   institution: "Institution Name",
  //   location: "City, Country",
  //   startDate: "Month Year",
  //   endDate: "Month Year or Present",
  //   description: "Brief description of your studies and focus areas",
  //   achievements: [
  //     "Achievement 1",
  //     "Achievement 2"
  //   ]
  // },
];

// ======= WORK EXPERIENCE =======
// TODO: Add your work experience
export const workExperience = [
  // TODO: Add your work experience entries following this structure:
  // {
  //   title: "Your Job Title",
  //   company: "Company Name",
  //   location: "City, State/Country",
  //   startDate: "Month Year",
  //   endDate: "Month Year or Present",
  //   description: "Brief description of your role and responsibilities",
  //   achievements: [
  //     "Key achievement 1 with measurable impact",
  //     "Key achievement 2 with measurable impact",
  //     "Key achievement 3 with measurable impact"
  //   ],
  // },
];

// ======= SKILLS =======
// TODO: Add your skills and proficiency levels
export const skills = {
  technical: [
    // TODO: Add your technical skills with proficiency level (0-100)
    // { name: "Skill Name", level: 85 },
  ],
  soft: [
    // TODO: Add your soft skills
    // "Skill Name",
  ],
  languages: [
    // TODO: Add languages you speak
    // { name: "Language", proficiency: "Fluent/Native/Intermediate/Basic" },
  ],
};

// ======= PROJECTS =======
// TODO: Add your projects
export const projects = [
  // TODO: Add your project entries following this structure:
  // {
  //   title: "Project Title",
  //   description: "Brief description of the project, what it does, and the problem it solves",
  //   technologies: ["Tech1", "Tech2", "Tech3"], // Technologies used
  //   image: "", // Project screenshot/thumbnail URL (upload via admin panel)
  //   demoLink: "https://demo-url.com", // Optional: Live demo link
  //   sourceLink: "https://github.com/yourusername/repo", // Optional: GitHub repo link
  //   featured: true, // Set to true for featured projects to show prominently
  // },
];

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
// TODO: Update SEO settings for better search engine visibility
export const seoSettings = {
  title: "", // TODO: Add your portfolio page title (e.g., "Your Name - Job Title")
  description: "", // TODO: Add a brief description for search engines (150-160 characters)
  keywords: "web developer, portfolio, react, frontend, javascript, typescript", // TODO: Add relevant keywords
  ogImage: "", // TODO: Add Open Graph image URL for social media sharing (1200x630px recommended)
  twitterHandle: "", // TODO: Add your Twitter handle (e.g., "@yourusername")
};

// ======= CONTACT FORM =======
// TODO: Configure email service for contact form (optional - handled by backend)
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