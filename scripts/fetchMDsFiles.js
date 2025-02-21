import fs from "fs";
import path from "path";
import fetch from "node-fetch";
import AdmZip from "adm-zip";
import dotenv from "dotenv";

dotenv.config();

const OWNER = "luancma";
const REPO = "blog-controller-api";
const TARGET_FOLDER = "uploads"; // Adjust this
const ASTRO_TARGET_FOLDER = "./data/blog";
const GITHUB_TOKEN = "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";

if (!GITHUB_TOKEN) {
  console.error("❌ Missing GITHUB_TOKEN in .env file");
  process.exit(1);
}

async function fetchAndExtractFolder() {
  console.log("📂 Downloading ZIP from GitHub...");

  const zipUrl = `https://api.github.com/repos/${OWNER}/${REPO}/zipball/main`;
  const response = await fetch(zipUrl, {
    headers: {
      Authorization: `token ${GITHUB_TOKEN}`,
      Accept: "application/vnd.github.v3+json",
    },
  });

  if (!response.ok) {
    console.error(`❌ Failed to download ZIP: ${response.statusText}`);
    process.exit(1);
  }

  const buffer = await response.buffer();
  fs.writeFileSync("repo.zip", buffer);

  console.log("📦 Extracting folder...");
  const zip = new AdmZip("repo.zip");
  zip.extractAllTo("repo_extracted", true);

  const extractedFolders = fs.readdirSync("repo_extracted");

  const repoFolder = extractedFolders.find((folder) => {
    return folder.startsWith(`${OWNER}-${REPO}`);
  });

  if (!repoFolder) {
    console.error("❌ Could not find extracted repo folder.");
    process.exit(1);
  }

  const fullFolderPath = path.join(
    "./repo_extracted",
    repoFolder,
    TARGET_FOLDER
  );

  if (!fs.existsSync(fullFolderPath)) {
    console.error(
      `❌ Folder ${TARGET_FOLDER} does not exist in the repository.`
    );
    process.exit(1);
  }

  function moveDirectory(src, dest) {
    console.log(`Moving ${src} to ${dest}`);
    if (!fs.existsSync(src)) {
      console.error("Source directory does not exist:", src);
      return;
    }

    // Ensure destination directory exists
    if (!fs.existsSync(path.dirname(dest))) {
      fs.mkdirSync(path.dirname(dest), { recursive: true });
    }

    // Rename (move) the directory
    fs.rename(src, dest, (err) => {
      if (err) {
        console.error("Error moving directory:", err);
      } else {
        console.log(`Successfully moved ${src} to ${dest}`);
      }
    });
  }

  fs.rmSync(ASTRO_TARGET_FOLDER, { recursive: true });

  moveDirectory(fullFolderPath, ASTRO_TARGET_FOLDER);

  // Cleanup
  fs.rmSync("repo.zip");
  fs.rmSync("repo_extracted", { recursive: true });
}

fetchAndExtractFolder();
