/**
 * Generate Turkish syllable transliteration from source data.
 *
 * Usage: node generate.js
 *
 * Reads:
 *   data/quranwbw-syllables.json      (QuranWBW word-by-word English transliteration)
 *   data/acikkuran-turkish-phonetic.json (Açık Kuran Turkish phonetic transliteration)
 *
 * Writes:
 *   output/turkish-syllables.json     (Turkish word-by-word syllable transliteration)
 */

const fs = require("fs");
const path = require("path");
const { convertAll } = require("./src/convert");

const wbwData = JSON.parse(
  fs.readFileSync(
    path.join(__dirname, "data/quranwbw-syllables.json"),
    "utf-8"
  )
);

const turkishData = JSON.parse(
  fs.readFileSync(
    path.join(__dirname, "data/acikkuran-turkish-phonetic.json"),
    "utf-8"
  )
);

console.log("Converting...");
const { result, stats } = convertAll(wbwData, turkishData);

fs.writeFileSync(
  path.join(__dirname, "output/turkish-syllables.json"),
  JSON.stringify(result, null, 2),
  "utf-8"
);

console.log(`Done. ${stats.processed} ayet islendi, ${stats.errors} hata.`);

if (stats.errorVerses.length > 0) {
  console.log(`Hata ayetleri: ${stats.errorVerses.join(", ")}`);
}

// Sample output
const samples = ["1:1", "1:4", "2:255", "36:1", "112:1"];
console.log("\nOrnekler:");
for (const v of samples) {
  if (result[v]) {
    console.log(`  ${v}: ${result[v].join(" ")}`);
  }
}
