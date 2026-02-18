"use client";
import React, { createContext, useContext, useState, useEffect } from "react";
import { ThemeProvider, CssBaseline } from "@mui/material";
import getTheme from "./theme";

// Create context inside the same file for simplicity
export const ThemeContext = createContext();

export default function ThemeSwitcher({ children }) {
    const [mode, setMode] = useState("dark");
    const [mounted, setMounted] = useState(false);

    useEffect(() => {
        setMounted(true);
        const savedMode = localStorage.getItem("themeMode");
        if (savedMode) {
            setMode(savedMode);
        } else if (window.matchMedia("(prefers-color-scheme: dark)").matches) {
            setMode("dark");
        } else {
            setMode("light");
        }
    }, []);

    const toggleMode = () => {
        setMode((prevMode) => {
            const newMode = prevMode === "light" ? "dark" : "light";
            localStorage.setItem("themeMode", newMode);
            return newMode;
        });
    };

    const theme = getTheme(mode);

    // Avoid hydration mismatch by not rendering theme-dependent UI until mounted
    if (!mounted) {
        return <div style={{ visibility: "hidden" }}>{children}</div>;
    }

    return (
        <ThemeContext.Provider value={{ mode, toggleMode }}>
            <ThemeProvider theme={theme}>
                <CssBaseline />
                {children}
            </ThemeProvider>
        </ThemeContext.Provider>
    );
}
