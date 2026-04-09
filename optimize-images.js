const fs = require("fs");
const path = require("path");
const sharp = require("sharp");

const inputDir = path.join(__dirname, "./public/images/projects");
const outputDir = path.join(__dirname, "./public/images/projects-optimized");

const MAX_SIZE = 100 * 1024; // 100KB

async function compressImage(inputPath, outputPath) {
  let quality = 80;
  let buffer;

  // Try reducing quality until under 100KB
  while (quality >= 30) {
    buffer = await sharp(inputPath)
      .webp({ quality })
      .toBuffer();

    if (buffer.length <= MAX_SIZE) break;
    quality -= 5;
  }

  await fs.promises.mkdir(path.dirname(outputPath), { recursive: true });
  await fs.promises.writeFile(outputPath, buffer);

  console.log(`✅ ${outputPath} (${Math.round(buffer.length / 1024)}KB)`);
}

async function processFolder(folder) {
  const items = await fs.promises.readdir(folder);

  for (const item of items) {
    const fullPath = path.join(folder, item);
    const stat = await fs.promises.stat(fullPath);

    if (stat.isDirectory()) {
      await processFolder(fullPath);
    } else if (path.extname(item).toLowerCase() === ".png") {
      const relativePath = path.relative(inputDir, fullPath);
      const outputPath = path.join(
        outputDir,
        relativePath.replace(".png", ".webp")
      );

      await compressImage(fullPath, outputPath);
    }
  }
}

(async () => {
  console.log("🚀 Optimizing images...");
  await processFolder(inputDir);
  console.log("🎉 Done!");
})();
