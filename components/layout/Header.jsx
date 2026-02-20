"use client";
import React from "react";
import Box from "@mui/material/Box";
import AppBar from "@mui/material/AppBar";
import Toolbar from "@mui/material/Toolbar";
import Typography from "@mui/material/Typography";
import Stack from "@mui/material/Stack";
import SvgIcon from "@mui/material/SvgIcon";
import ThemeMode from "../theme/ThemeMode";
import useDarkMode from "../../hooks/useDarkMode";
import Link from "next/link";
import Button from "@mui/material/Button";

export default function Header() {
    const { mode, toggleMode } = useDarkMode();

    return (
        <AppBar position="static" color="background.default" elevation={0} sx={{ borderBottom: "1px solid", borderColor: "divider" }}>
            <Toolbar sx={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                {/* Left side: Logo */}
                <Box sx={{ display: "flex", alignItems: "center", flex: 1 }}>
                    <Link href="/" style={{ display: "flex", alignItems: "center", textDecoration: "none", color: "inherit" }}>
                        <SvgIcon
                            viewBox="0 0 640 640"
                            sx={{
                                fontSize: 28,
                                color: mode === "dark" ? "#ccff00" : "#d4af37",
                                filter: mode === "dark" ? "drop-shadow(0 0 8px rgba(204, 255, 0, 0.8))" : "none",
                                transition: "all 0.3s ease",
                                mr: 1
                            }}
                        >
                            <path d="M128 320L156.5 92C158.5 76 172.1 64 188.3 64L356.9 64C371.9 64 384 76.1 384 91.1C384 94.3 383.4 97.6 382.3 100.6L336 224L475.3 224C495.5 224 512 240.4 512 260.7C512 268.1 509.8 275.3 505.6 281.4L313.4 562.4C307.5 571 297.8 576.1 287.5 576.1L284.6 576.1C268.9 576.1 256.1 563.3 256.1 547.6C256.1 545.3 256.4 543 257 540.7L304 352L160 352C142.3 352 128 337.7 128 320z" />
                        </SvgIcon>
                        <Typography variant="h6" sx={{ fontWeight: "bold", display: { xs: "none", sm: "block" } }}>
                            Strombericht
                        </Typography>
                    </Link>
                </Box>

                {/* Center: Navigation */}
                <Box sx={{ display: "flex", justifyContent: "center", flex: 1 }}>
                    <Stack direction="row" spacing={1}>
                        <Button
                            component={Link}
                            href="/guide"
                            variant="text"
                            color="inherit"
                            sx={{
                                fontWeight: "medium",
                                px: 2,
                                borderRadius: 2,
                                "&:hover": {
                                    bgcolor: "action.hover",
                                    color: "primary.main"
                                }
                            }}
                        >
                            Anleitung
                        </Button>
                    </Stack>
                </Box>

                {/* Right side: Theme switch */}
                <Box sx={{ display: "flex", justifyContent: "flex-end", flex: 1 }}>
                    <ThemeMode mode={mode} onChange={toggleMode} />
                </Box>
            </Toolbar>
        </AppBar>
    );
}
