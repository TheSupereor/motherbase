import path from "node:path";
import js from "@eslint/js";
import { defineConfig, includeIgnoreFile } from "eslint/config";
import tseslint from "typescript-eslint";

const gitIgnorePath = path.join(import.meta.dirname, ".gitignore");

export default defineConfig([
  {
    extends: [js.configs.recommended],
  },
  ...tseslint.configs.strictTypeChecked,
  includeIgnoreFile(gitIgnorePath, { gitignoreResolution: true }),
  {
    rules: {
      // common in NestJS
      "@typescript-eslint/no-extraneous-class": [
        "error",
        {
          allowWithDecorator: true,
        },
      ],
    },
  },
  {
    languageOptions: {
      parserOptions: {
        projectService: true,
        tsconfigRootDir: import.meta.dirname,
      },
    },
  },
]);
