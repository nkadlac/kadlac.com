import { parse } from 'csv-parse/sync';
import TurndownService from 'turndown';
import fs from 'fs';
import path from 'path';

const turndown = new TurndownService({
  headingStyle: 'atx',
  codeBlockStyle: 'fenced',
});

const csvPath = process.argv[2] || '/Users/natekadlac/Downloads/Book Notes.csv';
const outputDir = './src/content/notes';

console.log(`Reading CSV from: ${csvPath}`);
const csvContent = fs.readFileSync(csvPath, 'utf-8');

const records = parse(csvContent, {
  columns: true,
  skip_empty_lines: true,
  relax_quotes: true,
  relax_column_count: true,
});

console.log(`Found ${records.length} book notes`);

if (!fs.existsSync(outputDir)) {
  fs.mkdirSync(outputDir, { recursive: true });
}

let count = 0;
for (const record of records) {
  const slug = record.Slug;
  const title = record.Name;
  const rating = parseInt(record.Rating) || 8;
  const amazonUrl = record['Read on Amazon'] || '';
  const coverImage = record['Main Image'] || '';
  const description = record['Article Summary'] || '';
  const htmlContent = record['Book Review'] || '';

  // Extract author from title (format: "Book Title by Author Name")
  const authorMatch = title.match(/by\s+(.+)$/i);
  const author = authorMatch ? authorMatch[1] : 'Unknown Author';
  const cleanTitle = title.replace(/\s+by\s+.+$/i, '').trim();

  // Convert HTML to Markdown
  let markdown = '';
  if (htmlContent) {
    try {
      markdown = turndown.turndown(htmlContent);
    } catch (e) {
      console.error(`Error converting ${slug}:`, e.message);
      markdown = htmlContent;
    }
  }

  const frontmatter = `---
title: "${cleanTitle.replace(/"/g, '\\"')}"
author: "${author.replace(/"/g, '\\"')}"
rating: ${rating}
amazonUrl: "${amazonUrl}"
coverImage: "${coverImage}"
description: "${description.replace(/"/g, '\\"')}"
---`;

  const fileContent = `${frontmatter}

${markdown}
`;

  const filePath = path.join(outputDir, `${slug}.md`);
  fs.writeFileSync(filePath, fileContent);
  count++;
  console.log(`Created: ${slug}.md`);
}

console.log(`\nDone! Created ${count} book note files in ${outputDir}`);
