export default [
  {
    ignores: ["**/node_modules/**", "**/.next/**", "**/dist/**", "**/build/**"],
  },
  {
    files: ["**/*.{js,mjs,cjs}"],
    languageOptions: {
      ecmaVersion: "latest",
      sourceType: "module",
    },
    rules: {},
  },
]
