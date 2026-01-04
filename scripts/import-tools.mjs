import { parse } from 'csv-parse/sync';
import fs from 'fs';

const csvPath = process.argv[2] || '/Users/natekadlac/Downloads/Tools.csv';
const outputPath = './src/content/toolkit/items.json';

console.log(`Reading CSV from: ${csvPath}`);
const csvContent = fs.readFileSync(csvPath, 'utf-8');

const records = parse(csvContent, {
  columns: true,
  skip_empty_lines: true,
  relax_quotes: true,
  relax_column_count: true,
});

console.log(`Found ${records.length} tools`);

// Map Framer categories to our enum
const categoryMap = {
  'Books': 'books',
  'Health': 'health',
  'Design': 'design',
  'Drawing': 'drawing',
  'Writing': 'writing',
  'Tech': 'tech',
};

const items = records.map(record => ({
  name: record.Title || '',
  category: categoryMap[record.Type] || 'tech',
  description: record.Category || '',  // Category is actually the sub-description
  url: record['Affiliate Link'] || '',
  image: record['Cover Image'] || '',
  reviewUrl: record.Review || '',
})).filter(item => item.name && item.url);

const output = { items };

// Ensure directory exists
const dir = './src/content/toolkit';
if (!fs.existsSync(dir)) {
  fs.mkdirSync(dir, { recursive: true });
}

fs.writeFileSync(outputPath, JSON.stringify(output, null, 2));
console.log(`\nDone! Created ${items.length} toolkit items in ${outputPath}`);
