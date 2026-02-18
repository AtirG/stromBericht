"use client";
import React, { createContext, useContext, useState, useEffect } from "react";

const ThemeContext = createContext();

export function ThemeProviderWrapper({ children }) {
    const [mode, setMode] = useState("dark");

    useEffect(() => {
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

    return (
        <ThemeContext.Provider value={{ mode, toggleMode }}>
            {children}
        </ThemeContext.Provider>
    );
}

export const useThemeContext = () => useContext(ThemeContext);
