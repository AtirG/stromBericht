"use client";
import React from "react";
import Box from "@mui/material/Box";
import Container from "@mui/material/Container";
import Typography from "@mui/material/Typography";
import Stack from "@mui/material/Stack";
import Paper from "@mui/material/Paper";
import LastgangManager from "@/components/lastgangAnalyse/lastgangManager";

export default function MainPage() {
    return (
        <Container maxWidth="lg" sx={{ py: 6 }}>
            <Stack spacing={4}>
                {/* Welcome Section */}
                <Box textAlign="center">
                    <Typography variant="h3" component="h1" gutterBottom fontWeight="bold" color="primary">
                        Stromverbrauch Analyse
                    </Typography>
                    <Typography variant="h6" color="text.secondary" sx={{ maxWidth: 800, mx: "auto" }}>
                        Analysieren Sie Ihren Lastgang einfach und schnell. Laden Sie Ihre Daten hoch und erhalten Sie sofortige Einblicke in Ihren Stromverbrauch.
                    </Typography>
                </Box>

                {/* Main Application Segment */}
                <Box>
                    <LastgangManager />
                </Box>
            </Stack>
        </Container>
    );
}
