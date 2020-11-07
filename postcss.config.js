const postcssPresetEnv = require('postcss-preset-env')

module.exports = {
  plugins: [
    require('postcss-import'),
    require('tailwindcss'),
    require('postcss-flexbugs-fixes'),
    require('autoprefixer'),
    postcssPresetEnv({
      autoprefixer: { flexbox: 'no-2009' },
      stage: 3,
      features: { 'custom-properties': false },
    }),
  ],
}
