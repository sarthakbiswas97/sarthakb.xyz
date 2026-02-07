// run with npx tsx scripts/folder-to-webp.ts

import * as fs from "fs";
import * as path from "path";
import * as readline from "readline";
import sharp from "sharp";

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
});

function question(prompt: string): Promise<string> {
  return new Promise((resolve) => {
    rl.question(prompt, (answer) => resolve(answer.trim()));
  });
}

async function walkFiles(dir: string): Promise<string[]> {
  const entries = await fs.promises.readdir(dir, { withFileTypes: true });
  const files: string[] = [];

  for (const entry of entries) {
    const fullPath = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      files.push(...(await walkFiles(fullPath)));
    } else if (entry.isFile()) {
      files.push(fullPath);
    }
  }

  return files;
}

async function convertToWebp(inputPath: string, outputPath: string) {
  await fs.promises.mkdir(path.dirname(outputPath), { recursive: true });
  await sharp(inputPath).rotate().webp({ quality: 85 }).toFile(outputPath);
}

async function main() {
  const inputFolderRaw = await question("Enter folder path to convert: ");
  const inputFolder = path.resolve(inputFolderRaw);

  const stat = await fs.promises.stat(inputFolder).catch(() => null);
  if (!stat || !stat.isDirectory()) {
    throw new Error("Invalid folder path. Please provide an existing directory.");
  }

  const folderName = path.basename(inputFolder);
  const outputRoot = path.join(process.cwd(), "uploads", folderName);
  await fs.promises.mkdir(outputRoot, { recursive: true });

  console.log(`\nScanning files in ${inputFolder}...`);
  const allFiles = await walkFiles(inputFolder);
  console.log(`Found ${allFiles.length} files. Starting conversion...\n`);

  let converted = 0;
  let skipped = 0;

  for (let i = 0; i < allFiles.length; i++) {
    const filePath = allFiles[i];
    const relativePath = path.relative(inputFolder, filePath);
    const outputPath = path
      .join(outputRoot, relativePath)
      .replace(/\.[^.]+$/, ".webp");

    try {
      await convertToWebp(filePath, outputPath);
      converted++;
      console.log(
        `[${i + 1}/${allFiles.length}] ✓ Converted ${relativePath} -> ${path.relative(process.cwd(), outputPath)}`,
      );
    } catch (err) {
      // Non-image files and unreadable files will fail in sharp; skip with log.
      skipped++;
      console.log(
        `[${i + 1}/${allFiles.length}] - Skipped ${relativePath}: ${(err as Error).message}`,
      );
    }
  }

  console.log(
    `\nDone. Converted ${converted} files. Skipped ${skipped} files. Output: ${outputRoot}`,
  );
}

main()
  .catch((err) => {
    console.error("Error:", (err as Error).message);
    process.exitCode = 1;
  })
  .finally(() => {
    rl.close();
  });
