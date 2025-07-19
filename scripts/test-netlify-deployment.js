#!/usr/bin/env node

const fs = require('fs');
const path = require('path');

console.log('🔍 Testing Netlify deployment configuration...\n');

// Check if .next directory exists
const nextDir = path.join(process.cwd(), '.next');
if (fs.existsSync(nextDir)) {
  console.log('✅ .next directory exists');

  // Check for essential files
  const essentialFiles = [
    '.next/BUILD_ID',
    '.next/static',
    '.next/server'
  ];

  essentialFiles.forEach(file => {
    const filePath = path.join(process.cwd(), file);
    if (fs.existsSync(filePath)) {
      console.log(`✅ ${file} exists`);
    } else {
      console.log(`❌ ${file} missing`);
    }
  });
} else {
  console.log('❌ .next directory does not exist - run "bun run build" first');
}

// Check netlify.toml configuration
const netlifyToml = path.join(process.cwd(), 'netlify.toml');
if (fs.existsSync(netlifyToml)) {
  console.log('✅ netlify.toml exists');
  const content = fs.readFileSync(netlifyToml, 'utf8');
  if (content.includes('publish = ".next"')) {
    console.log('✅ netlify.toml has correct publish directory');
  } else {
    console.log('❌ netlify.toml publish directory incorrect');
  }
} else {
  console.log('❌ netlify.toml missing');
}

// Check for conflicting deployment configs
const conflictingFiles = ['vercel.json', 'now.json'];
conflictingFiles.forEach(file => {
  if (fs.existsSync(path.join(process.cwd(), file))) {
    console.log(`⚠️  ${file} exists - may conflict with Netlify deployment`);
  }
});

console.log('\n🎯 Deployment checklist:');
console.log('1. Run "bun run build" to generate .next directory');
console.log('2. Ensure netlify.toml publish directory is set to ".next"');
console.log('3. Remove any Vercel-specific configuration files');
console.log('4. Deploy to Netlify and check build logs');
