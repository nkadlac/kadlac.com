import { parse } from 'csv-parse/sync';
import TurndownService from 'turndown';
import fs from 'fs';
import path from 'path';

const turndown = new TurndownService({
  headingStyle: 'atx',
  codeBlockStyle: 'fenced',
});

// Map Framer "Option" field to our category enum
const categoryMap = {
  'Design': 'design',
  'Personal': 'personal',
  'Visual': 'visual',
  'Books': 'books',
};

// Read and parse CSV
const csvPath = process.argv[2] || '/Users/natekadlac/Downloads/Articles.csv';
const outputDir = './src/content/articles';

console.log(`Reading CSV from: ${csvPath}`);
const csvContent = fs.readFileSync(csvPath, 'utf-8');

const records = parse(csvContent, {
  columns: true,
  skip_empty_lines: true,
  relax_quotes: true,
  relax_column_count: true,
});

console.log(`Found ${records.length} articles`);

// Ensure output directory exists
if (!fs.existsSync(outputDir)) {
  fs.mkdirSync(outputDir, { recursive: true });
}

let count = 0;
for (const record of records) {
  const slug = record.Slug;
  const title = record.Title;
  const date = record.Date ? record.Date.split('T')[0] : new Date().toISOString().split('T')[0];
  const category = categoryMap[record.Option] || 'design';
  const description = record['Post Summary'] || record.Subhead || '';
  const image = record.Image || '';
  const htmlContent = record['Post Body'] || '';

  // Convert HTML to Markdown
  let markdown = '';
  if (htmlContent) {
    try {
      markdown = turndown.turndown(htmlContent);
    } catch (e) {
      console.error(`Error converting ${slug}:`, e.message);
      markdown = htmlContent; // fallback to raw HTML
    }
  }

  // Build frontmatter
  const frontmatter = `---
title: "${title.replace(/"/g, '\\"')}"
date: ${date}
category: ${category}
description: "${description.replace(/"/g, '\\"')}"
${image ? `image: "${image}"` : ''}
---`;

  const fileContent = `${frontmatter}

${markdown}
`;

  // Write file
  const filePath = path.join(outputDir, `${slug}.md`);
  fs.writeFileSync(filePath, fileContent);
  count++;
  console.log(`Created: ${slug}.md`);
}

console.log(`\nDone! Created ${count} article files in ${outputDir}`);
