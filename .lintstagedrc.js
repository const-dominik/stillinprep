const path = require('path')
 
const buildEslintCommand = (filenames) => {
  const stagedFiles = filenames
    .map((f) => path.relative(process.cwd(), f))
    .filter((f) => f.startsWith("app"))
    .join(' --file ');

  if (stagedFiles.length === 0) return "next lint"

  return `next lint --fix --files ${stagedFiles}`;

}
module.exports = {
  '*.{js,jsx,ts,tsx}': [buildEslintCommand],
}