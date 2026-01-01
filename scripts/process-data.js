/**
 * Literary Clock Data Processor
 * 
 * Converts litclock_annotated.csv to optimized quotes JSON.
 * 
 * Usage:
 *   1. Place litclock_annotated.csv in the scripts/ folder
 *   2. Run: node scripts/process-data.js
 *   3. Output: src/data/generated-quotes.json
 * 
 * CSV Format (pipe-delimited):
 *   Column 0: Time (HH:MM)
 *   Column 1: Time Phrase (the highlighted text)
 *   Column 2: Quote Text
 *   Column 3: Book Title
 *   Column 4: Author Name
 *   Column 5: Tags/Link (ignored)
 */

const fs = require('fs');
const path = require('path');

// Paths
const INPUT_FILE = path.join(__dirname, 'litclock_annotated.csv');
const OUTPUT_FILE = path.join(__dirname, '..', 'src', 'data', 'generated-quotes.json');

/**
 * Parse a pipe-delimited CSV line
 * Handles quoted fields that may contain the delimiter
 */
function parseLine(line) {
    const DELIMITER = '|';
    const result = [];
    let current = '';
    let inQuotes = false;

    for (let i = 0; i < line.length; i++) {
        const char = line[i];

        if (char === '"') {
            if (inQuotes && line[i + 1] === '"') {
                // Escaped quote ""
                current += '"';
                i++;
            } else {
                inQuotes = !inQuotes;
            }
        } else if (char === DELIMITER && !inQuotes) {
            result.push(current.trim());
            current = '';
        } else {
            current += char;
        }
    }

    // Don't forget the last field
    result.push(current.trim());
    return result;
}

/**
 * Main processing function
 */
function processCSV() {
    console.log('📖 Literary Clock Data Processor\n');
    console.log('='.repeat(50));

    // Check if input file exists
    if (!fs.existsSync(INPUT_FILE)) {
        console.error(`\n❌ Error: File not found!`);
        console.error(`   Expected: ${INPUT_FILE}`);
        console.log('\nPlease download litclock_annotated.csv from:');
        console.log('https://github.com/JohannesNE/literature-clock');
        process.exit(1);
    }

    console.log(`\n📂 Reading: ${INPUT_FILE}`);

    const content = fs.readFileSync(INPUT_FILE, 'utf-8');
    const lines = content.split('\n').filter(line => line.trim().length > 0);

    console.log(`📝 Total lines: ${lines.length}\n`);

    // Build quotes structure: Record<string, Quote[]>
    const quotes = {};
    let successCount = 0;
    let errorCount = 0;
    let firstQuote = null;

    for (let i = 0; i < lines.length; i++) {
        const line = lines[i];

        try {
            const fields = parseLine(line);

            // Need at least 5 columns: time, timePhrase, quote, title, author
            if (fields.length < 5) {
                errorCount++;
                continue;
            }

            const time = fields[0];        // "00:00"
            const timePhrase = fields[1];  // "midnight"
            const quoteText = fields[2];   // "While they were..."
            const title = fields[3];       // "The 101 Dalmatians"
            const author = fields[4];      // "Dodie Smith"

            // Validate time format (HH:MM)
            if (!/^\d{2}:\d{2}$/.test(time)) {
                errorCount++;
                continue;
            }

            // Skip if quote is empty
            if (!quoteText || quoteText.length === 0) {
                errorCount++;
                continue;
            }

            // Build quote with {{markers}} for highlighting
            let fullQuote = quoteText;

            // If timePhrase exists, wrap it with markers for highlighting
            if (timePhrase && timePhrase.length > 0) {
                // Case-insensitive replacement
                const regex = new RegExp(escapeRegex(timePhrase), 'i');
                if (regex.test(fullQuote)) {
                    fullQuote = fullQuote.replace(regex, `{{${timePhrase}}}`);
                }
            }

            const quoteObj = {
                quote: fullQuote,
                title: title || 'Unknown',
                author: author || 'Unknown',
                timePhrase: timePhrase || ''
            };

            // Add to array for this time
            if (!quotes[time]) {
                quotes[time] = [];
            }
            quotes[time].push(quoteObj);
            successCount++;

            // Log first successful quote for verification
            if (!firstQuote) {
                firstQuote = { time, ...quoteObj };
                console.log('✅ First parsed quote:');
                console.log(`   Time: ${time}`);
                console.log(`   Phrase: "${timePhrase}"`);
                console.log(`   Quote: "${quoteText.substring(0, 80)}..."`);
                console.log(`   Book: ${title}`);
                console.log(`   Author: ${author}\n`);
            }

        } catch (err) {
            errorCount++;
        }
    }

    // Statistics
    const timeSlots = Object.keys(quotes).length;
    const coverage = ((timeSlots / 1440) * 100).toFixed(1);
    const avgPerSlot = timeSlots > 0 ? (successCount / timeSlots).toFixed(1) : 0;

    console.log('='.repeat(50));
    console.log('\n📊 Processing Results:\n');
    console.log(`   ✅ Quotes imported: ${successCount}`);
    console.log(`   ⏰ Time slots covered: ${timeSlots} / 1440 (${coverage}%)`);
    console.log(`   📚 Avg quotes per minute: ${avgPerSlot}`);

    if (errorCount > 0) {
        console.log(`   ⚠️  Skipped entries: ${errorCount}`);
    }

    if (successCount === 0) {
        console.error('\n❌ No quotes were parsed! Check the CSV format.');
        process.exit(1);
    }

    // Write output
    console.log(`\n📤 Writing: ${OUTPUT_FILE}`);

    // Ensure output directory exists
    const outputDir = path.dirname(OUTPUT_FILE);
    if (!fs.existsSync(outputDir)) {
        fs.mkdirSync(outputDir, { recursive: true });
    }

    fs.writeFileSync(OUTPUT_FILE, JSON.stringify(quotes, null, 2), 'utf-8');

    const fileSizeKB = (fs.statSync(OUTPUT_FILE).size / 1024).toFixed(1);
    console.log(`   💾 File size: ${fileSizeKB} KB`);

    console.log('\n🎉 Done! Restart the dev server to use the new quotes.\n');
}

/**
 * Escape special regex characters in a string
 */
function escapeRegex(string) {
    return string.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}

// Run
processCSV();
