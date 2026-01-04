import { parse } from 'csv-parse/sync';
import TurndownService from 'turndown';
import fs from 'fs';
import path from 'path';

const turndown = new TurndownService({
  headingStyle: 'atx',
  codeBlockStyle: 'fenced',
});

const csvPath = process.argv[2] || '/Users/natekadlac/Downloads/Projects.csv';
const outputDir = './src/content/projects';

console.log(`Reading CSV from: ${csvPath}`);
const csvContent = fs.readFileSync(csvPath, 'utf-8');

const records = parse(csvContent, {
  columns: true,
  skip_empty_lines: true,
  relax_quotes: true,
  relax_column_count: true,
});

console.log(`Found ${records.length} projects`);

if (!fs.existsSync(outputDir)) {
  fs.mkdirSync(outputDir, { recursive: true });
}

let count = 0;
for (const record of records) {
  const slug = record.Slug;
  const title = record['Project Title'] || '';
  const description = record['Project Summary'] || '';
  const client = record.Client || '';
  const coverImage = record['Portfolio Cover'] || record.Thumbnail || '';
  const services = record.Services || '';
  const liveUrl = record['Live URL'] || '';
  const htmlContent = record['Project Details'] || '';

  // Parse services into tags array
  const tags = services ? services.split(',').map(s => s.trim()).filter(Boolean) : [];

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
title: "${title.replace(/"/g, '\\"')}"
client: "${client.replace(/"/g, '\\"')}"
description: "${description.replace(/"/g, '\\"')}"
coverImage: "${coverImage}"
tags: [${tags.map(t => `"${t}"`).join(', ')}]
${liveUrl ? `liveUrl: "${liveUrl}"` : ''}
order: ${count + 1}
---`;

  const fileContent = `${frontmatter}

${markdown}
`;

  const filePath = path.join(outputDir, `${slug}.md`);
  fs.writeFileSync(filePath, fileContent);
  count++;
  console.log(`Created: ${slug}.md`);
}

console.log(`\nDone! Created ${count} project files in ${outputDir}`);
