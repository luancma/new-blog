import axios from "axios";
import fs from "fs";
import path from "path";
import dotenv from "dotenv";
dotenv.config();

const {
  ASTRO_TARGET_FOLDER,
  GITHUB_BRANCH,
  GITHUB_FOLDER,
  GITHUB_OWNER,
  GITHUB_REPO,
  GITHUB_TOKEN,
} = process.env;

async function fetchFolder() {
  try {
    const url = `https://api.github.com/repos/${GITHUB_OWNER}/${GITHUB_REPO}/contents/${GITHUB_FOLDER}?ref=${GITHUB_BRANCH}`;
    const { data: files } = await axios.get(url, {
      headers: { Authorization: `Bearer ${GITHUB_TOKEN}` },
    });

    // Delete all files in the ASTRO_TARGET_FOLDER
    const targetFolderPath = path.join(ASTRO_TARGET_FOLDER);
    if (fs.existsSync(targetFolderPath)) {
      fs.rmSync(targetFolderPath, { recursive: true, force: true });
      console.log(`✅ Deleted files in: ${targetFolderPath}`);
    }

    for (const file of files) {
      if (file.type === "file") {
        await downloadFile(file.path);
      }
    }
  } catch (error) {
    console.error(
      "Error fetching folder:",
      error.response?.data || error.message
    );
  }
}

async function downloadFile(filePath) {
  try {
    const url = `https://api.github.com/repos/${GITHUB_OWNER}/${GITHUB_REPO}/contents/${filePath}?ref=${GITHUB_BRANCH}`;
    const { data: fileContent } = await axios.get(url, {
      headers: { Authorization: `Bearer ${GITHUB_TOKEN}` },
    });

    const content = Buffer.from(fileContent.content, "base64").toString("utf8");
    const localFilePath = path.join("data", "blog", filePath);
    fs.mkdirSync(path.dirname(localFilePath), { recursive: true });
    fs.writeFileSync(localFilePath, content);
    console.log(`✅ Downloaded: ${filePath}`);
  } catch (error) {
    console.error(
      `Error downloading file ${filePath}:`,
      error.response?.data || error.message
    );
  }
}

fetchFolder();
