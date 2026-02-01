import fs from 'fs';

// Read February data
const februaryData = JSON.parse(fs.readFileSync('src/data/slow-bible-plan/February.json', 'utf8'));

// February 2025: Based on user saying Feb 1 is Sunday, the Sundays are: 1, 8, 15, 22
const sundayDays = [1, 8, 15, 22];

// January ended with: Matthew 11:1-19, Psalms 31, Genesis 27
// So February continues with: Matthew 11:20-30, Psalms 32, Genesis 28

let matthewIndex = 0;
let psalmsNum = 32;
let genesisChapter = 28;

// Matthew progression for February
const matthewReadings = [
  "11:20-30", "12:1-21", "12:22-37", "12:38-50", "13:1-23", "13:24-43", "13:44-58",
  "14:1-21", "14:22-36", "15:1-20", "15:21-39", "16:1-12", "16:13-28", "17:1-13",
  "17:14-27", "18:1-14", "18:15-35", "19:1-15", "19:16-30", "20:1-16", "20:17-34",
  "21:1-11", "21:12-22", "21:23-32", "22:1-14", "22:15-33", "22:34-46", "23:1-12"
];

februaryData.days.forEach(day => {
  if (sundayDays.includes(day.day)) {
    // Sunday: Only Psalms reading
    day.readings = [
      {
        "book": "Psalms",
        "verses": psalmsNum.toString()
      }
    ];
    console.log(`Day ${day.day} (Sunday): Only Psalms ${psalmsNum}`);
  } else {
    // Weekday: Matthew, Psalms, Genesis pattern
    day.readings = [
      {
        "book": "Matthew",
        "verses": matthewReadings[matthewIndex] || "11:20-30"
      },
      {
        "book": "Psalms",
        "verses": psalmsNum.toString()
      },
      {
        "book": "Genesis",
        "verses": genesisChapter.toString()
      }
    ];
    console.log(`Day ${day.day}: Matthew ${matthewReadings[matthewIndex]}, Psalms ${psalmsNum}, Genesis ${genesisChapter}`);
    matthewIndex++;
    genesisChapter++;
  }
  psalmsNum++;
});

// Write the fixed February data
fs.writeFileSync('src/data/slow-bible-plan/February.json', JSON.stringify(februaryData, null, 2));
console.log('Successfully updated February.json with Sunday pattern (Psalms only) and weekday progression');
