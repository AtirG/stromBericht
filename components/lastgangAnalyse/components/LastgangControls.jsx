import React from "react";
import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";
import ToggleButton from "@mui/material/ToggleButton";
import ToggleButtonGroup from "@mui/material/ToggleButtonGroup";
import FormControl from "@mui/material/FormControl";
import InputLabel from "@mui/material/InputLabel";
import Select from "@mui/material/Select";
import MenuItem from "@mui/material/MenuItem";
import Grid2 from "@mui/material/Grid";
import CalendarMonthIcon from "@mui/icons-material/CalendarMonth";
import Slider from "@mui/material/Slider";
import TextField from "@mui/material/TextField";
import { formatPeriodKey } from "../utils/lastgangUtils";

export default function LastgangControls({
    filterMode,
    setFilterMode,
    selectedKey,
    setSelectedKey,
    chartType,
    setChartType,
    showEnergy,
    setShowEnergy,
    periodOptions,
    periodLabel,
    energyUnit,
    setEnergyUnit
}) {
    return (
        <Grid2 container spacing={2} sx={{ mb: 2 }}>
            <Grid2 size={{ xs: 12, md: 6 }}>
                <Stack spacing={1}>
                    <Typography variant="subtitle2" sx={{ opacity: 0.8 }}>
                        Filtern nach
                    </Typography>
                    <ToggleButtonGroup
                        color="primary"
                        value={filterMode}
                        exclusive
                        onChange={(_, v) => v && (setFilterMode(v), setSelectedKey("all"))}
                        size="small"
                    >
                        <ToggleButton value="month">
                            <CalendarMonthIcon sx={{ mr: 0.5 }} />
                            Monat
                        </ToggleButton>
                        <ToggleButton value="week">Woche</ToggleButton>
                        <ToggleButton value="day">Tag</ToggleButton>
                        <ToggleButton value="all">Alle</ToggleButton>
                    </ToggleButtonGroup>

                    <FormControl size="small" disabled={filterMode === "all"}>
                        <InputLabel>{periodLabel}</InputLabel>
                        <Select
                            value={selectedKey}
                            label={periodLabel}
                            onChange={(e) => setSelectedKey(e.target.value)}
                        >
                            <MenuItem value="all">Alle</MenuItem>
                            {periodOptions.map((k) => (
                                <MenuItem key={k} value={k}>
                                    {formatPeriodKey(filterMode, k)}
                                </MenuItem>
                            ))}
                        </Select>
                    </FormControl>
                </Stack>
            </Grid2>

            <Grid2 size={{ xs: 12, md: 6 }}>
                <Stack spacing={1}>
                    <Typography variant="subtitle2" sx={{ opacity: 0.8 }}>
                        Diagramm
                    </Typography>
                    <Stack direction="row" spacing={2}>
                        <ToggleButtonGroup
                            color="primary"
                            value={chartType}
                            exclusive
                            onChange={(_, v) => v && setChartType(v)}
                            size="small"
                        >
                            <ToggleButton value="line">Linie</ToggleButton>
                            <ToggleButton value="area">Fläche</ToggleButton>
                        </ToggleButtonGroup>

                        <ToggleButtonGroup
                            color="primary"
                            value={showEnergy ? "on" : "off"}
                            exclusive
                            onChange={(_, v) => setShowEnergy(v === "on")}
                            size="small"
                        >
                            <ToggleButton value="on">Energie-Overlay</ToggleButton>
                            <ToggleButton value="off">Energie aus</ToggleButton>
                        </ToggleButtonGroup>

                        <ToggleButtonGroup
                            color="secondary"
                            value={energyUnit}
                            exclusive
                            onChange={(_, v) => v && setEnergyUnit(v)}
                            size="small"
                        >
                            <ToggleButton value="kWh">kWh</ToggleButton>
                            <ToggleButton value="MWh">MWh</ToggleButton>
                            <ToggleButton value="GWh">GWh</ToggleButton>
                        </ToggleButtonGroup>
                    </Stack>
                </Stack>
            </Grid2>
        </Grid2>
    );
}
