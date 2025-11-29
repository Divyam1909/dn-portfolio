// backend/scripts/seedCompact.js
// Run: node scripts/seedCompact.js
require('dotenv').config();
const mongoose = require('mongoose');

const MONGODB_URI = process.env.MONGODB_URI;
if (!MONGODB_URI) {
  console.error('MONGODB_URI not set in .env');
  process.exit(1);
}

// Models - adjust paths if your project structure differs
const PersonalInfo = require('../src/models/PersonalInfo');
const Project = require('../src/models/Project');
const Experience = require('../src/models/Experience');
const Education = require('../src/models/Education');
const Skill = require('../src/models/Skill');
const Certification = require('../src/models/Certification');
const Quote = require('../src/models/Quote');
const Admin = require('../src/models/Admin'); // optional, if needed

async function seed() {
  try {
    console.log('Connecting to DB...');
    await mongoose.connect(MONGODB_URI);
    console.log('Connected:', mongoose.connection.db.databaseName);

    // ---------- PersonalInfo (singleton upsert) ----------
    const personal = {
      name: "Divyam Navin",
      title: "IT Student • Full-Stack Dev • AI & IoT",
      email: "divyamnavin@gmail.com",
      phone: "+91 7738127675",
      location: "Thane, Maharashtra, India",
      bio: "Third-year IT student focused on full-stack web, AI/ML, and embedded systems. Builds practical products integrating web, hardware, and automation.",
      socialLinks: {
        github: "https://github.com/divyamnavin",
        linkedin: "https://linkedin.com/in/divyam-navin"
      }
    };

    await PersonalInfo.findOneAndUpdate({}, personal, { upsert: true, new: true });
    console.log('✅ PersonalInfo upserted');

    // ---------- Projects ----------
    const projectsData = [
      {
        title: "EduSage — Smart Education Platform",
        description: "AI-powered education management: assessments, scheduling, analytics, and automation.",
        technologies: ["MongoDB", "Express", "React", "Node.js", "Python"],
        demoLink: "https://edu-sage.vercel.app",
        featured: true,
        order: 0,
        status: "active",
        createdAt: new Date("2024-10-01")
      },
      {
        title: "Wave Habitat — Hardware Integration",
        description: "IoT integration for live monitoring and dashboards for industrial animal habitat projects.",
        technologies: ["HTML", "CSS", "PHP", "Java", "Python"],
        demoLink: "https://armsrobotics.com",
        featured: true,
        order: 1,
        status: "active",
        createdAt: new Date("2025-06-01")
      },
      {
        title: "M.A.S.K — Encryption in Multi-Agent Systems",
        description: "Secure comms prototype combining modern AEAD and signature schemes for agent networks.",
        technologies: ["Python", "Cryptography", "IoT"],
        featured: true,
        order: 2,
        status: "active",
        createdAt: new Date("2025-03-01")
      }
    ];

    const createdProjects = await Project.insertMany(projectsData);
    console.log(`✅ Projects seeded: ${createdProjects.length}`);

    // ---------- Experiences ----------
    const experiencesData = [
      {
        title: "IT Engineer Intern",
        company: "Arms Robotics",
        location: "Jamnagar, India",
        startDate: "June 2025",
        endDate: "July 2025",
        startDateISO: "2025-06-01",
        endDateISO: "2025-07-31",
        current: false,
        description: "Built a website integrated with hardware systems; worked on AI/ML and embedded integrations.",
        achievements: [
          "Deployed hardware-integrated web dashboard",
          "Assisted on embedded system integration"
        ],
        order: 0
      },
      {
        title: "Web Development Intern",
        company: "VanillaKart",
        location: "Mumbai, India",
        startDate: "2024",
        endDate: "2025",
        startDateISO: "2024-01-01",
        endDateISO: "2025-12-31",
        current: false,
        description: "Front-end development and content optimization for e-commerce.",
        achievements: [
          "Optimized 100+ product descriptions",
          "Contributed to 5 live projects"
        ],
        order: 1
      },
      {
        title: "Digital Marketing Intern",
        company: "Finnfluent Education",
        location: "Mumbai, India",
        startDate: "January 2025",
        endDate: "February 2025",
        startDateISO: "2025-01-01",
        endDateISO: "2025-02-28",
        current: false,
        description: "Content strategy, SEO, and lead generation.",
        achievements: [
          "Created high-impact social creatives",
          "Built backlink & PR content"
        ],
        order: 2
      },
      {
        title: "Teacher Assistant",
        company: "Vijay Shekhar Academy",
        location: "Mumbai, India",
        startDate: "2023",
        endDate: "2023",
        startDateISO: "2023-06-01",
        endDateISO: "2023-06-30",
        current: false,
        description: "Mentored students, created assessments, and supported curriculum.",
        achievements: [
          "Mentored 30+ students",
          "Designed 20+ question papers"
        ],
        order: 3
      },
      {
        title: "Digital Marketing Intern",
        company: "Pawzzitive Welfare Foundation",
        location: "Mumbai, India",
        startDate: "2024",
        endDate: "2024",
        startDateISO: "2024-05-01",
        endDateISO: "2024-08-31",
        current: false,
        description: "Campaigns, fundraising, and donor engagement for animal welfare.",
        achievements: [
          "Helped raise ₹10,000+",
          "Engaged 1000+ donors"
        ],
        order: 4
      },
      {
        title: "Secretary & Startup Coordinator",
        company: "E-CELL, Fr. C. R. Institute of Technology",
        location: "Navi Mumbai, India",
        startDate: "2024",
        endDate: "Present",
        startDateISO: "2024-01-01",
        endDateISO: null,
        current: true,
        description: "Lead coordination, mentorship, and event organisation for startup activities.",
        achievements: [
          "Co-organised Spark-A-Thon and E-Summit 2025",
          "Mentored early-stage startups"
        ],
        order: 5
      }
    ];

    const createdExp = await Experience.insertMany(experiencesData);
    console.log(`✅ Experiences seeded: ${createdExp.length}`);

    // ---------- Education ----------
    const educationData = [
      {
        degree: "B.Tech in Information Technology",
        institution: "Fr. C. R. Institute of Technology",
        location: "Vashi, Navi Mumbai",
        startDate: "2023",
        endDate: "2027",
        startDateISO: "2023-07-01",
        endDateISO: "2027-05-31",
        description: "Core: web development, AI/ML, embedded systems.",
        achievements: ["CGPA Y1: 9.5", "CGPA Y2: 9.74"],
        order: 0
      },
      {
        degree: "HSC – Science",
        institution: "V.G. Vaze College of Science, Commerce and Arts",
        location: "Mumbai, India",
        startDate: "2021",
        endDate: "2023",
        startDateISO: "2021-06-01",
        endDateISO: "2023-03-31",
        description: "Science stream; strong PCM foundation.",
        achievements: ["CET percentile: 97.5%"],
        order: 1
      }
    ];

    const createdEdu = await Education.insertMany(educationData);
    console.log(`✅ Education seeded: ${createdEdu.length}`);

    // ---------- Skills ----------
    const skillsData = [
      { name: "Python", category: "technical", level: 95, order: 0 },
      { name: "HTML", category: "technical", level: 95, order: 1 },
      { name: "JavaScript", category: "technical", level: 80, order: 2 },
      { name: "Node.js", category: "technical", level: 75, order: 3 },
      { name: "React.js", category: "technical", level: 75, order: 4 },
      { name: "MongoDB", category: "technical", level: 80, order: 5 },
      { name: "C", category: "technical", level: 70, order: 6 },
      { name: "Java", category: "technical", level: 70, order: 7 },
      { name: "Team Leadership", category: "soft", level: 85, order: 0 },
      { name: "Communication", category: "soft", level: 90, order: 1 },
      { name: "Time Management", category: "soft", level: 90, order: 2 },
      { name: "English", category: "language", proficiency: "Fluent", order: 0 },
      { name: "Hindi", category: "language", proficiency: "Fluent", order: 1 }
    ];

    const createdSkills = await Skill.insertMany(skillsData);
    console.log(`✅ Skills seeded: ${createdSkills.length}`);

    // ---------- Certifications ----------
    const certificationsData = [
      {
        title: "Letter of Recommendation — Arms Robotics",
        issuer: "Arms Robotics",
        issueDate: "2025",
        issueDateISO: "2025-07-01",
        description: "Recognized for technical contributions in IT and embedded systems.",
        order: 0
      },
      {
        title: "Letter of Recommendation — Finnfluent Education",
        issuer: "Finnfluent Education",
        issueDate: "2025",
        issueDateISO: "2025-02-01",
        description: "For digital marketing and content strategy contributions.",
        order: 1
      },
      {
        title: "Letter of Recommendation — Vijay Shekhar Academy",
        issuer: "Vijay Shekhar Academy",
        issueDate: "2023",
        issueDateISO: "2023-06-01",
        description: "For mentoring and assessment development.",
        order: 2
      },
      {
        title: "Letter of Recommendation — Pawzzitive Welfare Foundation",
        issuer: "Pawzzitive Welfare Foundation",
        issueDate: "2024",
        issueDateISO: "2024-08-01",
        description: "For digital fundraising and outreach impact.",
        order: 3
      }
    ];

    const createdCerts = await Certification.insertMany(certificationsData);
    console.log(`✅ Certifications seeded: ${createdCerts.length}`);

    // ---------- Quotes ----------
    const quotesData = [
      { text: "The cosmos is within us. We are made of star-stuff.", author: "Carl Sagan", category: "universe", isActive: true, order: 0 },
      { text: "Code is like humor. When you have to explain it, it’s bad.", author: "Cory House", category: "programming", isActive: true, order: 1 }
    ];

    const createdQuotes = await Quote.insertMany(quotesData);
    console.log(`✅ Quotes seeded: ${createdQuotes.length}`);

    console.log('\n🎉 Seeding complete!');
    await mongoose.disconnect();
    process.exit(0);
  } catch (err) {
    console.error('❌ Error seeding DB:', err);
    await mongoose.disconnect();
    process.exit(1);
  }
}

seed();