const defaultTheme = require('tailwindcss/defaultTheme')
const plugin = require('tailwindcss/plugin')

module.exports = {
  purge: ['src/**/*.js', 'src/**/*.jsx', 'src/**/*.ts', 'src/**/*.tsx', 'public/**/*.html'],
  theme: {
    extend: {
      fontFamily: {
        sans: ['Inter var', ...defaultTheme.fontFamily.sans],
      },
      colors: {
       
      },
    },
  },
  variants: { margin: ['responsive', 'not-first'] },
  plugins: [
    require('@tailwindcss/ui')({ layout: 'sidebar' }),
    plugin(function ({ addVariant, e }) {
        addVariant('not-first', ({ modifySelectors, separator }) => {
          modifySelectors(({ className }) => {
            return `.${e(`not-first${separator}${className}`)}:not(:first-child)`
          })
        })
      }),
  ],
}
