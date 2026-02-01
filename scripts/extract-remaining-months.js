import fs from 'fs';
import path from 'path';

// Read the reading_2025.json file
const readingData = JSON.parse(fs.readFileSync('src/data/navigators-bible-plan/reading_2025.json', 'utf8'));

// Extract October, November, December
const monthsToExtract = ['October', 'November', 'December'];

monthsToExtract.forEach(monthName => {
  const monthData = readingData.find(m => m.month === monthName);
  if (monthData) {
    const filename = `${monthName}.json`;
    const filepath = path.join('src/data/navigators-bible-plan', filename);
    
    // Write the month data as a standalone JSON file
    fs.writeFileSync(filepath, JSON.stringify(monthData, null, 2));
    console.log(`Updated: ${filepath}`);
  } else {
    console.log(`Month ${monthName} not found`);
  }
});

console.log('Successfully extracted remaining months from reading_2025.json');
