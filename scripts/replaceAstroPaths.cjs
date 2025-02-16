const fs = require("fs");
const path = require("path");

const distDir = path.join(__dirname, "../dist");

function replaceAstroPaths(filePath) {
  const content = fs.readFileSync(filePath, "utf8");
  const updatedContent = content.replace(/\/_astro/g, "_astro");
  fs.writeFileSync(filePath, updatedContent, "utf8");
}

function processDirectory(directory) {
  const files = fs.readdirSync(directory);

  files.forEach((file) => {
    const fullPath = path.join(directory, file);
    const stat = fs.statSync(fullPath);

    if (stat.isDirectory()) {
      processDirectory(fullPath);
    } else if (stat.isFile() && path.extname(fullPath) === ".html") {
      replaceAstroPaths(fullPath);
    }
  });
}

processDirectory(distDir);
