import path from "path";

const buildEslintCommand = (filenames) => {
    const stagedFiles = filenames
        .map((f) => path.relative(process.cwd(), f))
        .filter((f) => f.startsWith("src") || f.startsWith("__tests__"))
        .map((f) => `"${f}"`)
        .join(" ");

    if (!stagedFiles) return "";
    return `npx eslint ${stagedFiles}`;
};

const settings = {
    "*.{js,jsx,ts,tsx}": [buildEslintCommand],
    "**/*.scss": ["stylelint --fix"],
    "*.{js,jsx,ts,tsx,json,css,scss,md}": ["prettier --write"],
};

export default settings;
