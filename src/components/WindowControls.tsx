"use client";

import { useEffect, useState } from "react";

export function WindowControls() {
    const [isHovered, setIsHovered] = useState(false);

    const handleClose = async () => {
        try {
            const { getCurrentWindow } = await import("@tauri-apps/api/window");
            const appWindow = getCurrentWindow();
            await appWindow.close();
        } catch (e) {
            console.error("Close failed:", e);
        }
    };

    const handleMinimize = async () => {
        try {
            const { getCurrentWindow } = await import("@tauri-apps/api/window");
            const appWindow = getCurrentWindow();
            await appWindow.minimize();
        } catch (e) {
            console.error("Minimize failed:", e);
        }
    };

    return (
        <>
            {/* Drag Region - Top bar for dragging the window */}
            <div
                data-tauri-drag-region
                className="fixed top-0 left-0 right-0 h-8 z-[9998]"
                style={{ WebkitAppRegion: "drag" } as React.CSSProperties}
            />

            {/* Window Control Buttons - Elegant hover reveal */}
            <div
                className="fixed top-0 right-0 z-[9999] flex items-center gap-1 px-3 py-2"
                onMouseEnter={() => setIsHovered(true)}
                onMouseLeave={() => setIsHovered(false)}
                style={{ pointerEvents: "auto" }}
            >
                {/* Minimize Button */}
                <button
                    onClick={handleMinimize}
                    className={`
            w-6 h-6 flex items-center justify-center rounded-full
            transition-all duration-300 ease-out
            ${isHovered
                            ? "opacity-100 bg-foreground/10 hover:bg-foreground/20"
                            : "opacity-0"
                        }
          `}
                    style={{ pointerEvents: "auto" } as React.CSSProperties}
                    aria-label="Minimize"
                >
                    <svg
                        xmlns="http://www.w3.org/2000/svg"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        className="w-3.5 h-3.5 opacity-60"
                    >
                        <line x1="5" y1="12" x2="19" y2="12" />
                    </svg>
                </button>

                {/* Close Button */}
                <button
                    onClick={handleClose}
                    className={`
            w-6 h-6 flex items-center justify-center rounded-full
            transition-all duration-300 ease-out
            ${isHovered
                            ? "opacity-100 bg-foreground/10 hover:bg-red-500/30"
                            : "opacity-0"
                        }
          `}
                    style={{ pointerEvents: "auto" } as React.CSSProperties}
                    aria-label="Close"
                >
                    <svg
                        xmlns="http://www.w3.org/2000/svg"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        className={`w-3.5 h-3.5 transition-colors ${isHovered ? "hover:text-red-500" : ""} opacity-60`}
                    >
                        <line x1="18" y1="6" x2="6" y2="18" />
                        <line x1="6" y1="6" x2="18" y2="18" />
                    </svg>
                </button>
            </div>
        </>
    );
}
