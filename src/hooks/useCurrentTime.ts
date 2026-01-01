"use client";

import { useState, useEffect, useCallback } from "react";

export interface TimeState {
    hours: number;
    minutes: number;
    seconds: number;
    timeString: string; // "HH:MM" format for quote lookup
}

export function useCurrentTime() {
    // Initialize as null to prevent hydration mismatch
    // Server renders null, client populates in useEffect
    const [time, setTime] = useState<TimeState | null>(null);

    const getTimeState = useCallback((): TimeState => {
        const now = new Date();
        const hours = now.getHours();
        const minutes = now.getMinutes();
        const seconds = now.getSeconds();

        return {
            hours,
            minutes,
            seconds,
            timeString: `${hours.toString().padStart(2, "0")}:${minutes.toString().padStart(2, "0")}`,
        };
    }, []);

    useEffect(() => {
        // Set initial time on client mount
        setTime(getTimeState());

        const interval = setInterval(() => {
            const newTime = getTimeState();

            setTime((prevTime) => {
                // Only update state if minute has changed (or initial render)
                if (!prevTime || prevTime.minutes !== newTime.minutes) {
                    return newTime;
                }
                // Update seconds without causing quote change
                return { ...prevTime, seconds: newTime.seconds };
            });
        }, 1000);

        return () => clearInterval(interval);
    }, [getTimeState]);

    return time;
}
