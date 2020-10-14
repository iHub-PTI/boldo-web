const defaultTheme = require('tailwindcss/defaultTheme')

module.exports = {
  purge: ['src/**/*.js', 'src/**/*.jsx', 'src/**/*.ts', 'src/**/*.tsx', 'public/**/*.html'],
  theme: {
    extend: {
      fontFamily: {
        sans: ['Inter var', ...defaultTheme.fontFamily.sans],
      },
      colors: {
        primary: {
          300: '#65CFD3',
          500: '#27BEC2',
          700: '#13A5A9',
          800: '#009688',
        },
        secondary: {
          300: '#FCBEAF',
          500: '#F08F77',
          700: '#DF6D51',
        },
        linen: {
          300: '#FFF4E9',
          700: '#FFC283',
        },
      },
    },
  },
  plugins: [require('@tailwindcss/ui')({ layout: 'sidebar' })],
}
