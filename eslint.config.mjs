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
    rules: {
      "no-unused-vars": ["warn", { argsIgnorePattern: "^_" }],
      "no-console": ["warn", { allow: ["error", "warn"] }],
    },
  },
  {
    files: ["**/*.{ts,tsx}"],
    languageOptions: {
      ecmaVersion: "latest",
      sourceType: "module",
      parserOptions: {
        ecmaFeatures: { jsx: true },
      },
    },
    rules: {
      "no-unused-vars": "off",
      "no-console": ["warn", { allow: ["error", "warn"] }],
    },
  },
]
