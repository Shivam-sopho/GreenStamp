#!/usr/bin/env node

const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

console.log('🔧 Setting up Prisma for deployment...');

try {
  // Check if schema exists
  const schemaPath = path.join(process.cwd(), 'prisma', 'schema.prisma');
  if (!fs.existsSync(schemaPath)) {
    console.error('❌ Prisma schema not found at prisma/schema.prisma');
    process.exit(1);
  }

  // Generate Prisma client
  console.log('📦 Generating Prisma client...');
  execSync('npx prisma generate', { stdio: 'inherit' });

  // Check if DATABASE_URL is set
  if (!process.env.DATABASE_URL) {
    console.warn('⚠️  DATABASE_URL environment variable not set');
    console.log('💡 Make sure to set DATABASE_URL in your Vercel environment variables');
  } else {
    console.log('✅ DATABASE_URL is configured');
  }

  console.log('✅ Prisma setup complete!');
} catch (error) {
  console.error('❌ Error setting up Prisma:', error.message);
  process.exit(1);
} 