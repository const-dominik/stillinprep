import path from "path";

const buildEslintCommand = (filenames) => {
  const stagedFiles = filenames
    .map((f) => path.relative(process.cwd(), f))
    .filter((f) => f.startsWith("src") || f.startsWith("__tests__"))
    .join(" --file ");

  if (!stagedFiles) return "next lint";
  return `next lint --fix --file ${stagedFiles}`;
};

export default {
  "*.{js,jsx,ts,tsx}": [buildEslintCommand],
  "**/*.scss": ["npx stylelint --fix"],
  "*.{js,jsx,ts,tsx,json,css,scss,md}": ["prettier --write"],
};