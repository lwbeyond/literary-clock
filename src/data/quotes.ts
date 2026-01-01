// Quote data structure with O(1) lookup by time
export interface Quote {
  quote: string;
  title: string;
  author: string;
  timePhrase: string;
}

// Try to import generated quotes, fall back to mock data
let generatedQuotes: Record<string, Quote[]> | null = null;

try {
  // This will be populated by running: node scripts/process-data.js
  generatedQuotes = require('./generated-quotes.json');
} catch {
  // Generated quotes not available, will use mock data
}

// Mock data for development (expanded to arrays for consistency)
const MOCK_QUOTES: Record<string, Quote[]> = {
  "22:25": [{
    quote: "It was exactly {{twenty-five past ten}} when I reached the bend in the road, where the trees opened to reveal the manor house standing dark against the sky.",
    title: "The Return of Dorian",
    author: "Oscar Wilde",
    timePhrase: "twenty-five past ten"
  }],
  "22:26": [{
    quote: "The clock in the hall struck {{twenty-six minutes past ten}}. Mrs. Dalloway said she would buy the flowers herself.",
    title: "Mrs Dalloway",
    author: "Virginia Woolf",
    timePhrase: "twenty-six minutes past ten"
  }],
  "22:27": [{
    quote: "At {{twenty-seven past ten}} the stranger appeared at the garden gate, his coat still wet from the evening rain.",
    title: "Great Expectations",
    author: "Charles Dickens",
    timePhrase: "twenty-seven past ten"
  }],
  "22:28": [{
    quote: "By {{twenty-eight minutes past ten}}, all the guests had arrived except one—the person everyone was waiting for.",
    title: "Murder on the Orient Express",
    author: "Agatha Christie",
    timePhrase: "twenty-eight minutes past ten"
  }],
  "22:29": [{
    quote: "The minute hand moved to {{twenty-nine past ten}}. In sixty seconds, everything would change.",
    title: "1984",
    author: "George Orwell",
    timePhrase: "twenty-nine past ten"
  }],
  "22:30": [{
    quote: "The clock struck {{half past ten}}. The world was quiet, save for the distant hum of the city that never sleeps.",
    title: "The Great Gatsby",
    author: "F. Scott Fitzgerald",
    timePhrase: "half past ten"
  }],
  "22:31": [{
    quote: "At {{thirty-one minutes past ten}}, she finally understood what he had meant all along.",
    title: "Pride and Prejudice",
    author: "Jane Austen",
    timePhrase: "thirty-one minutes past ten"
  }],
  "22:32": [{
    quote: "It was now {{thirty-two past ten}} and the fog had settled over the moors like a blanket of grey silk.",
    title: "Wuthering Heights",
    author: "Emily Brontë",
    timePhrase: "thirty-two past ten"
  }],
  "22:33": [{
    quote: "{{Thirty-three past ten}}—the old professor noted the time in his leather-bound journal.",
    title: "The Name of the Rose",
    author: "Umberto Eco",
    timePhrase: "Thirty-three past ten"
  }],
  "22:34": [{
    quote: "By {{thirty-four minutes past ten}}, the last train had departed, leaving only silence on the platform.",
    title: "Anna Karenina",
    author: "Leo Tolstoy",
    timePhrase: "thirty-four minutes past ten"
  }],
  "22:35": [{
    quote: "The lighthouse beam swept across the bay. It was {{twenty-five to eleven}}, and the storm was approaching.",
    title: "To the Lighthouse",
    author: "Virginia Woolf",
    timePhrase: "twenty-five to eleven"
  }],
  "22:36": [{
    quote: "At precisely {{thirty-six minutes past ten}}, the letter was sealed and handed to the messenger.",
    title: "Les Misérables",
    author: "Victor Hugo",
    timePhrase: "thirty-six minutes past ten"
  }],
  "22:37": [{
    quote: "It was {{thirty-seven minutes past ten}} when the detective made his decisive discovery.",
    title: "The Hound of the Baskervilles",
    author: "Arthur Conan Doyle",
    timePhrase: "thirty-seven minutes past ten"
  }],
  "22:38": [{
    quote: "The grandfather clock chimed {{thirty-eight minutes past ten}}. In the library, pages turned softly.",
    title: "Rebecca",
    author: "Daphne du Maurier",
    timePhrase: "thirty-eight minutes past ten"
  }],
  "22:39": [{
    quote: "By {{thirty-nine minutes past ten}}, the candles had burned low and the conversation turned to darker matters.",
    title: "Dracula",
    author: "Bram Stoker",
    timePhrase: "thirty-nine minutes past ten"
  }],
  "22:40": [{
    quote: "At {{twenty to eleven}}, the moon rose above the ancient castle, casting long shadows across the courtyard.",
    title: "The Castle of Otranto",
    author: "Horace Walpole",
    timePhrase: "twenty to eleven"
  }]
};

// Use generated quotes if available, otherwise mock data
export const QUOTES: Record<string, Quote[]> = generatedQuotes ?? MOCK_QUOTES;

// Fallback quote when no match is found
export const FALLBACK_QUOTE: Quote = {
  quote: "Time flies over us, but leaves its shadow behind.",
  title: "The Marble Faun",
  author: "Nathaniel Hawthorne",
  timePhrase: ""
};

/**
 * Get a random quote for the given time
 * If multiple quotes exist for this minute, picks one randomly
 */
export function getRandomQuoteForTime(timeString: string): Quote {
  const quotesForTime = QUOTES[timeString];

  if (!quotesForTime || quotesForTime.length === 0) {
    return FALLBACK_QUOTE;
  }

  // Pick random quote from available options
  const randomIndex = Math.floor(Math.random() * quotesForTime.length);
  return quotesForTime[randomIndex];
}

/**
 * Get count of available quotes for a time
 */
export function getQuoteCountForTime(timeString: string): number {
  return QUOTES[timeString]?.length ?? 0;
}
