export default [
  {
    ignores: [".next/**", "node_modules/**", "out/**", "build/**", "dist/**"],
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
