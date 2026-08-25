module.exports = {
  printWidth: 120,
  tabWidth: 2,
  bracketSameLine: true,
  useTabs: true,
  semi: true,
  trailingComma: "all",
  bracketSpacing: true,
  arrowParens: "always",
  endOfLine: "auto",
  plugins: ["prettier-plugin-astro"],
  overrides: [
    {
      files: "*.astro",
      options: {
        parser: "astro"
      }
    }
  ]
};