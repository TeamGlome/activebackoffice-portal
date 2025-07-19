import { dirname } from "path";
import { fileURLToPath } from "url";
import { FlatCompat } from "@eslint/eslintrc";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const compat = new FlatCompat({
  baseDirectory: __dirname,
});

const eslintConfig = [
  ...compat.extends("next/core-web-vitals", "next/typescript"),
  {
    languageOptions: {
      parserOptions: {
        warnOnUnsupportedTypeScriptVersion: false,
      },
    },
    rules: {
      "@typescript-eslint/no-unused-vars": "off",
      "react/no-unescaped-entities": "off",
      "@next/next/no-img-element": "off",
      "jsx-a11y/alt-text": "off",
      // Allow any types for Chart.js callback functions - third-party library constraint
      "@typescript-eslint/no-explicit-any": [
        "error",
        {
          "ignoreRestArgs": true
        }
      ]
    },
  },
  {
    files: ["src/components/charts/*.tsx", "src/components/CustomizableDashboard.tsx"],
    rules: {
      // Allow any types in Chart.js components for callback functions
      "@typescript-eslint/no-explicit-any": "warn"
    }
  }
];

export default eslintConfig;
