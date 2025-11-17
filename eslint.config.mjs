import { defineConfig, globalIgnores } from "eslint/config";
import { fixupConfigRules } from "@eslint/compat";
import path from "node:path";
import { fileURLToPath } from "node:url";
import js from "@eslint/js";
import { FlatCompat } from "@eslint/eslintrc";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const compat = new FlatCompat({
    baseDirectory: __dirname,
    recommendedConfig: js.configs.recommended,
    allConfig: js.configs.all
});

export default defineConfig([globalIgnores(["!**/.*", "**/dist", "**/node_modules"]), {
    extends: fixupConfigRules(compat.extends(
        "next/core-web-vitals",
        "next/typescript",
        "prettier",
        "plugin:import/typescript",
        "plugin:import/recommended",
    )),

    settings: {
        "import/resolver": {
            typescript: true,
                node: true,
            },
    },
}]);