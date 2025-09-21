#!/usr/bin/env node

/**
 * Script to create the initial superadmin user
 * Usage: node scripts/create-superadmin.js [email] [firstName] [lastName] [password]
 */

require('dotenv').config();
const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcrypt');

const prisma = new PrismaClient();

async function createSuperAdmin() {
  try {
    console.log('🚀 Creating Initial Super Admin User');
    console.log('=====================================\n');

    // Check if any admin exists
    const existingAdmins = await prisma.adminUser.count();
    if (existingAdmins > 0) {
      console.log('❌ Admin users already exist. This script should only be run once.');
      console.log('Use the admin panel or API to create additional admins.');
      process.exit(1);
    }

    // Use command line arguments or defaults
    const email = process.argv[2] || 'admin@ai-consultancy.com';
    const firstName = process.argv[3] || 'Admin';
    const lastName = process.argv[4] || 'User';
    const password = process.argv[5] || 'admin123456';

    // Validate inputs
    if (!email || !firstName || !lastName || !password) {
      console.log('❌ All fields are required.');
      console.log('Usage: node scripts/create-superadmin.js [email] [firstName] [lastName] [password]');
      process.exit(1);
    }

    if (password.length < 8) {
      console.log('❌ Password must be at least 8 characters long.');
      process.exit(1);
    }

    if (!email.includes('@')) {
      console.log('❌ Please enter a valid email address.');
      process.exit(1);
    }

    console.log(`Creating admin with email: ${email}`);

    // Hash password
    console.log('🔐 Hashing password...');
    const saltRounds = 12;
    const passwordHash = await bcrypt.hash(password, saltRounds);

    // Create superadmin
    console.log('👤 Creating superadmin user...');
    const admin = await prisma.adminUser.create({
      data: {
        email,
        passwordHash,
        firstName,
        lastName,
        role: 'SUPERADMIN',
        isActive: true,
      },
    });

    console.log('\n✅ Super Admin created successfully!');
    console.log('=====================================');
    console.log(`ID: ${admin.id}`);
    console.log(`Email: ${admin.email}`);
    console.log(`Name: ${admin.firstName} ${admin.lastName}`);
    console.log(`Role: ${admin.role}`);
    console.log(`Created: ${admin.createdAt}`);
    console.log('\n🎉 You can now log in to the admin panel with these credentials.');
    console.log(`Login credentials: ${email} / ${password}`);

  } catch (error) {
    console.error('❌ Error creating superadmin:', error.message);
    if (error.code === 'P2002') {
      console.log('This email is already registered.');
    }
    process.exit(1);
  } finally {
    await prisma.$disconnect();
  }
}

createSuperAdmin();
