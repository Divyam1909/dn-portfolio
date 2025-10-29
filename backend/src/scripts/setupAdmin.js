require('dotenv').config();
const mongoose = require('mongoose');
const Admin = require('../models/Admin');

/**
 * Script to create initial admin user
 * Run with: node src/scripts/setupAdmin.js
 */
const setupAdmin = async () => {
  try {
    // Connect to database
    await mongoose.connect(process.env.MONGODB_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });

    console.log('✅ Connected to MongoDB');

    // Check if admin already exists
    const existingAdmin = await Admin.findOne();
    if (existingAdmin) {
      console.log('⚠️  Admin user already exists');
      console.log('Username:', existingAdmin.username);
      console.log('Email:', existingAdmin.email);
      
      const readline = require('readline').createInterface({
        input: process.stdin,
        output: process.stdout
      });

      readline.question('Do you want to update the password? (yes/no): ', async (answer) => {
        if (answer.toLowerCase() === 'yes') {
          readline.question('Enter new password: ', async (newPassword) => {
            existingAdmin.password = newPassword;
            await existingAdmin.save();
            console.log('✅ Password updated successfully');
            readline.close();
            process.exit(0);
          });
        } else {
          readline.close();
          process.exit(0);
        }
      });
      
      return;
    }

    // Create new admin
    const username = process.env.ADMIN_USERNAME || 'admin';
    const password = process.env.ADMIN_PASSWORD || 'admin123';
    const email = process.env.EMAIL_USER || 'admin@portfolio.com';

    const admin = await Admin.create({
      username,
      password,
      email
    });

    console.log('✅ Admin user created successfully');
    console.log('═══════════════════════════════════');
    console.log('Username:', admin.username);
    console.log('Email:', admin.email);
    console.log('Password:', password);
    console.log('═══════════════════════════════════');
    console.log('⚠️  Please change the password after first login!');
    console.log('⚠️  Update your .env file with secure credentials');

    process.exit(0);
  } catch (error) {
    console.error('❌ Error:', error.message);
    process.exit(1);
  }
};

// Run the script
setupAdmin();

