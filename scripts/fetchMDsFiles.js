import fs from "fs";
import path from "path";
import fetch from "node-fetch";
import dotenv from "dotenv";

dotenv.config();
const { ASTRO_TARGET_FOLDER, BACKEND_URL } = process.env;

await fetch(`${BACKEND_URL}/md-list`, {
  method: "GET",
  headers: {
    "Content-Type": "application/json",
  },
})
  .then((res) => res.json())
  .then((res) => {
    const downloadFile = async (url, dest) => {
      const response = await fetch(url);
      if (!response.ok) {
        throw new Error(`Failed to download file: ${response.statusText}`);
      }
      const arrayBuffer = await response.arrayBuffer();
      const buffer = Buffer.from(arrayBuffer);

      fs.writeFileSync(dest, buffer);
    };

    const downloadFiles = async (files) => {
      for (const file of files) {
        const fileUrl = file;
        const fileName = fileUrl.split("/").pop();
        const filePath = path.join(ASTRO_TARGET_FOLDER, fileName);
        await downloadFile(fileUrl, filePath);
        console.log(`Downloaded ${fileName}`);
      }
    };

    // delete all files in the folder 
    fs.readdirSync(ASTRO_TARGET_FOLDER).forEach((file) => {
      fs.unlinkSync(path.join(ASTRO_TARGET_FOLDER, file));
    });

    downloadFiles(res.files).catch((error) => {
      console.error("Error downloading files:", error);
    });
  })
  .catch((error) => {
    console.error("Error fetching files:", error);
  });
