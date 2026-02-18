"use client";
import { useContext } from "react";
import { ThemeContext } from "../components/theme/ThemeSwitcher";

export default function useDarkMode() {
    const context = useContext(ThemeContext);
    if (!context) {
        // Fallback if used outside of provider
        return { mode: "dark", toggleMode: () => { } };
    }
    return { mode: context.mode, toggleMode: context.toggleMode };
}
