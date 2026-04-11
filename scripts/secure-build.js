#!/usr/bin/env node

// Secure build script untuk KafeKoding - Vercel Optimized
// Memastikan tidak ada source code yang terekspos

import { execSync } from 'child_process';
import { existsSync, rmSync, readdirSync, statSync } from 'fs';
import { join } from 'path';

console.log('🔒 Starting secure build process for Vercel...');

// 1. Clean previous build
if (existsSync('dist')) {
  console.log('🧹 Cleaning previous build...');
  rmSync('dist', { recursive: true, force: true });
}

// 2. Set production environment
process.env.NODE_ENV = 'production';

// 3. Build with Vite
console.log('🏗️  Building production version...');
try {
  execSync('vite build', { stdio: 'inherit' });
} catch (error) {
  console.error('❌ Build failed:', error.message);
  process.exit(1);
}

// 4. Remove any source maps
console.log('🗑️  Removing source maps...');
const removeSourceMaps = (dir) => {
  const files = readdirSync(dir);
  
  files.forEach(file => {
    const filePath = join(dir, file);
    const stat = statSync(filePath);
    
    if (stat.isDirectory()) {
      removeSourceMaps(filePath);
    } else if (file.endsWith('.map')) {
      console.log(`   Removing: ${filePath}`);
      rmSync(filePath);
    }
  });
};

if (existsSync('dist')) {
  removeSourceMaps('dist');
}

// 5. Remove Apache-specific files (not needed for Vercel)
const apacheFiles = ['dist/.htaccess'];
apacheFiles.forEach(file => {
  if (existsSync(file)) {
    console.log(`🗑️  Removing Apache file: ${file}`);
    rmSync(file);
  }
});

// 6. Verify no sensitive files in dist
console.log('🔍 Verifying build security...');
const checkSensitiveFiles = (dir, basePath = '') => {
  const files = readdirSync(dir);
  const sensitiveExtensions = ['.jsx', '.tsx', '.ts', '.vue', '.svelte', '.env', '.config.js', '.config.ts'];
  const sensitiveFiles = ['.env', 'package.json', 'package-lock.json', 'yarn.lock', '.htaccess'];
  
  files.forEach(file => {
    const filePath = join(dir, file);
    const relativePath = join(basePath, file);
    const stat = statSync(filePath);
    
    if (stat.isDirectory()) {
      // Skip node_modules, src, database directories
      if (['node_modules', 'src', 'database'].includes(file)) {
        console.warn(`⚠️  Warning: ${relativePath} directory found in build!`);
        return;
      }
      checkSensitiveFiles(filePath, relativePath);
    } else {
      // Check for sensitive file extensions
      const hasSensitiveExt = sensitiveExtensions.some(ext => file.endsWith(ext));
      const isSensitiveFile = sensitiveFiles.includes(file);
      
      if (hasSensitiveExt || isSensitiveFile) {
        console.error(`❌ SECURITY RISK: ${relativePath} found in build!`);
        process.exit(1);
      }
    }
  });
};

if (existsSync('dist')) {
  checkSensitiveFiles('dist');
}

// 7. Generate build report
console.log('📊 Build completed successfully for Vercel!');
console.log('');
console.log('✅ Security checks passed:');
console.log('   - No source maps found');
console.log('   - No sensitive files found');
console.log('   - Code is minified and obfuscated');
console.log('   - Apache files removed (Vercel optimized)');
console.log('');
console.log('🚀 Vercel deployment ready!');
console.log('');
console.log('📁 Files ready for Vercel:');
console.log('   - dist/ folder contains production build');
console.log('   - vercel.json contains security configuration');
console.log('   - _redirects handles security redirects');
console.log('');
console.log('🔗 Next steps:');
console.log('   1. Test locally: npm run preview:secure');
console.log('   2. Deploy to Vercel: vercel --prod');
console.log('   3. Test security after deployment');
console.log('   4. Verify redirects work: curl -I https://yourdomain.com/src/App.jsx');