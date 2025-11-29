/**
 * MongoDB Seed Script
 * 
 * This script imports data from JSON files in the /database folder
 * into your MongoDB database.
 * 
 * Usage: node scripts/seedFromJson.js
 * 
 * Options:
 *   --clear    Clear existing data before seeding
 *   --only=<collection>  Only seed specific collection (e.g., --only=projects)
 */

require('dotenv').config();
const mongoose = require('mongoose');
const fs = require('fs');
const path = require('path');

// Import models
const PersonalInfo = require('../src/models/PersonalInfo');
const Project = require('../src/models/Project');
const Experience = require('../src/models/Experience');
const Education = require('../src/models/Education');
const Skill = require('../src/models/Skill');
const Certification = require('../src/models/Certification');
const Quote = require('../src/models/Quote');

// Path to database folder (inside backend folder)
const DATABASE_FOLDER = path.join(__dirname, '../database');

// Collection mapping
const collections = {
  personalinfos: { model: PersonalInfo, file: 'personalInfo.json' },
  projects: { model: Project, file: 'projects.json' },
  experiences: { model: Experience, file: 'experiences.json' },
  educations: { model: Education, file: 'educations.json' },
  skills: { model: Skill, file: 'skills.json' },
  certifications: { model: Certification, file: 'certifications.json' },
  quotes: { model: Quote, file: 'quotes.json' },
};

// Parse command line arguments
const args = process.argv.slice(2);
const clearData = args.includes('--clear');
const onlyArg = args.find(arg => arg.startsWith('--only='));
const onlyCollection = onlyArg ? onlyArg.split('=')[1] : null;

async function connectDB() {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('✅ Connected to MongoDB');
  } catch (error) {
    console.error('❌ MongoDB connection error:', error.message);
    process.exit(1);
  }
}

async function loadJsonFile(filename) {
  const filePath = path.join(DATABASE_FOLDER, filename);
  
  if (!fs.existsSync(filePath)) {
    console.warn(`⚠️  File not found: ${filename}`);
    return null;
  }
  
  try {
    const content = fs.readFileSync(filePath, 'utf8');
    return JSON.parse(content);
  } catch (error) {
    console.error(`❌ Error reading ${filename}:`, error.message);
    return null;
  }
}

async function seedCollection(name, { model, file }) {
  console.log(`\n📦 Seeding ${name}...`);
  
  const data = await loadJsonFile(file);
  
  if (!data || !Array.isArray(data)) {
    console.log(`   ⏭️  Skipping ${name} (no data or invalid format)`);
    return;
  }
  
  if (clearData) {
    await model.deleteMany({});
    console.log(`   🗑️  Cleared existing ${name}`);
  }
  
  // Special handling for PersonalInfo (singleton)
  if (name === 'personalinfos') {
    const existing = await model.findOne({});
    if (existing) {
      await model.findByIdAndUpdate(existing._id, data[0]);
      console.log(`   ✅ Updated personal info`);
    } else {
      await model.create(data[0]);
      console.log(`   ✅ Created personal info`);
    }
    return;
  }
  
  // For other collections, insert all documents
  try {
    const result = await model.insertMany(data, { ordered: false });
    console.log(`   ✅ Inserted ${result.length} documents into ${name}`);
  } catch (error) {
    if (error.code === 11000) {
      console.log(`   ⚠️  Some documents already exist in ${name}`);
    } else {
      console.error(`   ❌ Error seeding ${name}:`, error.message);
    }
  }
}

async function seed() {
  console.log('🌱 Starting database seed...\n');
  console.log(`📁 Database folder: ${DATABASE_FOLDER}`);
  
  if (clearData) {
    console.log('⚠️  Clear mode enabled - existing data will be removed');
  }
  
  if (onlyCollection) {
    console.log(`📌 Only seeding: ${onlyCollection}`);
  }
  
  await connectDB();
  
  for (const [name, config] of Object.entries(collections)) {
    if (onlyCollection && name !== onlyCollection) {
      continue;
    }
    await seedCollection(name, config);
  }
  
  console.log('\n✨ Seed complete!');
  await mongoose.disconnect();
  console.log('🔌 Disconnected from MongoDB');
}

seed().catch(error => {
  console.error('❌ Seed failed:', error);
  process.exit(1);
});

