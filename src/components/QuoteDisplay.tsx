"use client";

import { useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import type { Quote } from "@/data/quotes";

interface QuoteDisplayProps {
    quote: Quote;
    timeString: string;
}

/**
 * Clean HTML tags from quote text
 * Replaces <br>, <br/>, <br /> with newlines
 */
function cleanQuoteText(text: string): string {
    return text
        .replace(/<br\s*\/?>/gi, '\n')  // Replace all <br> variants with newline
        .replace(/&nbsp;/gi, ' ')        // Replace &nbsp; with space
        .replace(/&amp;/gi, '&')         // Replace &amp; with &
        .replace(/&quot;/gi, '"')        // Replace &quot; with "
        .replace(/&#39;/gi, "'")         // Replace &#39; with '
        .trim();
}

/**
 * Get adaptive typography classes based on quote length
 */
function getTypographyClasses(charCount: number): {
    quote: string;
    quoteMark: string;
    lineHeight: string;
} {
    if (charCount < 60) {
        // HERO - Short, punchy quotes
        return {
            quote: "text-3xl sm:text-4xl md:text-5xl lg:text-6xl xl:text-7xl",
            quoteMark: "text-4xl md:text-5xl lg:text-6xl xl:text-7xl",
            lineHeight: "leading-tight",
        };
    } else if (charCount < 150) {
        // HEADLINE - Medium quotes
        return {
            quote: "text-xl sm:text-2xl md:text-3xl lg:text-4xl xl:text-5xl",
            quoteMark: "text-3xl md:text-4xl lg:text-5xl",
            lineHeight: "leading-snug",
        };
    } else if (charCount < 300) {
        // READING - Longer quotes
        return {
            quote: "text-lg sm:text-xl md:text-2xl lg:text-3xl",
            quoteMark: "text-2xl md:text-3xl lg:text-4xl",
            lineHeight: "leading-relaxed",
        };
    } else {
        // COMPACT - Very long quotes
        return {
            quote: "text-base sm:text-lg md:text-xl lg:text-2xl",
            quoteMark: "text-xl md:text-2xl lg:text-3xl",
            lineHeight: "leading-relaxed",
        };
    }
}

/**
 * Parse quote and highlight the time phrase
 * Works on cleaned text (with newlines instead of <br>)
 */
function parseQuoteWithHighlight(quote: string, timePhrase: string) {
    // First clean the quote
    const cleanedQuote = cleanQuoteText(quote);

    // Look for {{timePhrase}} markers
    const markerPattern = /\{\{([^}]+)\}\}/g;
    const parts: { text: string; isHighlight: boolean }[] = [];

    let lastIndex = 0;
    let match;

    while ((match = markerPattern.exec(cleanedQuote)) !== null) {
        if (match.index > lastIndex) {
            parts.push({ text: cleanedQuote.slice(lastIndex, match.index), isHighlight: false });
        }
        parts.push({ text: match[1], isHighlight: true });
        lastIndex = match.index + match[0].length;
    }

    if (lastIndex < cleanedQuote.length) {
        parts.push({ text: cleanedQuote.slice(lastIndex), isHighlight: false });
    }

    // Fallback: case-insensitive search for timePhrase (also clean the timePhrase)
    if (parts.length === 0 && timePhrase) {
        const cleanedPhrase = cleanQuoteText(timePhrase);
        const lowerQuote = cleanedQuote.toLowerCase();
        const lowerPhrase = cleanedPhrase.toLowerCase();
        const index = lowerQuote.indexOf(lowerPhrase);

        if (index !== -1) {
            if (index > 0) {
                parts.push({ text: cleanedQuote.slice(0, index), isHighlight: false });
            }
            parts.push({ text: cleanedQuote.slice(index, index + cleanedPhrase.length), isHighlight: true });
            if (index + cleanedPhrase.length < cleanedQuote.length) {
                parts.push({ text: cleanedQuote.slice(index + cleanedPhrase.length), isHighlight: false });
            }
        } else {
            parts.push({ text: cleanedQuote, isHighlight: false });
        }
    }

    return parts.length > 0 ? parts : [{ text: cleanedQuote, isHighlight: false }];
}

/**
 * Get plain text length for typography calculation
 */
function getPlainTextLength(quote: string): number {
    const cleaned = cleanQuoteText(quote);
    return cleaned.replace(/\{\{|\}\}/g, '').length;
}

export default function QuoteDisplay({ quote, timeString }: QuoteDisplayProps) {
    const parts = parseQuoteWithHighlight(quote.quote, quote.timePhrase);

    // Calculate typography based on cleaned quote length
    const typography = useMemo(() => {
        const charCount = getPlainTextLength(quote.quote);
        return getTypographyClasses(charCount);
    }, [quote.quote]);

    return (
        <AnimatePresence mode="wait">
            <motion.article
                key={timeString}
                initial={{ opacity: 0, y: 40, filter: "blur(12px)" }}
                animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
                exit={{ opacity: 0, y: -40, filter: "blur(12px)" }}
                transition={{
                    duration: 1.2,
                    ease: [0.22, 1, 0.36, 1],
                }}
                className="text-center max-w-4xl mx-auto px-6 md:px-8 max-h-[65vh] overflow-y-auto scrollbar-hide"
            >
                {/* Quote with adaptive typography + whitespace-pre-line for line breaks */}
                <blockquote
                    className={`font-serif ${typography.quote} ${typography.lineHeight} text-[var(--foreground)] mb-8 md:mb-10 whitespace-pre-line`}
                >
                    <span className={`text-[var(--accent)] ${typography.quoteMark} leading-none align-top`}>
                        &ldquo;
                    </span>
                    {parts.map((part, index) =>
                        part.isHighlight ? (
                            <span key={index} className="time-highlight">
                                {part.text}
                            </span>
                        ) : (
                            <span key={index}>{part.text}</span>
                        )
                    )}
                    <span className={`text-[var(--accent)] ${typography.quoteMark} leading-none align-bottom`}>
                        &rdquo;
                    </span>
                </blockquote>

                {/* Attribution */}
                <footer className="font-sans text-sm md:text-base lg:text-lg tracking-wide">
                    <cite className="not-italic">
                        <span className="text-muted font-medium">{quote.title}</span>
                        <span className="text-muted-light mx-2 md:mx-3">—</span>
                        <span className="text-muted">{quote.author}</span>
                    </cite>
                </footer>
            </motion.article>
        </AnimatePresence>
    );
}
