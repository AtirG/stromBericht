"use client";
import React, { useMemo, useState } from "react";
import Box from "@mui/material/Box";
import Paper from "@mui/material/Paper";
import Stack from "@mui/material/Stack";
import Button from "@mui/material/Button";
import Typography from "@mui/material/Typography";
import Chip from "@mui/material/Chip";
import Divider from "@mui/material/Divider";
import RestartAltIcon from "@mui/icons-material/RestartAlt";
import BoltIcon from "@mui/icons-material/ElectricBolt";
import FullscreenIcon from "@mui/icons-material/Fullscreen";
import FullscreenExitIcon from "@mui/icons-material/FullscreenExit";
import IconButton from "@mui/material/IconButton";

import { pad2, round, calculateThresholdStats, getPeriodDomain } from "./utils/lastgangUtils";
import LastgangUploader from "./components/LastgangUploader";
import LastgangControls from "./components/LastgangControls";
import LastgangStats from "./components/LastgangStats";
import LastgangChart from "./components/LastgangChart";

export default function LastgangManager() {
    const [raw, setRaw] = useState([]);
    const [fileName, setFileName] = useState("");
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");
    const [isFullScreen, setIsFullScreen] = useState(false);

    const toggleFullScreen = () => setIsFullScreen(!isFullScreen);

    const [filterMode, setFilterMode] = useState("month");
    const [selectedKey, setSelectedKey] = useState("all");

    const [chartType, setChartType] = useState("line");
    const [resolution, setResolution] = useState("15m");
    const [showEnergy, setShowEnergy] = useState(true);

    const [thresholdKW, setThresholdKW] = useState(0);
    const [energyUnit, setEnergyUnit] = useState("kWh");

    const reset = () => {
        setRaw([]);
        setFileName("");
        setError("");
        setFilterMode("month");
        setSelectedKey("all");
        setChartType("line");
        setResolution("15m");
        setShowEnergy(true);
        setThresholdKW(0);
        setEnergyUnit("kWh");
    };

    const monthOptions = useMemo(() => {
        const set = new Set(raw.map((r) => r.monthKey));
        return Array.from(set).sort();
    }, [raw]);

    const weekOptions = useMemo(() => {
        const set = new Set(raw.map((r) => r.weekKey));
        return Array.from(set).sort();
    }, [raw]);

    const dayOptions = useMemo(() => {
        const set = new Set(raw.map((r) => r.dayKey));
        return Array.from(set).sort();
    }, [raw]);

    const scoped = useMemo(() => {
        if (!raw.length) return [];
        if (filterMode === "all" || selectedKey === "all") return raw;
        const keyName =
            filterMode === "month"
                ? "monthKey"
                : filterMode === "week"
                    ? "weekKey"
                    : "dayKey";
        return raw.filter((r) => r[keyName] === selectedKey);
    }, [raw, filterMode, selectedKey]);

    const series = useMemo(() => {
        if (resolution === "15m") return scoped;
        const buckets = new Map();
        for (const r of scoped) {
            const d = new Date(r.tsm);
            const key = `${d.getFullYear()}-${pad2(d.getMonth() + 1)}-${pad2(d.getDate())} ${pad2(d.getHours())}`;
            const acc = buckets.get(key) || {
                sum: 0,
                n: 0,
                tsm: Date.UTC(d.getFullYear(), d.getMonth(), d.getDate(), d.getHours()),
            };
            acc.sum += r.kW;
            acc.n += 1;
            buckets.set(key, acc);
        }
        return Array.from(buckets.entries())
            .sort((a, b) => a[1].tsm - b[1].tsm)
            .map(([, v]) => ({ tsm: v.tsm, kW: v.sum / v.n }));
    }, [scoped, resolution]);

    const finalSeries = useMemo(() => {
        const MAX = 6000;
        const arr = series;
        if (arr.length <= MAX) return arr;
        const step = Math.ceil(arr.length / MAX);
        const thinned = [];
        for (let i = 0; i < arr.length; i += step) thinned.push(arr[i]);
        return thinned;
    }, [series]);

    const stats = useMemo(() => {
        if (finalSeries.length < 2) return null;
        let min = Infinity,
            max = -Infinity,
            sum = 0,
            energy = 0;
        for (let i = 0; i < finalSeries.length; i++) {
            const p = finalSeries[i];
            if (p.kW < min) min = p.kW;
            if (p.kW > max) max = p.kW;
            sum += p.kW;
            if (i > 0) {
                const prev = finalSeries[i - 1];
                const deltaH = (p.tsm - prev.tsm) / 3600000;
                energy += prev.kW * deltaH;
            }
        }
        const avg = sum / finalSeries.length;

        // Initialize threshold to average if currently zero
        if (thresholdKW === 0 && avg > 0) {
            setThresholdKW(round(avg));
        }

        return {
            minKW: round(min),
            maxKW: round(max),
            avgKW: round(avg),
            energyKWh: round(energy),
        };
    }, [finalSeries, thresholdKW]);

    const thresholdStats = useMemo(() => {
        return calculateThresholdStats(finalSeries, thresholdKW);
    }, [finalSeries, thresholdKW]);

    const energyOverlay = useMemo(() => {
        if (!showEnergy || finalSeries.length < 2) return null;
        let cum = 0;
        const out = [{ tsm: finalSeries[0].tsm, kWh: 0 }];
        for (let i = 1; i < finalSeries.length; i++) {
            const prev = finalSeries[i - 1];
            const cur = finalSeries[i];
            const deltaH = (cur.tsm - prev.tsm) / 3600000;
            cum += prev.kW * deltaH;
            out.push({ tsm: cur.tsm, kWh: cum });
        }
        return out;
    }, [finalSeries, showEnergy]);

    const chartDomain = useMemo(() => {
        return getPeriodDomain(filterMode, selectedKey, raw);
    }, [filterMode, selectedKey, raw]);

    const periodOptions =
        filterMode === "month"
            ? monthOptions
            : filterMode === "week"
                ? weekOptions
                : dayOptions;

    const periodLabel =
        filterMode === "month"
            ? "Monat"
            : filterMode === "week"
                ? "ISO-Woche"
                : "Tag";

    return (
        <Box
            sx={{
                p: isFullScreen ? 2 : 3,
                width: isFullScreen ? "100vw" : "100%",
                height: isFullScreen ? "100vh" : "auto",
                position: isFullScreen ? "fixed" : "relative",
                top: 0,
                left: 0,
                zIndex: isFullScreen ? 1300 : "auto",
                bgcolor: "background.default",
                overflow: "auto",
                transition: "all 0.3s ease",
            }}
        >
            <Paper elevation={2} sx={{ p: 2 }}>
                <Stack direction="row" alignItems="center" justifyContent="space-between" sx={{ mb: 1 }}>
                    <Stack direction="row" alignItems="center" spacing={1}>
                        <BoltIcon color="primary" />
                        <Typography variant="h5">Lastgang Analyse</Typography>
                    </Stack>
                    <IconButton onClick={toggleFullScreen} color="primary">
                        {isFullScreen ? <FullscreenExitIcon /> : <FullscreenIcon />}
                    </IconButton>
                </Stack>

                {!raw.length ? (
                    <LastgangUploader
                        onDataLoaded={setRaw}
                        loading={loading}
                        setLoading={setLoading}
                        error={error}
                        setError={setError}
                        setFileName={setFileName}
                    />
                ) : (
                    <>
                        <Stack
                            direction="row"
                            spacing={1}
                            alignItems="center"
                            sx={{ mb: 2, flexWrap: "wrap" }}
                        >
                            <Chip
                                label={`Datei: ${fileName}`}
                                color="primary"
                                variant="outlined"
                            />
                            <Chip
                                label={`${raw.length} Datenpunkte`}
                                color="secondary"
                                variant="outlined"
                            />
                            <Button
                                onClick={reset}
                                startIcon={<RestartAltIcon />}
                                size="small"
                            >
                                Zurücksetzen
                            </Button>
                        </Stack>

                        <LastgangControls
                            filterMode={filterMode}
                            setFilterMode={setFilterMode}
                            selectedKey={selectedKey}
                            setSelectedKey={setSelectedKey}
                            chartType={chartType}
                            setChartType={setChartType}
                            showEnergy={showEnergy}
                            setShowEnergy={setShowEnergy}
                            periodOptions={periodOptions}
                            periodLabel={periodLabel}
                            energyUnit={energyUnit}
                            setEnergyUnit={setEnergyUnit}
                        />

                        <Divider sx={{ my: 1 }} />

                        <LastgangStats
                            stats={stats}
                            thresholdStats={thresholdStats}
                            thresholdKW={thresholdKW}
                            setThresholdKW={setThresholdKW}
                            selectedKey={selectedKey}
                            filterMode={filterMode}
                            periodLabel={periodLabel}
                            dataPointCount={finalSeries.length}
                            energyUnit={energyUnit}
                            setEnergyUnit={setEnergyUnit}
                        />

                        <LastgangChart
                            chartType={chartType}
                            finalSeries={finalSeries}
                            energyOverlay={energyOverlay}
                            filterMode={filterMode}
                            thresholdKW={thresholdKW}
                            setThresholdKW={setThresholdKW}
                            chartDomain={chartDomain}
                            energyUnit={energyUnit}
                            isFullScreen={isFullScreen}
                        />
                    </>
                )}
            </Paper>
        </Box>
    );
}
