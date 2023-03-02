const defaultTheme = require('tailwindcss/defaultTheme')

module.exports = {
  purge: ['src/**/*.js', 'src/**/*.jsx', 'src/**/*.ts', 'src/**/*.tsx', 'public/**/*.html'],
  theme: {
    extend: {
      fontSize: {
        xxs: '.5rem',
      },
      fontFamily: {
        sans: ['Inter var', ...defaultTheme.fontFamily.sans],
      },
      colors: {
        primary: {
          100: '#D4F2F3',
          200: '#A9E5E7',
          300: '#7DD8DA',
          400: '#65CFD3',
          500: '#27BEC2',
          600: '#13A5A9',
          700: '#177274',
          800: '#104C4E',
          900: '#082627',
        },
        secondary: {
          100: '#FCE9E4',
          200: '#F9D2C9',
          300: '#FCBEAF',
          400: '#F3A592',
          500: '#F08F77',
          600: '#C0725F',
          700: '#905647',
          800: '#603930',
          900: '#301D18',
        },
        linen: {
          100: '#FFFDFB',
          200: '#FFFBF6',
          300: '#FFF8F2',
          400: '#FFF6ED',
          500: '#FFF4E9',
          600: '#CCC3BA',
          700: '#99928C',
          800: '#66625D',
          900: '#33312F',
        },
        bluish:{
          500: '#EDF2F7'
        }
      },
      screens: {
        'md-max': { max: '1024px' },
        'sm-max': { max: '600px' },
        '2xl': '1920px',
      },
      maxHeight: { 0: '0', 200: '200px' },
    },
  },
  variants: {
    textColor: ['responsive', 'hover', 'focus', 'group-hover', 'group-focus'],
    opacity: ['disabled', 'hover', 'group-hover'],
    cursor: ['disabled', 'hover'],
    backgroundColor: ['checked', 'disabled', 'hover'],
    width: ['hover', 'responsive', 'focus'],
  },
  plugins: [require('@tailwindcss/aspect-ratio'), require('@tailwindcss/ui')({ layout: 'sidebar' })],
}
