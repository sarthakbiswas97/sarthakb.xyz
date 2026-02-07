// run with npx tsx scripts/media-pipeline.ts

import * as https from "https";
import * as fs from "fs";
import * as path from "path";
import * as readline from "readline";
import sharp from "sharp";

interface MediaItem {
  url: string;
  type: "image" | "video";
}

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
});

function question(prompt: string): Promise<string> {
  return new Promise((resolve) => {
    rl.question(prompt, (answer) => {
      resolve(answer);
    });
  });
}

function fetchPage(url: string): Promise<string> {
  return new Promise((resolve, reject) => {
    https
      .get(url, (res) => {
        let data = "";
        res.on("data", (chunk) => (data += chunk));
        res.on("end", () => resolve(data));
      })
      .on("error", reject);
  });
}

function extractMediaUrls(html: string): MediaItem[] {
  const items: MediaItem[] = [];
  const photoRegex = /\["(https:\/\/lh3\.googleusercontent\.com\/[^"]+)"/g;
  const videoRegex =
    /\["(https:\/\/video-downloads\.googleusercontent\.com\/[^"]+)"/g;

  const seen = new Set<string>();

  let match;
  while ((match = photoRegex.exec(html)) !== null) {
    const url = match[1].replace(/\\u003d/g, "=");
    if (!seen.has(url)) {
      seen.add(url);
      items.push({ url, type: "image" });
    }
  }

  while ((match = videoRegex.exec(html)) !== null) {
    const url = match[1].replace(/\\u003d/g, "=");
    if (!seen.has(url)) {
      seen.add(url);
      items.push({ url, type: "video" });
    }
  }

  return items;
}

function downloadFile(url: string, filepath: string): Promise<void> {
  return new Promise((resolve, reject) => {
    const file = fs.createWriteStream(filepath);

    https
      .get(url, (response) => {
        if (response.statusCode === 302 || response.statusCode === 301) {
          file.close();
          fs.unlinkSync(filepath);
          return downloadFile(response.headers.location!, filepath)
            .then(resolve)
            .catch(reject);
        }

        response.pipe(file);
        file.on("finish", () => {
          file.close();
          resolve();
        });
      })
      .on("error", (err) => {
        fs.unlink(filepath, () => {});
        reject(err);
      });
  });
}

async function convertImageToWebp(inputPath: string, outputPath: string) {
  await sharp(inputPath).rotate().webp({ quality: 85 }).toFile(outputPath);
}

async function main() {
  console.log("Google Photos Downloader\n");

  const albumUrl = await question("Enter Google Photos album URL: ");

  if (!albumUrl.includes("photos.google.com")) {
    console.error("Invalid Google Photos URL");
    process.exit(1);
  }

  console.log("\nFetching album...");
  const html = await fetchPage(albumUrl);

  const media = extractMediaUrls(html);
  console.log(
    `Found ${media.length} items (${media.filter((m) => m.type === "image").length} images, ${media.filter((m) => m.type === "video").length} videos)\n`,
  );

  if (media.length === 0) {
    console.error("No media found in album");
    process.exit(1);
  }

  const uploadsDir = path.join(process.cwd(), "uploads");
  if (!fs.existsSync(uploadsDir)) {
    fs.mkdirSync(uploadsDir, { recursive: true });
  }

  for (let i = 0; i < media.length; i++) {
    const item = media[i];
    const ext = item.type === "video" ? ".mp4" : ".jpg";
    const filename = `${i + 1}${ext}`;
    const filepath = path.join(uploadsDir, filename);

    console.log(
      `[${i + 1}/${media.length}] Downloading ${item.type}: ${filename}`,
    );

    try {
      const fullUrl = item.url.includes("=d") ? item.url : item.url + "=d";
      await downloadFile(fullUrl, filepath);

      if (item.type === "image") {
        const webpPath = path.join(uploadsDir, `${i + 1}.webp`);
        await convertImageToWebp(filepath, webpPath);
        fs.unlinkSync(filepath);
        console.log(
          `[${i + 1}/${media.length}] ✓ Saved image as ${webpPath} (source removed)`,
        );
      } else {
        console.log(`[${i + 1}/${media.length}] ✓ Saved to ${filepath}`);
      }
    } catch (err) {
      console.error(
        `[${i + 1}/${media.length}] ✗ Error: ${(err as Error).message}`,
      );
    }
  }

  console.log(`\nDone! Downloaded ${media.length} items to ${uploadsDir}`);
  rl.close();
}

main().catch((err) => {
  console.error("Error:", err);
  rl.close();
  process.exit(1);
});
