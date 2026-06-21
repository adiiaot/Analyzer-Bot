/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './app/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        background: '#0f172a',
        card: '#1e293b',
        accent: '#eab308',
        success: '#22c55e',
        error: '#ef4444',
      },
    },
  },
  plugins: [],
}
