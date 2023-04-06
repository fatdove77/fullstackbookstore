// tailwind.config.js

module.exports = {
  //配置 `purge` 选项指定所有的 components 文件，使得 Tailwind 可以在生产构建中对未使用的样式进行摇树优化。
  purge: ['./src/**/*.{js,jsx,ts,tsx}', './public/index.html'],
  // purge: [],
  darkMode: false, // or 'media' or 'class'
  theme: {
    extend: {},
  },
  variants: {
    extend: {},
  },
  plugins: [],
}
