/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './app/**/*.{js,ts,jsx,tsx}',  // Asegúrate de incluir los archivos de tu directorio app
    './pages/**/*.{js,ts,jsx,tsx}',  // Si estás usando páginas dentro de la carpeta 'pages'
  ],
  theme: {
    extend: {
      colors: {
        primary: '#FFD700',  // Color dorado para tus elementos de acento
        secondary: '#333333',  // Color secundario para los textos
      },
    },
  },
  plugins: [],
}
