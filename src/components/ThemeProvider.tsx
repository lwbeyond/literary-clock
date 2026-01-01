"use client";

import { createContext, useContext, useEffect, useState, ReactNode } from "react";

// Time-based atmospheric phases
export type TimePhase = "dawn" | "day" | "dusk" | "night";

interface ThemeContextType {
    phase: TimePhase;
    isFullscreen: boolean;
    toggleFullscreen: () => void;
}

const ThemeContext = createContext<ThemeContextType | null>(null);

/**
 * Classify current hour into atmospheric phase
 * Dawn:  05:00 - 08:00 (Awakening)
 * Day:   08:00 - 17:00 (Focus)
 * Dusk:  17:00 - 20:00 (Nostalgia)
 * Night: 20:00 - 05:00 (Solitude)
 */
function getTimePhase(hours: number): TimePhase {
    if (hours >= 5 && hours < 8) return "dawn";
    if (hours >= 8 && hours < 17) return "day";
    if (hours >= 17 && hours < 20) return "dusk";
    return "night";
}

export function ThemeProvider({ children }: { children: ReactNode }) {
    const [phase, setPhase] = useState<TimePhase>("day");
    const [isFullscreen, setIsFullscreen] = useState(false);
    const [mounted, setMounted] = useState(false);

    // Initialize phase based on current time
    useEffect(() => {
        setMounted(true);

        const updatePhase = () => {
            const hours = new Date().getHours();
            setPhase(getTimePhase(hours));
        };

        updatePhase();

        // Check every minute for phase changes
        const interval = setInterval(updatePhase, 60000);
        return () => clearInterval(interval);
    }, []);

    // Apply phase to document
    useEffect(() => {
        if (!mounted) return;
        document.documentElement.setAttribute("data-phase", phase);
    }, [phase, mounted]);

    // Track fullscreen state
    useEffect(() => {
        const handleFullscreenChange = () => {
            setIsFullscreen(!!document.fullscreenElement);
        };

        document.addEventListener("fullscreenchange", handleFullscreenChange);
        return () => document.removeEventListener("fullscreenchange", handleFullscreenChange);
    }, []);

    const toggleFullscreen = async () => {
        try {
            if (!document.fullscreenElement) {
                await document.documentElement.requestFullscreen();
            } else {
                await document.exitFullscreen();
            }
        } catch (err) {
            console.error("Fullscreen error:", err);
        }
    };

    if (!mounted) return null;

    return (
        <ThemeContext.Provider value={{ phase, isFullscreen, toggleFullscreen }}>
            {children}
        </ThemeContext.Provider>
    );
}

export function useTheme() {
    const context = useContext(ThemeContext);
    if (!context) {
        throw new Error("useTheme must be used within ThemeProvider");
    }
    return context;
}
