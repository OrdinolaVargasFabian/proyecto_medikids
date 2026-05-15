/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        medi: {
          50: '#f7f9f2',  // Fondos muy sutiles (casi blanco)
          100: '#ecefdf', // Fondos de tarjetas o inputs
          200: '#dae1c0', // Bordes suaves
          300: '#c5d29d', 
          400: '#b8ca76', // <-- TU COLOR OFICIAL CORREGIDO
          500: '#9cb151',
          600: '#7c8f3e', // Textos sobre fondos claros
          700: '#5e6d31', // Iconos profundos
          800: '#4a5529', // Textos oscuros
          900: '#3f4825', 
          brand: '#b8ca76', // <-- ACTUALIZADO AQUÍ TAMBIÉN
        }
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
      }
    },
  },
  plugins: [],
}