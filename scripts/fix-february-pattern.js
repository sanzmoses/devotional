import fs from 'fs';

// Read February data
const februaryData = JSON.parse(fs.readFileSync('src/data/slow-bible-plan/February.json', 'utf8'));

// Fix February to follow January's 3-book pattern (Matthew, Psalms, Genesis)
// Days 1-8 are already fixed, fix days 10 and beyond
const daysToFix = [10, 11, 12, 13, 14, 15, 17, 18, 19, 20, 21, 22, 24, 25, 26, 27, 28];

daysToFix.forEach(dayNum => {
  const dayIndex = februaryData.days.findIndex(d => d.day === dayNum);
  if (dayIndex !== -1 && februaryData.days[dayIndex].readings.length > 3) {
    const readings = februaryData.days[dayIndex].readings;
    
    // Keep Matthew and Psalms, replace other books with Genesis
    const newReadings = [];
    let matthewReading = readings.find(r => r.book === 'Matthew');
    let psalmsReading = readings.find(r => r.book === 'Psalms');
    
    if (matthewReading) newReadings.push(matthewReading);
    if (psalmsReading) newReadings.push(psalmsReading);
    
    // Add Genesis reading with progressive chapter numbers
    const genesisChapter = 27 + dayNum; // Starting from Genesis chapter 37 for day 10
    newReadings.push({
      "book": "Genesis",
      "verses": genesisChapter.toString()
    });
    
    februaryData.days[dayIndex].readings = newReadings;
    console.log(`Fixed day ${dayNum}: reduced from ${readings.length} to ${newReadings.length} books`);
  }
});

// Write the fixed February data
fs.writeFileSync('src/data/slow-bible-plan/February.json', JSON.stringify(februaryData, null, 2));
console.log('Successfully updated February.json to follow January pattern');
