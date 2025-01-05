/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx}",  // Ruta para los archivos de la carpeta 'app'
    "./pages/**/*.{js,ts,jsx,tsx}", // Ruta para los archivos de la carpeta 'pages'
    "./components/**/*.{js,ts,jsx,tsx}", // Ruta para los archivos de la carpeta 'components' si existe
  ],
  theme: {
    extend: {
      colors: {
        gold: "#FFD700",  // Puedes personalizar el color dorado o amarillo
        dark: "#333333",  // Color oscuro para textos u otros elementos
      },
      fontFamily: {
        sans: ['"Inter"', 'sans-serif'],  // Fuente principal, personaliza según lo que necesites
        script: ['"Dancing Script"', 'cursive'],  // Fuente script para detalles elegantes
      },
      spacing: {
        18: "4.5rem",  // Tamaños adicionales de espaciado si lo necesitas
        72: "18rem",
      },
      boxShadow: {
        custom: "0 4px 6px rgba(0, 0, 0, 0.1), 0 1px 3px rgba(0, 0, 0, 0.08)",  // Sombra personalizada
      },
      backgroundImage: {
        "hero-pattern": "url('/path/to/your-image.jpg')",  // Si necesitas una imagen de fondo
      },
    },
  },
  plugins: [
    require('@tailwindcss/forms'),  // Para mejorar los formularios
    require('@tailwindcss/typography'),  // Para mejorar la tipografía
    require('@tailwindcss/aspect-ratio'),  // Para manejar proporciones de los elementos
  ],
}
