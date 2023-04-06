// config-overrides.js文件内容： 
const { override, addPostcssPlugins } = require('customize-cra')

module.exports = override(
  addPostcssPlugins([
    require('tailwindcss'),
    require('autoprefixer')
  ])
)