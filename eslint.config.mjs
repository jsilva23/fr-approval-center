// @ts-check
import withNuxt from "./.nuxt/eslint.config.mjs";

const sourceFiles = ["**/*.{js,jsx,ts,tsx,vue,mjs,cjs}"];
const ignoredPaths = [
  "**/node_modules/**",
  "**/.nuxt/**",
  "**/.output/**",
  "**/dist/**",
  "**/coverage/**",
  "**/.vercel/**",
  "**/.netlify/**",
  "public/**",
];

export default withNuxt(
  {
    name: "workspace/base",
    files: sourceFiles,
    ignores: ignoredPaths,
    rules: {
      "curly": ["error", "all"],
      "eqeqeq": ["error", "always", { null: "ignore" }],
      "@stylistic/arrow-parens": ["error", "always"],
      "@stylistic/comma-dangle": ["error", {
        arrays: "always-multiline",
        objects: "always-multiline",
        imports: "always-multiline",
        exports: "always-multiline",
        functions: "never",
      }],
      "@stylistic/member-delimiter-style": ["error", {
        multiline: { delimiter: "semi", requireLast: true },
        singleline: { delimiter: "semi", requireLast: false },
      }],
      "@stylistic/operator-linebreak": ["error", "after", {
        overrides: {
          "=": "after",
          "||": "after",
          "&&": "after",
          "?": "after",
          ":": "after",
        },
      }],
      "@stylistic/quotes": ["error", "double", { allowTemplateLiterals: "always", avoidEscape: true }],
      "@stylistic/semi": ["error", "always"],
      "no-console": ["warn", { allow: ["warn", "error"] }],
      "no-debugger": "error",
      "no-duplicate-imports": ["error", { includeExports: true }],
      "no-useless-return": "error",
      "object-shorthand": ["error", "always"],
      "prefer-arrow-callback": ["error", { allowNamedFunctions: false, allowUnboundThis: false }],
      "prefer-const": ["error", { destructuring: "all" }],
    },
  },
  {
    name: "workspace/vue",
    files: ["**/*.vue"],
    rules: {
      "vue/max-attributes-per-line": "off",
      "vue/block-order": ["error", { order: ["script:not([setup])", "script[setup]", "template", "style"] }],
      "vue/component-name-in-template-casing": ["error", "PascalCase", { registeredComponentsOnly: false }],
      "vue/padding-line-between-blocks": ["error", "always"],
    },
  },
  {
    name: "workspace/tests",
    files: ["**/*.{spec,test}.{js,ts,jsx,tsx}", "**/__tests__/**/*.{js,ts,jsx,tsx}"],
    rules: {
      "no-console": "off",
    },
  }
);
