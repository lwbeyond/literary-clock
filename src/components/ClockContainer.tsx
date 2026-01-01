"use client";

import { useState, useEffect, useMemo } from "react";
import { useCurrentTime } from "@/hooks/useCurrentTime";
import { getRandomQuoteForTime, getQuoteCountForTime } from "@/data/quotes";
import { useTheme } from "./ThemeProvider";
import QuoteDisplay from "./QuoteDisplay";
import ProgressBar from "./ProgressBar";
import FullscreenToggle from "./FullscreenToggle";

export default function ClockContainer() {
    const time = useCurrentTime();
    const { phase } = useTheme();
    const [quoteKey, setQuoteKey] = useState(0);

    // Get a new random quote when minute changes
    const quote = useMemo(() => {
        if (!time) return null;
        return getRandomQuoteForTime(time.timeString);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [time?.timeString, quoteKey]);

    // Refresh quote on minute change
    useEffect(() => {
        if (time) {
            setQuoteKey(prev => prev + 1);
        }
    }, [time?.timeString]);

    // Loading state while waiting for client hydration
    if (!time || !quote) {
        return (
            <main className="min-h-[100dvh] flex items-center justify-center relative">
                <div className="paper-texture" />
                <div className="text-[var(--accent)] font-serif text-4xl animate-pulse z-10">
                    ···
                </div>
            </main>
        );
    }

    const quoteCount = getQuoteCountForTime(time.timeString);
    const [hours, minutes] = time.timeString.split(':');

    // Phase labels for subtle indicator
    const phaseLabels = {
        dawn: "🌅 Dawn",
        day: "☀️ Day",
        dusk: "🌆 Dusk",
        night: "🌙 Night"
    };

    return (
        <main className="min-h-[100dvh] flex flex-col items-center justify-center relative overflow-hidden">
            {/* Paper texture overlay */}
            <div className="paper-texture" />

            {/* Phase indicator - top left */}
            <div className="fixed top-6 left-6 z-20 font-sans text-xs text-muted opacity-50 tracking-wider">
                {phaseLabels[phase]}
            </div>

            {/* Fullscreen toggle - bottom right */}
            <FullscreenToggle />

            {/* PROMINENT DIGITAL CLOCK - bottom center */}
            <div className="fixed bottom-8 left-1/2 -translate-x-1/2 z-20">
                <div className="flex items-baseline gap-1 font-mono">
                    <span className="text-5xl md:text-6xl lg:text-7xl font-light tracking-tight text-[var(--foreground)] opacity-20">
                        {hours}
                    </span>
                    <span className="text-4xl md:text-5xl lg:text-6xl font-light text-[var(--accent)] opacity-40 animate-pulse">
                        :
                    </span>
                    <span className="text-5xl md:text-6xl lg:text-7xl font-light tracking-tight text-[var(--foreground)] opacity-20">
                        {minutes}
                    </span>
                </div>
                {/* Quote count indicator */}
                {quoteCount > 1 && (
                    <div className="text-center mt-2 text-xs font-sans text-muted-light opacity-50">
                        {quoteCount} quotes available
                    </div>
                )}
            </div>

            {/* Quote content - centered */}
            <div className="z-10 py-16 md:py-20">
                <QuoteDisplay quote={quote} timeString={time.timeString} />
            </div>

            {/* Progress bar */}
            <ProgressBar seconds={time.seconds} />
        </main>
    );
}
