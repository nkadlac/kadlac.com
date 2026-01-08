import fs from 'fs';
import path from 'path';
import sharp from 'sharp';

const CONTENT_DIR = './src/content';
const OUTPUT_DIR = './public/images/articles';

// Ensure output directory exists
if (!fs.existsSync(OUTPUT_DIR)) {
  fs.mkdirSync(OUTPUT_DIR, { recursive: true });
}

// Find all markdown files
function findMarkdownFiles(dir) {
  const files = [];
  const entries = fs.readdirSync(dir, { withFileTypes: true });

  for (const entry of entries) {
    const fullPath = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      files.push(...findMarkdownFiles(fullPath));
    } else if (entry.name.endsWith('.md') || entry.name.endsWith('.mdx')) {
      files.push(fullPath);
    }
  }
  return files;
}

// Extract all Framer URLs from content
function extractFramerUrls(content) {
  const regex = /https:\/\/framerusercontent\.com\/images\/[^\s"')>\]]+/g;
  return [...new Set(content.match(regex) || [])];
}

// Generate a clean filename from URL
function urlToFilename(url) {
  // Extract the hash/id from the URL
  const match = url.match(/\/images\/([^.]+)/);
  if (match) {
    // Clean up the ID and add extension
    const id = match[1].replace(/[^a-zA-Z0-9]/g, '');
    return `${id.substring(0, 20)}.webp`;
  }
  // Fallback: hash the URL
  const hash = url.split('/').pop().split('.')[0].substring(0, 20);
  return `${hash}.webp`;
}

// Download and convert image
async function downloadImage(url, outputPath) {
  try {
    const response = await fetch(url);
    if (!response.ok) {
      console.error(`  Failed to fetch: ${url} (${response.status})`);
      return false;
    }

    const buffer = Buffer.from(await response.arrayBuffer());

    // Convert to WebP with sharp
    await sharp(buffer)
      .webp({ quality: 85 })
      .toFile(outputPath);

    return true;
  } catch (error) {
    console.error(`  Error downloading ${url}: ${error.message}`);
    return false;
  }
}

async function main() {
  console.log('Scanning for Framer images...\n');

  const markdownFiles = findMarkdownFiles(CONTENT_DIR);
  console.log(`Found ${markdownFiles.length} markdown files\n`);

  // Collect all unique URLs and their mappings
  const urlMap = new Map(); // framer URL -> local path
  const fileContents = new Map(); // file path -> content

  for (const file of markdownFiles) {
    const content = fs.readFileSync(file, 'utf-8');
    fileContents.set(file, content);

    const urls = extractFramerUrls(content);
    for (const url of urls) {
      if (!urlMap.has(url)) {
        const filename = urlToFilename(url);
        urlMap.set(url, `/images/articles/${filename}`);
      }
    }
  }

  console.log(`Found ${urlMap.size} unique Framer images\n`);

  // Download all images
  let downloaded = 0;
  let failed = 0;

  for (const [url, localPath] of urlMap) {
    const outputPath = path.join('.', 'public', localPath);

    // Skip if already downloaded
    if (fs.existsSync(outputPath)) {
      console.log(`  Skipping (exists): ${path.basename(outputPath)}`);
      downloaded++;
      continue;
    }

    process.stdout.write(`  Downloading: ${path.basename(outputPath)}...`);
    const success = await downloadImage(url, outputPath);

    if (success) {
      console.log(' done');
      downloaded++;
    } else {
      console.log(' FAILED');
      failed++;
    }

    // Small delay to avoid rate limiting
    await new Promise(r => setTimeout(r, 100));
  }

  console.log(`\nDownloaded: ${downloaded}, Failed: ${failed}\n`);

  // Update markdown files
  console.log('Updating markdown files...\n');
  let filesUpdated = 0;

  for (const [file, originalContent] of fileContents) {
    let newContent = originalContent;
    let changed = false;

    for (const [url, localPath] of urlMap) {
      if (newContent.includes(url)) {
        newContent = newContent.split(url).join(localPath);
        changed = true;
      }
    }

    if (changed) {
      fs.writeFileSync(file, newContent);
      console.log(`  Updated: ${path.relative('.', file)}`);
      filesUpdated++;
    }
  }

  console.log(`\nUpdated ${filesUpdated} files`);
  console.log('\nDone!');
}

main().catch(console.error);
