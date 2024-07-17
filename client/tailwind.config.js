export default {
  content: [
    "./index.html",
    "./src/index.jsx", 
    "./src/App.jsx",
    "./src/components/About.jsx",
    "./src/components/Chat.jsx",
    "./src/components/ErrorPage.jsx",
    "./src/components/Home.jsx",
    "./src/components/Login.jsx",
    "./src/components/NavBar.jsx"
  ],
  theme: {
    container: {
      center: true,
    },
    colors: {
      'green': '#CEFAD5',
      'light-green': '#C9DFC4'
    },
    fontFamily: {
      sans: ['Helvetica', 'sans-serif']
    },
    extend: {
      spacing: {
        '3xl': '64rem',
        '4xl': '82rem'
      },
      borderRadius: {
        '4xl': '2rem'
      }
    },
  },
  plugins: [
    require('@tailwindcss/forms'),
  ],
}
