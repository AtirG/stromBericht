import React from "react";
import Box from "@mui/material/Box";
import FormControl from "@mui/material/FormControl";
import InputLabel from "@mui/material/InputLabel";
import Select from "@mui/material/Select";
import MenuItem from "@mui/material/MenuItem";
import Typography from "@mui/material/Typography";
import Stack from "@mui/material/Stack";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";

const MONTHS_DE = [
    "Januar", "Februar", "März", "April", "Mai", "Juni",
    "Juli", "August", "September", "Oktober", "November", "Dezember"
];

export default function MarketControls({
    years,
    selectedYear,
    onYearChange,
    months,
    selectedMonth,
    onMonthChange,
    availablePackages,
    selectedTimestamp,
    onTimestampChange,
    basePrice,
    peakPrice
}) {
    return (
        <Stack direction="row" spacing={2} sx={{ mb: 3, alignItems: "center", justifyContent: "space-between", flexWrap: "wrap", gap: 2 }}>
            <Box sx={{ display: "flex", alignItems: "center", gap: 1.5, flexWrap: "wrap" }}>
                {/* Year Select */}
                <FormControl size="small" sx={{ minWidth: 100 }}>
                    <InputLabel id="year-select-label">Jahr</InputLabel>
                    <Select
                        labelId="year-select-label"
                        id="year-select"
                        value={selectedYear ?? ""}
                        label="Jahr"
                        onChange={(e) => onYearChange(e.target.value)}
                    >
                        {years.map((y) => (
                            <MenuItem key={y} value={y}>{y}</MenuItem>
                        ))}
                    </Select>
                </FormControl>

                {/* Month Select */}
                <FormControl size="small" sx={{ minWidth: 140 }}>
                    <InputLabel id="month-select-label">Monat</InputLabel>
                    <Select
                        labelId="month-select-label"
                        id="month-select"
                        value={selectedMonth ?? ""}
                        label="Monat"
                        onChange={(e) => onMonthChange(e.target.value)}
                    >
                        {months.map((m) => (
                            <MenuItem key={m} value={m}>{MONTHS_DE[parseInt(m)]}</MenuItem>
                        ))}
                    </Select>
                </FormControl>

                {/* Package/Week Select */}
                <FormControl size="small" sx={{ minWidth: 220 }}>
                    <InputLabel id="timestamp-select-label">Wochenpaket</InputLabel>
                    <Select
                        labelId="timestamp-select-label"
                        id="timestamp-select"
                        value={selectedTimestamp ?? ""}
                        label="Wochenpaket"
                        onChange={(e) => onTimestampChange(e.target.value)}
                    >
                        {availablePackages.map((ts) => (
                            <MenuItem key={ts} value={ts}>
                                {new Date(ts).toLocaleDateString("de-DE")} - {new Date(ts + 7 * 24 * 60 * 60 * 1000).toLocaleDateString("de-DE")}
                            </MenuItem>
                        ))}
                    </Select>
                </FormControl>
            </Box>

            <Stack direction="row" spacing={2}>
                <Card variant="outlined" sx={{ minWidth: 120 }}>
                    <CardContent sx={{ p: '8px 16px !important' }}>
                        <Typography variant="caption" color="text.secondary">Base Ø (24h)</Typography>
                        <Typography variant="h6" color="success.main">{basePrice?.toFixed(2)} <small style={{ fontSize: '0.6em' }}>ct/kWh</small></Typography>
                    </CardContent>
                </Card>
                <Card variant="outlined" sx={{ minWidth: 120 }}>
                    <CardContent sx={{ p: '8px 16px !important' }}>
                        <Typography variant="caption" color="text.secondary">Peak Ø (08-20h)</Typography>
                        <Typography variant="h6" color="warning.main">{peakPrice?.toFixed(2)} <small style={{ fontSize: '0.6em' }}>ct/kWh</small></Typography>
                    </CardContent>
                </Card>
            </Stack>
        </Stack>
    );
}
