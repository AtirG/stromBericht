"use client";
import React from "react";
import Box from "@mui/material/Box";
import Container from "@mui/material/Container";
import Typography from "@mui/material/Typography";
import Stack from "@mui/material/Stack";
import Paper from "@mui/material/Paper";
import Breadcrumbs from "@mui/material/Breadcrumbs";
import Link from "@mui/material/Link";
import NavigateNextIcon from "@mui/icons-material/NavigateNext";
import InfoOutlinedIcon from "@mui/icons-material/InfoOutlined";
import DescriptionOutlinedIcon from "@mui/icons-material/DescriptionOutlined";
import TableChartOutlinedIcon from "@mui/icons-material/TableChartOutlined";
import Image from "next/image";

export default function GuidePage() {
    return (
        <Container maxWidth="md" sx={{ py: { xs: 4, md: 8 } }}>
            <Stack spacing={6}>
                {/* Breadcrumbs */}
                <Breadcrumbs
                    separator={<NavigateNextIcon fontSize="small" />}
                    aria-label="breadcrumb"
                    sx={{ mb: -2 }}
                >
                    <Link underline="hover" color="inherit" href="/">
                        Home
                    </Link>
                    <Typography color="text.primary">Anleitung</Typography>
                </Breadcrumbs>

                {/* Header Section */}
                <Box>
                    <Typography
                        variant="h2"
                        component="h1"
                        gutterBottom
                        fontWeight="900"
                        color="primary"
                        sx={{
                            fontSize: { xs: "2.5rem", md: "3.75rem" },
                            background: "linear-gradient(45deg, #primary.main, #primary.light)",
                            WebkitBackgroundClip: "text",
                            mb: 2
                        }}
                    >
                        Daten-Leitfaden
                    </Typography>
                    <Typography variant="h6" color="text.secondary" sx={{ maxWidth: 700, lineHeight: 1.6 }}>
                        Erfahren Sie, wie Sie Ihre Lastgangdaten optimal für die Analyse vorbereiten.
                        Ein perfekt formatierter Datensatz ist der Schlüssel zu präzisen Ergebnissen.
                    </Typography>
                </Box>

                {/* Requirements Card */}
                <Paper
                    elevation={0}
                    sx={{
                        p: { xs: 3, md: 5 },
                        bgcolor: "background.darker",
                        borderRadius: 6,
                        border: "1px solid",
                        borderColor: "divider",
                        position: "relative",
                        overflow: "hidden",
                        "&::before": {
                            content: '""',
                            position: "absolute",
                            top: 0,
                            left: 0,
                            width: "4px",
                            height: "100%",
                            bgcolor: "primary.main"
                        }
                    }}
                >
                    <Stack spacing={4}>
                        <Stack direction="row" spacing={2} alignItems="center">
                            <DescriptionOutlinedIcon color="primary" sx={{ fontSize: 32 }} />
                            <Typography variant="h5" fontWeight="bold">
                                Dateianforderungen
                            </Typography>
                        </Stack>

                        <Typography variant="body1" color="text.secondary">
                            Ihre Stromverbrauchsdaten müssen als <strong>CSV</strong> oder <strong>Excel (.xlsx)</strong> Datei vorliegen.
                            Stellen Sie sicher, dass die Datei folgende Struktur aufweist:
                        </Typography>

                        <Box component="ul" sx={{
                            display: "grid",
                            gridTemplateColumns: { xs: "1fr", sm: "1fr 1fr" },
                            gap: 3,
                            p: 0,
                            listStyle: "none"
                        }}>
                            <Box component="li">
                                <Paper sx={{ p: 2, bgcolor: "background.paper", borderRadius: 3, height: "100%" }}>
                                    <Typography variant="subtitle2" color="primary" fontWeight="bold" gutterBottom>
                                        Spalte 1: Zeitstempel
                                    </Typography>
                                    <Typography variant="body2" color="text.secondary">
                                        Datum und Uhrzeit im Format <code>TT.MM.JJJJ HH:MM</code>.
                                        Beispiel: 01.01.2024 00:00
                                    </Typography>
                                </Paper>
                            </Box>
                            <Box component="li">
                                <Paper sx={{ p: 2, bgcolor: "background.paper", borderRadius: 3, height: "100%" }}>
                                    <Typography variant="subtitle2" color="primary" fontWeight="bold" gutterBottom>
                                        Spalte 2: Verbrauch
                                    </Typography>
                                    <Typography variant="body2" color="text.secondary">
                                        Der Stromverbrauch in <strong>kWh</strong> als numerischer Wert.
                                        Repräsentiert ein 15-Minuten-Intervall.
                                    </Typography>
                                </Paper>
                            </Box>
                        </Box>
                    </Stack>
                </Paper>

                {/* Visual Structure Section */}
                <Stack spacing={3}>
                    <Stack direction="row" spacing={2} alignItems="center">
                        <TableChartOutlinedIcon color="primary" sx={{ fontSize: 32 }} />
                        <Typography variant="h5" fontWeight="bold">
                            Visuelle Struktur
                        </Typography>
                    </Stack>

                    <Typography variant="body1" color="text.secondary">
                        So sollte Ihre Datei in Excel oder einem Text-Editor aussehen. Beachten Sie die saubere Trennung der Spalten:
                    </Typography>

                    <Paper
                        elevation={0}
                        sx={{
                            p: 1,
                            bgcolor: "rgba(255, 255, 255, 0.03)",
                            borderRadius: 4,
                            border: "1px solid",
                            borderColor: "divider",
                            overflow: "hidden"
                        }}
                    >
                        <Box sx={{ position: "relative", width: "100%", height: "auto", minHeight: 400 }}>
                            <img
                                src="/fileStructure.png"
                                alt="Dateistruktur Beispiel"
                                style={{
                                    width: "100%",
                                    height: "auto",
                                    display: "block",
                                    borderRadius: "12px"
                                }}
                            />
                        </Box>
                    </Paper>

                    <Box
                        sx={{
                            p: 3,
                            borderRadius: 4,
                            bgcolor: "primary.main",
                            color: "primary.contrastText",
                            display: "flex",
                            alignItems: "center",
                            gap: 2
                        }}
                    >
                        <InfoOutlinedIcon />
                        <Typography variant="body2" fontWeight="medium">
                            Tipp: Exportieren Sie Ihre Daten direkt aus Ihrem Smart Meter Portal oder fragen Sie Ihren Netzbetreiber nach einem CSV-Export Ihres Lastgangs.
                        </Typography>
                    </Box>
                </Stack>
            </Stack>
        </Container>
    );
}
