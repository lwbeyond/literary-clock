"use client";

import { motion } from "framer-motion";

interface ProgressBarProps {
    seconds: number;
}

export default function ProgressBar({ seconds }: ProgressBarProps) {
    // Calculate progress: 0% at 0 seconds, 100% at 59 seconds
    const progress = (seconds / 59) * 100;

    return (
        <div className="fixed bottom-0 left-0 right-0 h-[2px] bg-[var(--muted-light)] opacity-50 z-20">
            <motion.div
                className="h-full bg-gradient-to-r from-[var(--accent)] to-[var(--accent-light)]"
                initial={{ width: 0 }}
                animate={{ width: `${progress}%` }}
                transition={{
                    duration: 0.3,
                    ease: "linear",
                }}
            />
        </div>
    );
}
