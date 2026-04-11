#!/usr/bin/env node

// Security check script untuk memverifikasi deployment
// Mengecek apakah ada file sensitif yang terekspos

import { existsSync, readdirSync, statSync } from 'fs';
import { join } from 'path';

console.log('🔍 Running security check...');
console.log('');

let securityIssues = [];

// 1. Check if dist folder exists
if (!existsSync('dist')) {
  console.error('❌ dist folder not found. Run npm run build:secure first.');
  process.exit(1);
}

// 2. Check for sensitive files in dist
const checkDistSecurity = (dir, basePath = '') => {
  const files = readdirSync(dir);
  
  // Files that should NEVER be in production build
  const forbiddenFiles = [
    '.env', '.env.local', '.env.production', '.env.development',
    'package.json', 'package-lock.json', 'yarn.lock',
    'vite.config.js', 'vite.config.ts',
    'tailwind.config.js', 'tailwind.config.cjs',
    'postcss.config.js', 'postcss.config.cjs',
    'eslint.config.js', '.eslintrc.js',
    'README.md', 'SECURITY.md', 'DEPLOYMENT_SECURITY.md'
  ];
  
  // Extensions that should NEVER be in production build
  const forbiddenExtensions = [
    '.jsx', '.tsx', '.ts', '.vue', '.svelte',
    '.map', '.config.js', '.config.ts', '.config.cjs'
  ];
  
  // Directories that should NEVER be in production build
  const forbiddenDirs = [
    'src', 'database', 'node_modules', 'scripts', '.git'
  ];
  
  files.forEach(file => {
    const filePath = join(dir, file);
    const relativePath = join(basePath, file);
    const stat = statSync(filePath);
    
    if (stat.isDirectory()) {
      if (forbiddenDirs.includes(file)) {
        securityIssues.push(`Directory: ${relativePath}`);
      } else {
        checkDistSecurity(filePath, relativePath);
      }
    } else {
      // Check forbidden files
      if (forbiddenFiles.includes(file)) {
        securityIssues.push(`File: ${relativePath}`);
      }
      
      // Check forbidden extensions
      const hasForbiddenExt = forbiddenExtensions.some(ext => file.endsWith(ext));
      if (hasForbiddenExt) {
        securityIssues.push(`File: ${relativePath}`);
      }
    }
  });
};

checkDistSecurity('dist');

// 3. Check for source maps
const checkSourceMaps = (dir, basePath = '') => {
  const files = readdirSync(dir);
  
  files.forEach(file => {
    const filePath = join(dir, file);
    const relativePath = join(basePath, file);
    const stat = statSync(filePath);
    
    if (stat.isDirectory()) {
      checkSourceMaps(filePath, relativePath);
    } else if (file.endsWith('.map')) {
      securityIssues.push(`Source map: ${relativePath}`);
    }
  });
};

checkSourceMaps('dist');

// 4. Report results
console.log('📊 Security Check Results:');
console.log('========================');

if (securityIssues.length === 0) {
  console.log('✅ All security checks passed!');
  console.log('');
  console.log('✅ No sensitive files found in build');
  console.log('✅ No source maps found');
  console.log('✅ No source code exposed');
  console.log('✅ Build is ready for production deployment');
  console.log('');
  console.log('🚀 Safe to deploy!');
  console.log('');
  console.log('📋 Deployment checklist:');
  console.log('   1. Upload only dist/ folder contents');
  console.log('   2. Configure server security rules');
  console.log('   3. Test with: curl -I https://yourdomain.com/src/App.jsx');
  console.log('   4. Verify DevTools blocking works');
} else {
  console.log('❌ Security issues found:');
  console.log('');
  
  securityIssues.forEach(issue => {
    console.log(`   ❌ ${issue}`);
  });
  
  console.log('');
  console.log('🚨 DO NOT DEPLOY until these issues are fixed!');
  console.log('');
  console.log('🔧 How to fix:');
  console.log('   1. Run: npm run build:secure');
  console.log('   2. Check your build configuration');
  console.log('   3. Ensure only production files are included');
  
  process.exit(1);
}

// 5. Additional recommendations
console.log('');
console.log('🛡️  Additional Security Recommendations:');
console.log('   - Set up .htaccess or nginx rules');
console.log('   - Configure security headers');
console.log('   - Test with security scanning tools');
console.log('   - Monitor for unauthorized access attempts');
console.log('   - Regular security audits');
console.log('');
console.log('📖 See DEPLOYMENT_SECURITY.md for detailed instructions');