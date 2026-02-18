"use client";

import React, { useState, useEffect, useMemo } from "react";
import Box from "@mui/material/Box";
import Container from "@mui/material/Container";
import Typography from "@mui/material/Typography";
import CircularProgress from "@mui/material/CircularProgress";
import Alert from "@mui/material/Alert";
import MarketChart from "./MarketChart";
import MarketControls from "./MarketControls";

export default function MarketAnalysisManager() {
    const [indexTimestamps, setIndexTimestamps] = useState([]);
    const [selectedTimestamp, setSelectedTimestamp] = useState(null);
    const [marketData, setMarketData] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    // Fetch Index
    useEffect(() => {
        async function fetchIndex() {
            try {
                const res = await fetch('/api/market?type=index');
                if (!res.ok) throw new Error('Failed to load SMARD index');
                const data = await res.json();
                const ts = data.timestamps || [];
                setIndexTimestamps(ts);
                if (ts.length > 0) {
                    setSelectedTimestamp(ts[ts.length - 1]); // Default to latest
                }
            } catch (err) {
                setError(err.message);
                setLoading(false);
            }
        }
        fetchIndex();
    }, []);

    // Group timestamps by year and month
    const groupedTimestamps = useMemo(() => {
        const groups = {};
        indexTimestamps.forEach(ts => {
            const date = new Date(ts);
            const year = date.getFullYear();
            const month = date.getMonth(); // 0-indexed
            if (!groups[year]) groups[year] = {};
            if (!groups[year][month]) groups[year][month] = [];
            groups[year][month].push(ts);
        });
        return groups;
    }, [indexTimestamps]);

    const years = useMemo(() => Object.keys(groupedTimestamps).sort((a, b) => b - a), [groupedTimestamps]);

    const [selectedYear, setSelectedYear] = useState("");
    const [selectedMonth, setSelectedMonth] = useState("");

    // Initialize selections when index loads
    useEffect(() => {
        if (indexTimestamps.length > 0 && !selectedTimestamp) {
            const latest = indexTimestamps[indexTimestamps.length - 1];
            const date = new Date(latest);
            setSelectedYear(String(date.getFullYear()));
            setSelectedMonth(String(date.getMonth()));
            // setSelectedTimestamp is already set to latest in the fetchIndex useEffect
        }
    }, [indexTimestamps]);

    // Update months when year changes
    const availableMonths = useMemo(() => {
        if (!selectedYear || !groupedTimestamps[selectedYear]) return [];
        return Object.keys(groupedTimestamps[selectedYear]).sort((a, b) => b - a);
    }, [selectedYear, groupedTimestamps]);

    // Update timestamp when month or year changes if current selection not in group
    const availablePackages = useMemo(() => {
        if (!selectedYear || !selectedMonth || !groupedTimestamps[selectedYear]?.[selectedMonth]) return [];
        return groupedTimestamps[selectedYear][selectedMonth].sort((a, b) => b - a);
    }, [selectedYear, selectedMonth, groupedTimestamps]);

    // Fetch Data for selected timestamp
    useEffect(() => {
        if (!selectedTimestamp) return;

        async function fetchData() {
            setLoading(true);
            try {
                const res = await fetch(`/api/market?type=data&timestamp=${selectedTimestamp}`);
                if (!res.ok) throw new Error('Failed to load SMARD data');
                const data = await res.json();

                // SMARD data is in [Timestamp, Price_EUR_MWh]
                const formatted = (data.series || []).map(item => ({
                    timestamp: item[0],
                    price: item[1] / 10 // Convert EUR/MWh to ct/kWh
                }));
                setMarketData(formatted);
                setLoading(false);
            } catch (err) {
                setError(err.message);
                setLoading(false);
            }
        }
        fetchData();
    }, [selectedTimestamp]);

    const stats = useMemo(() => {
        if (!marketData.length) return { base: 0, peak: 0 };

        const total = marketData.reduce((acc, curr) => acc + curr.price, 0);
        const base = total / marketData.length;

        // Peak: 08:00 to 20:00 (12 hours)
        const peakHrs = marketData.filter(item => {
            const date = new Date(item.timestamp);
            const hour = date.getHours(); // Local time
            return hour >= 8 && hour < 20;
        });
        const peak = peakHrs.length > 0
            ? peakHrs.reduce((acc, curr) => acc + curr.price, 0) / peakHrs.length
            : 0;

        return { base, peak };
    }, [marketData]);

    if (error) return <Alert severity="error">{error}</Alert>;

    return (
        <Box>
            <Typography variant="h4" gutterBottom sx={{ fontWeight: 700, color: "primary.main", mb: 4 }}>
                Strommarkt Analyse (Börsenpreise)
            </Typography>

            <MarketControls
                years={years}
                selectedYear={selectedYear}
                onYearChange={(y) => {
                    setSelectedYear(y);
                    const months = Object.keys(groupedTimestamps[y]).sort((a, b) => b - a);
                    const lastMonth = months[0];
                    setSelectedMonth(lastMonth);
                    setSelectedTimestamp(groupedTimestamps[y][lastMonth][0]);
                }}
                months={availableMonths}
                selectedMonth={selectedMonth}
                onMonthChange={(m) => {
                    setSelectedMonth(m);
                    setSelectedTimestamp(groupedTimestamps[selectedYear][m][0]);
                }}
                availablePackages={availablePackages}
                selectedTimestamp={selectedTimestamp}
                onTimestampChange={setSelectedTimestamp}
                basePrice={stats.base}
                peakPrice={stats.peak}
            />

            {loading ? (
                <Box sx={{ display: 'flex', justifyContent: 'center', p: 10 }}>
                    <CircularProgress />
                </Box>
            ) : (
                <MarketChart
                    data={marketData}
                    basePrice={stats.base}
                    peakPrice={stats.peak}
                />
            )}

            <Box sx={{ mt: 4 }}>
                <Typography variant="body2" color="text.secondary">
                    * Datenquelle: SMARD (Bundesnetzagentur). Preise in ct/kWh (Day-Ahead Wholesale).
                    Base entspricht dem 24h Durchschnitt, Peak dem Durchschnitt von 08:00 bis 20:00 Uhr.
                </Typography>
            </Box>
        </Box>
    );
}
