import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  
  build: {
    minify: 'terser',
    terserOptions: {
      compress: {
        drop_console: true,
        drop_debugger: true,
        passes: 3,
        dead_code: true
      },
      mangle: {
        toplevel: true,
        safari10: true
      },
      format: {
        comments: false
      }
    },
    
    sourcemap: false,
    
    rollupOptions: {
      output: {
        chunkFileNames: 'assets/[hash].js',
        entryFileNames: 'assets/[hash].js',
        assetFileNames: 'assets/[hash].[ext]',
        
        manualChunks(id) {
          if (id.includes('node_modules')) {
            if (id.includes('react') || id.includes('react-dom')) {
              return 'vendor';
            }
            if (id.includes('react-router')) {
              return 'router';
            }
            if (id.includes('lucide-react') || id.includes('aos')) {
              return 'ui';
            }
            return 'vendor';
          }
        }
      }
    },
    
    assetsInlineLimit: 4096,
    cssCodeSplit: true,
    target: 'es2015',
    reportCompressedSize: false
  },
  
  server: {
    hmr: process.env.NODE_ENV === 'development',
    
    optimizeDeps: {
      include: ['react', 'react-dom', 'react-router-dom', 'lucide-react', 'aos']
    },
    
    headers: {
      'X-Content-Type-Options': 'nosniff',
      'X-Frame-Options': 'DENY',
      'X-XSS-Protection': '1; mode=block'
    }
  },
  
  preview: {
    port: 4173,
    strictPort: true,
    headers: {
      'X-Content-Type-Options': 'nosniff',
      'X-Frame-Options': 'DENY',
      'X-XSS-Protection': '1; mode=block',
      'Referrer-Policy': 'strict-origin-when-cross-origin'
    }
  },
  
  define: {
    __DEV__: JSON.stringify(false),
    'process.env.NODE_ENV': JSON.stringify(process.env.NODE_ENV || 'production')
  }
})