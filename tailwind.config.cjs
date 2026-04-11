/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      // Custom colors for better performance
      colors: {
        primary: {
          50: '#eff6ff',
          100: '#dbeafe', 
          500: '#3b82f6',
          600: '#2563eb',
          700: '#1d4ed8',
        }
      },
      
      // Optimize animations
      animation: {
        'spin': 'spin 1s linear infinite',
        'pulse': 'pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite',
      }
    },
  },
  plugins: [],
  
  // Purge unused CSS in production
  purge: {
    enabled: process.env.NODE_ENV === 'production',
    content: [
      "./index.html",
      "./src/**/*.{js,ts,jsx,tsx}",
    ],
    options: {
      safelist: [
        'animate-spin',
        'animate-pulse',
        'bg-blue-600',
        'bg-green-600',
        'bg-red-600',
        'bg-yellow-600',
        'text-blue-600',
        'text-green-600',
        'text-red-600',
        'text-yellow-600',
      ]
    }
  }
}