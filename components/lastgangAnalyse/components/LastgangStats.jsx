import React from "react";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import Grid2 from "@mui/material/Grid";
import Stack from "@mui/material/Stack";
import Slider from "@mui/material/Slider";
import TextField from "@mui/material/TextField";
import InputAdornment from "@mui/material/InputAdornment";
import TrendingUpIcon from "@mui/icons-material/TrendingUp";
import TrendingDownIcon from "@mui/icons-material/TrendingDown";
import { round, formatNum, formatPeriodKey, convertEnergy } from "../utils/lastgangUtils";

export default function LastgangStats({
    stats,
    thresholdStats,
    thresholdKW,
    setThresholdKW,
    selectedKey,
    filterMode,
    periodLabel,
    dataPointCount,
    energyUnit,
    setEnergyUnit
}) {
    if (!stats || !thresholdStats) return null;

    return (
        <Box sx={{ mb: 3 }}>
            <Typography
                variant="h6"
                sx={{ mb: 2, display: "flex", alignItems: "center" }}
            >
                <TrendingUpIcon sx={{ mr: 1 }} />
                Zusammenfassung für{" "}
                {selectedKey === "all"
                    ? `Alle ${filterMode === "all" ? "Daten" : filterMode === "month" ? "Monate" : filterMode === "week" ? "Wochen" : "Tage"}`
                    : formatPeriodKey(filterMode, selectedKey)}
            </Typography>
            <Grid2 container spacing={2}>
                <Grid2 size={{ xs: 12, sm: 6, md: 3 }}>
                    <Card variant="outlined">
                        <CardContent sx={{ textAlign: "center", py: 2 }}>
                            <Typography
                                variant="h4"
                                color="primary.main"
                                sx={{ fontWeight: "bold" }}
                            >
                                {formatNum(stats.avgKW)}
                            </Typography>
                            <Typography variant="body2" color="text.secondary">
                                Durchschnittsleistung (kW)
                            </Typography>
                        </CardContent>
                    </Card>
                </Grid2>
                <Grid2 size={{ xs: 12, sm: 6, md: 3 }}>
                    <Card variant="outlined">
                        <CardContent sx={{ textAlign: "center", py: 2 }}>
                            <Typography
                                variant="h4"
                                color="error.main"
                                sx={{
                                    fontWeight: "bold",
                                    display: "flex",
                                    alignItems: "center",
                                    justifyContent: "center",
                                }}
                            >
                                <TrendingUpIcon sx={{ mr: 0.5, fontSize: "1.2em" }} />
                                {formatNum(stats.maxKW)}
                            </Typography>
                            <Typography variant="body2" color="text.secondary">
                                Spitzenleistung (kW)
                            </Typography>
                        </CardContent>
                    </Card>
                </Grid2>
                <Grid2 size={{ xs: 12, sm: 6, md: 3 }}>
                    <Card variant="outlined">
                        <CardContent sx={{ textAlign: "center", py: 2 }}>
                            <Typography
                                variant="h4"
                                color="success.main"
                                sx={{
                                    fontWeight: "bold",
                                    display: "flex",
                                    alignItems: "center",
                                    justifyContent: "center",
                                }}
                            >
                                <TrendingDownIcon
                                    sx={{ mr: 0.5, fontSize: "1.2em" }}
                                />
                                {formatNum(stats.minKW)}
                            </Typography>
                            <Typography variant="body2" color="text.secondary">
                                Mindestleistung (kW)
                            </Typography>
                        </CardContent>
                    </Card>
                </Grid2>
                <Grid2 size={{ xs: 12, sm: 6, md: 3 }}>
                    <Card variant="outlined">
                        <CardContent sx={{ textAlign: "center", py: 2 }}>
                            <Typography
                                variant="h4"
                                color="secondary.main"
                                sx={{ fontWeight: "bold" }}
                            >
                                {formatNum(convertEnergy(stats.energyKWh, energyUnit), energyUnit === "kWh" ? 1 : 3)}
                            </Typography>
                            <Typography variant="body2" color="text.secondary">
                                Gesamtenergie ({energyUnit})
                            </Typography>
                        </CardContent>
                    </Card>
                </Grid2>
            </Grid2>

            <Grid2 container spacing={2} sx={{ mt: 1 }}>
                <Grid2 size={{ xs: 12, md: 9 }}>
                    <Card variant="outlined" sx={{ height: "100%" }}>
                        <CardContent>
                            <Stack direction="row" justifyContent="space-between" alignItems="center" sx={{ mb: 1.5 }}>
                                <Typography variant="subtitle2" sx={{ fontWeight: "bold" }}>
                                    Peak Shaving Analyse & Schwellenwert
                                </Typography>
                                <Stack direction="row" spacing={2} alignItems="center">
                                    <Slider
                                        value={thresholdKW}
                                        min={0}
                                        max={stats.maxKW || 100}
                                        step={0.1}
                                        onChange={(_, v) => setThresholdKW(v)}
                                        sx={{ width: 200 }}
                                    />
                                    <TextField
                                        size="small"
                                        value={thresholdKW}
                                        onChange={(e) => setThresholdKW(Number(e.target.value))}
                                        type="number"
                                        slotProps={{
                                            input: {
                                                endAdornment: <InputAdornment position="end">kW</InputAdornment>,
                                            }
                                        }}
                                        sx={{ width: 150, bgcolor: 'background.paper' }}
                                    />
                                </Stack>
                            </Stack>

                            <Grid2 container spacing={2}>
                                <Grid2 size={{ xs: 6, sm: 3 }}>
                                    <Typography variant="caption" color="text.secondary" display="block">Über Limit</Typography>
                                    <Typography variant="body1" sx={{ fontWeight: "bold", color: "error.main" }}>
                                        {formatNum(convertEnergy(thresholdStats.energyAbove, energyUnit), energyUnit === "kWh" ? 1 : 3)} {energyUnit}
                                    </Typography>
                                    <Typography variant="caption" color="text.secondary">
                                        ({formatNum(thresholdStats.peakRatio)}%)
                                    </Typography>
                                </Grid2>
                                <Grid2 size={{ xs: 6, sm: 3 }}>
                                    <Typography variant="caption" color="text.secondary" display="block">Basis Energie</Typography>
                                    <Typography variant="body1" sx={{ fontWeight: "bold" }}>
                                        {formatNum(convertEnergy(thresholdStats.energyBelow, energyUnit), energyUnit === "kWh" ? 1 : 3)} {energyUnit}
                                    </Typography>
                                </Grid2>
                                <Grid2 size={{ xs: 6, sm: 3 }}>
                                    <Typography variant="caption" color="text.secondary" display="block">Zeit über Limit</Typography>
                                    <Typography variant="body1" sx={{ fontWeight: "bold" }}>
                                        {formatNum(thresholdStats.timeAbove)} h
                                    </Typography>
                                </Grid2>
                                <Grid2 size={{ xs: 6, sm: 3 }}>
                                    <Typography variant="caption" color="text.secondary" display="block">Einsparpotenzial</Typography>
                                    <Typography variant="body1" sx={{ fontWeight: "bold", color: "success.main" }}>
                                        {formatNum((1 - thresholdKW / stats.maxKW) * 100)}% Spitzenlast
                                    </Typography>
                                </Grid2>
                            </Grid2>
                        </CardContent>
                    </Card>
                </Grid2>

                <Grid2 size={{ xs: 12, md: 3 }}>
                    <Card
                        variant="outlined"
                        sx={{ bgcolor: "background.paper", height: "100%" }}
                    >
                        <CardContent>
                            <Typography
                                variant="subtitle2"
                                sx={{ mb: 1, fontWeight: "bold" }}
                            >
                                Zeitraum-Info
                            </Typography>
                            <Stack spacing={0.5}>
                                <Stack direction="row" justifyContent="space-between">
                                    <Typography variant="caption" color="text.secondary">Datenpunkte:</Typography>
                                    <Typography variant="caption" sx={{ fontWeight: "medium" }}>{dataPointCount.toLocaleString()}</Typography>
                                </Stack>
                                <Stack direction="row" justifyContent="space-between">
                                    <Typography variant="caption" color="text.secondary">Zeitraum:</Typography>
                                    <Typography variant="caption" sx={{ fontWeight: "medium" }}>
                                        {selectedKey === "all" ? "Alle Daten" : formatPeriodKey(filterMode, selectedKey)}
                                    </Typography>
                                </Stack>
                                <Stack direction="row" justifyContent="space-between">
                                    <Typography variant="caption" color="text.secondary">P-Faktor:</Typography>
                                    <Typography variant="caption" sx={{ fontWeight: "medium" }}>{formatNum(stats.maxKW / stats.avgKW, 2)}x</Typography>
                                </Stack>
                            </Stack>
                        </CardContent>
                    </Card>
                </Grid2>
            </Grid2>
        </Box>
    );
}
