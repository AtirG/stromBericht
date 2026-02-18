"use client";
import React from "react";
import { Switch, Box } from "@mui/material";
import { LightMode, DarkMode } from "@mui/icons-material";

export default function ThemeMode({ mode, onChange }) {
    const isDarkMode = mode === "dark";

    const handleChange = () => {
        if (onChange) {
            onChange();
        }
    };

    return (
        <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
            {isDarkMode ? (
                <DarkMode fontSize="small" sx={{ color: "error.main" }} />
            ) : (
                <LightMode fontSize="small" sx={{ color: "warning.main" }} />
            )}
            <Switch checked={isDarkMode} onChange={handleChange} color="default" />
        </Box>
    );
}
