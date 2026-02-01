import fs from 'fs';
import path from 'path';

// Read the main reading.json file
const readingData = JSON.parse(fs.readFileSync('src/data/reading.json', 'utf8'));

// Create slow-bible-plan directory if it doesn't exist
const slowPlanDir = 'src/data/slow-bible-plan';
if (!fs.existsSync(slowPlanDir)) {
  fs.mkdirSync(slowPlanDir, { recursive: true });
}

// Split into monthly files
readingData.forEach(monthData => {
  const filename = `${monthData.month}.json`;
  const filepath = path.join(slowPlanDir, filename);
  
  fs.writeFileSync(filepath, JSON.stringify(monthData, null, 2));
  console.log(`Created: ${filepath}`);
});

console.log('Successfully split reading.json into monthly files in slow-bible-plan directory');
