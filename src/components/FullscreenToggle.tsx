"use client";

import { motion } from "framer-motion";
import { useTheme } from "./ThemeProvider";

export default function FullscreenToggle() {
    const { isFullscreen, toggleFullscreen } = useTheme();

    return (
        <button
            onClick={toggleFullscreen}
            className="fixed bottom-8 right-8 p-3 rounded-full z-30
                 bg-[var(--foreground)]/5 backdrop-blur-sm 
                 border border-[var(--foreground)]/10
                 hover:bg-[var(--foreground)]/10 hover:scale-105
                 transition-all duration-300
                 focus:outline-none focus:ring-2 focus:ring-[var(--accent)]/50"
            aria-label={isFullscreen ? "Exit fullscreen" : "Enter fullscreen"}
        >
            <motion.div
                initial={false}
                animate={{ scale: isFullscreen ? 0.9 : 1 }}
                transition={{ duration: 0.2 }}
                className="w-5 h-5"
            >
                {isFullscreen ? (
                    // Compress icon (exit fullscreen)
                    <svg
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        className="text-[var(--foreground)] opacity-60"
                    >
                        <path d="M8 3v3a2 2 0 0 1-2 2H3" />
                        <path d="M21 8h-3a2 2 0 0 1-2-2V3" />
                        <path d="M3 16h3a2 2 0 0 1 2 2v3" />
                        <path d="M16 21v-3a2 2 0 0 1 2-2h3" />
                    </svg>
                ) : (
                    // Expand icon (enter fullscreen)
                    <svg
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        className="text-[var(--foreground)] opacity-60"
                    >
                        <path d="M8 3H5a2 2 0 0 0-2 2v3" />
                        <path d="M21 8V5a2 2 0 0 0-2-2h-3" />
                        <path d="M3 16v3a2 2 0 0 0 2 2h3" />
                        <path d="M16 21h3a2 2 0 0 0 2-2v-3" />
                    </svg>
                )}
            </motion.div>
        </button>
    );
}
