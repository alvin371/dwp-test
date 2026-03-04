import js from "@eslint/js";
import globals from "globals";
import reactHooks from "eslint-plugin-react-hooks";
import tseslint from "typescript-eslint";
import { defineConfig, globalIgnores } from "eslint/config";
import nextVitals from "eslint-config-next/core-web-vitals";
import nextTs from "eslint-config-next/typescript";

export default tseslint.config(
  { ignores: [".next", "out", "build", "next-env.d.ts", "node_modules"] },
  ...defineConfig([...nextVitals, ...nextTs, globalIgnores([".next/**", "out/**", "build/**", "next-env.d.ts"])]),
  {
    extends: [js.configs.recommended, ...tseslint.configs.recommended],
    files: ["**/*.{ts,tsx}"],
    languageOptions: {
      ecmaVersion: 2020,
      globals: globals.browser,
    },
    plugins: {
      "react-hooks": reactHooks,
    },
    rules: {
      ...reactHooks.configs.recommended.rules,
      "@typescript-eslint/no-duplicate-enum-values": "warn",
      "@typescript-eslint/no-unused-vars": "warn",
      "@typescript-eslint/no-explicit-any": "warn",
      "@typescript-eslint/no-empty-object-type": "warn",
      "no-async-promise-executor": "warn",
      "no-extra-boolean-cast": "warn",
      "prefer-const": "warn",
      "no-case-declarations": "off",
      "@typescript-eslint/no-unused-expressions": "off",
      "no-empty": "warn",
      "@typescript-eslint/ban-ts-comment": "warn",
      "@typescript-eslint/no-non-null-asserted-optional-chain": "warn",
      "@typescript-eslint/no-unsafe-function-type": "warn",
      "no-fallthrough": "warn",
      "no-constant-binary-expression": "warn",
      "no-useless-escape": "warn",
      "no-prototype-builtins": "warn",
      "no-unsafe-optional-chaining": "warn",
      "no-useless-catch": "warn",
      "react-hooks/exhaustive-deps": "warn",
      "react-hooks/rules-of-hooks": "error",
      "no-console": "warn",
    },
  },
);
