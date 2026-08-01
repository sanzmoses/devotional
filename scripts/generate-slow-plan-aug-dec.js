import fs from 'fs';
import path from 'path';

// Regenerates August–December of the Slow Bible Plan as a true 3-book
// continuation of January–July.
//
// End of July: Luke 15:1-10 | Song of Songs 8 | Deuteronomy 29
//
// Three columns (matching the Jan–July pattern):
//   1. Gospel:  Luke 15:11 -> end of Luke -> John -> Acts   (weekdays only)
//   2. Wisdom:  Job -> Isaiah -> Jeremiah ...               (EVERY day, the anchor)
//   3. OT:      Deuteronomy 30 -> Joshua -> Judges ...      (weekdays only)
//
// Rest day = Saturday (matching Jan–July), shown as a single wisdom reading.

const YEAR = 2025;
const OUT_DIR = path.join('src', 'data', 'slow-bible-plan');

// --- Column 1: Gospel pericopes (reused from the existing pericope splits) ---
const gospel = [
  // Luke 15:11 -> 24:53
  ['Luke', '15:11-32'], ['Luke', '16:1-9'], ['Luke', '16:10-18'], ['Luke', '16:19-31'],
  ['Luke', '17:1-10'], ['Luke', '17:11-19'], ['Luke', '17:20-37'], ['Luke', '18:1-8'],
  ['Luke', '18:9-17'], ['Luke', '18:18-30'], ['Luke', '18:31-43'], ['Luke', '19:1-10'],
  ['Luke', '19:11-27'], ['Luke', '19:28-38'], ['Luke', '19:39-48'], ['Luke', '20:1-8'],
  ['Luke', '20:9-19'], ['Luke', '20:20-26'], ['Luke', '20:27-40'], ['Luke', '20:41-47'],
  ['Luke', '21:1-19'], ['Luke', '21:20-28'], ['Luke', '21:29-38'], ['Luke', '22:1-13'],
  ['Luke', '22:14-23'], ['Luke', '22:24-30'], ['Luke', '22:31-38'], ['Luke', '22:39-46'],
  ['Luke', '22:47-53'], ['Luke', '22:54-62'], ['Luke', '22:63-71'], ['Luke', '23:1-12'],
  ['Luke', '23:13-25'], ['Luke', '23:26-31'], ['Luke', '23:32-37'], ['Luke', '23:38-43'],
  ['Luke', '23:44-49'], ['Luke', '23:50-56'], ['Luke', '24:1-12'], ['Luke', '24:13-27'],
  ['Luke', '24:28-35'], ['Luke', '24:36-44'], ['Luke', '24:45-53'],
  // John 1 -> 21
  ['John', '1:1-18'], ['John', '1:19-28'], ['John', '1:29-34'], ['John', '1:35-42'],
  ['John', '1:43-51'], ['John', '2:1-11'], ['John', '2:12-25'], ['John', '3:1-15'],
  ['John', '3:16-21'], ['John', '3:22-36'], ['John', '4:1-14'], ['John', '4:15-26'],
  ['John', '4:27-42'], ['John', '4:43-54'], ['John', '5:1-15'], ['John', '5:16-30'],
  ['John', '5:31-47'], ['John', '6:1-15'], ['John', '6:16-24'], ['John', '6:25-40'],
  ['John', '6:41-59'], ['John', '6:60-71'], ['John', '7:1-13'], ['John', '7:14-24'],
  ['John', '7:25-36'], ['John', '7:37-44'], ['John', '7:45-53'], ['John', '8:1-11'],
  ['John', '8:12-20'], ['John', '8:21-30'], ['John', '8:31-47'], ['John', '8:48-59'],
  ['John', '9:1-12'], ['John', '9:13-25'], ['John', '9:26-41'], ['John', '10:1-10'],
  ['John', '10:11-21'], ['John', '10:22-42'], ['John', '11:1-16'], ['John', '11:17-37'],
  ['John', '11:38-44'], ['John', '11:45-57'], ['John', '12:1-11'], ['John', '12:12-19'],
  ['John', '12:20-36'], ['John', '12:37-50'], ['John', '13:1-11'], ['John', '13:12-17'],
  ['John', '13:18-30'], ['John', '13:31-38'], ['John', '14:1-14'], ['John', '14:15-21'],
  ['John', '14:22-31'], ['John', '15:1-8'], ['John', '15:9-17'], ['John', '15:18-27'],
  ['John', '16:1-11'], ['John', '16:12-24'], ['John', '16:25-33'], ['John', '17:1-5'],
  ['John', '17:6-19'], ['John', '17:20-26'], ['John', '18:1-18'], ['John', '18:19-27'],
  ['John', '18:28-40'], ['John', '19:1-16'], ['John', '19:17-27'], ['John', '19:28-37'],
  ['John', '19:38-42'], ['John', '20:1-9'], ['John', '20:10-18'], ['John', '20:19-23'],
  ['John', '20:24-31'], ['John', '21:1-14'], ['John', '21:15-25'],
  // Acts (continues the NT narrative once the Gospels finish)
  ['Acts', '1:1-11'], ['Acts', '1:12-26'], ['Acts', '2:1-13'], ['Acts', '2:14-21'],
  ['Acts', '2:22-36'], ['Acts', '2:37-47'], ['Acts', '3:1-10'], ['Acts', '3:11-26'],
  ['Acts', '4:1-12'], ['Acts', '4:13-22'], ['Acts', '4:23-31'], ['Acts', '4:32-37'],
  ['Acts', '5:1-11'], ['Acts', '5:12-16'], ['Acts', '5:17-32'], ['Acts', '5:33-42'],
  ['Acts', '6:1-7'], ['Acts', '6:8-15'], ['Acts', '7:1-19'], ['Acts', '7:20-43'],
];

// --- Column 2: Wisdom/anchor (one chapter every day) ---
function chapters(book, from, to) {
  const out = [];
  for (let c = from; c <= to; c++) out.push([book, String(c)]);
  return out;
}
const wisdom = [
  ...chapters('Job', 1, 42),
  ...chapters('Isaiah', 1, 66),
  ...chapters('Jeremiah', 1, 52),
  ...chapters('Lamentations', 1, 5),
];

// --- Column 3: OT law/history (one chapter per weekday) ---
const ot = [
  ...chapters('Deuteronomy', 30, 34),
  ...chapters('Joshua', 1, 24),
  ...chapters('Judges', 1, 21),
  ...chapters('Ruth', 1, 4),
  ...chapters('1 Samuel', 1, 31),
  ...chapters('2 Samuel', 1, 24),
  ...chapters('1 Kings', 1, 22),
  ...chapters('2 Kings', 1, 25),
];

const reading = ([book, verses]) => ({ book, verses });

const MONTHS = [
  ['August', 7], ['September', 8], ['October', 9], ['November', 10], ['December', 11],
];

let gi = 0; // gospel index (advances on weekdays)
let wi = 0; // wisdom index (advances every day)
let oi = 0; // OT index (advances on weekdays)

for (const [monthName, monthIdx] of MONTHS) {
  const daysInMonth = new Date(YEAR, monthIdx + 1, 0).getDate();
  const days = [];

  for (let day = 1; day <= daysInMonth; day++) {
    const isSaturday = new Date(YEAR, monthIdx, day).getDay() === 6;
    let readings;

    if (isSaturday) {
      // Rest day: the anchor (wisdom) reading only.
      readings = [reading(wisdom[wi++])];
    } else {
      readings = [
        reading(gospel[gi++]),
        reading(wisdom[wi++]),
        reading(ot[oi++]),
      ];
    }

    days.push({ day, readings });
  }

  const filepath = path.join(OUT_DIR, `${monthName}.json`);
  fs.writeFileSync(filepath, JSON.stringify({ month: monthName, days }, null, 2) + '\n');
  console.log(`Wrote ${filepath}`);
}

console.log(`\nUsed: gospel ${gi}/${gospel.length}, wisdom ${wi}/${wisdom.length}, OT ${oi}/${ot.length}`);
console.log(`Last gospel: ${gospel[gi - 1].join(' ')}`);
console.log(`Last wisdom: ${wisdom[wi - 1].join(' ')}`);
console.log(`Last OT:     ${ot[oi - 1].join(' ')}`);
