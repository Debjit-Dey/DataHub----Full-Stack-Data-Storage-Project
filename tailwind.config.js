/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./views/**/*.{ejs,html}",  // Path to your EJS files in the 'views' folder
    "./public/**/*.{html,js}"   // If you have other HTML/JS files
  ],
  theme: {
    extend: {},
  },
  plugins: [],
};
