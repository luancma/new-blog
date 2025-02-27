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
      const buffer = await response.buffer();
      fs.writeFileSync(dest, buffer);
    };

    const downloadFiles = async (files) => {
      console.log(files)
      for (const file of files) {
        const fileUrl = file;
        const fileName = fileUrl.split("/").pop();
        const filePath = path.join(ASTRO_TARGET_FOLDER, fileName);
        await downloadFile(fileUrl, filePath);
        console.log(`Downloaded ${fileName}`);
      }
    };    

    downloadFiles(res.files).catch((error) => {
      console.error("Error downloading files:", error);
    });
  });
