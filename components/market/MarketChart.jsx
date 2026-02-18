import React, { useCallback } from "react";
import Box from "@mui/material/Box";
import {
    ResponsiveContainer,
    AreaChart,
    Area,
    XAxis,
    YAxis,
    Tooltip,
    CartesianGrid,
    ReferenceLine,
} from "recharts";
import { formatNum } from "../lastgangAnalyse/utils/lastgangUtils";

const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
        const date = new Date(label);
        return (
            <Box
                sx={{
                    bgcolor: "background.paper",
                    p: 1.5,
                    border: "1px solid",
                    borderColor: "divider",
                    borderRadius: 2,
                    boxShadow: "0 4px 20px rgba(0,0,0,0.08)",
                    minWidth: 180
                }}
            >
                <Box sx={{ mb: 1, pb: 0.5, borderBottom: "1px solid", borderColor: "divider" }}>
                    <Box sx={{ fontSize: "0.7rem", color: "text.secondary", fontWeight: 600, textTransform: "uppercase", letterSpacing: 0.5 }}>
                        Zeitpunkt
                    </Box>
                    <Box sx={{ fontSize: "0.85rem", fontWeight: 600 }}>
                        {date.toLocaleString("de-DE", { day: '2-digit', month: '2-digit', year: 'numeric', hour: '2-digit', minute: '2-digit' })} Uhr
                    </Box>
                </Box>
                <Box sx={{ display: 'flex', flexDirection: 'column', gap: 0.75 }}>
                    {payload.map((entry, index) => (
                        <Box key={index} sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 2 }}>
                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                                <Box sx={{ width: 8, height: 8, borderRadius: '50%', bgcolor: entry.color }} />
                                <Box sx={{ fontSize: "0.8rem", color: "text.secondary" }}>{entry.name}</Box>
                            </Box>
                            <Box sx={{ fontSize: "0.8rem", fontWeight: 700, color: "text.primary" }}>
                                {formatNum(entry.value, 2)} ct/kWh
                            </Box>
                        </Box>
                    ))}
                </Box>
            </Box>
        );
    }
    return null;
};

export default function MarketChart({ data, basePrice, peakPrice }) {
    const formatTick = useCallback((ts) => {
        const d = new Date(ts);
        return d.toLocaleDateString("de-DE", {
            day: "2-digit",
            month: "2-digit",
        });
    }, []);

    return (
        <Box sx={{ width: "100%", height: 400, minHeight: 300 }}>
            <ResponsiveContainer>
                <AreaChart
                    data={data}
                    margin={{ top: 10, right: 30, left: 0, bottom: 0 }}
                >
                    <defs>
                        <linearGradient id="colorPrice" x1="0" y1="0" x2="0" y2="1">
                            <stop offset="5%" stopColor="#1976d2" stopOpacity={0.8} />
                            <stop offset="95%" stopColor="#1976d2" stopOpacity={0} />
                        </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} />
                    <XAxis
                        dataKey="timestamp"
                        type="number"
                        domain={['auto', 'auto']}
                        tickFormatter={formatTick}
                    />
                    <YAxis
                        tickFormatter={(v) => formatNum(v, 1)}
                        label={{ value: 'ct/kWh', angle: -90, position: 'insideLeft' }}
                    />
                    <Tooltip content={<CustomTooltip />} />
                    <Area
                        type="monotone"
                        dataKey="price"
                        stroke="#1976d2"
                        fillOpacity={1}
                        fill="url(#colorPrice)"
                        name="Börsenpreis"
                    />
                    {basePrice && (
                        <ReferenceLine
                            y={basePrice}
                            stroke="#4caf50"
                            strokeDasharray="3 3"
                            label={{ value: `Base: ${formatNum(basePrice, 2)}`, position: 'right', fill: '#4caf50', fontSize: 12 }}
                        />
                    )}
                    {peakPrice && (
                        <ReferenceLine
                            y={peakPrice}
                            stroke="#ff9800"
                            strokeDasharray="3 3"
                            label={{ value: `Peak: ${formatNum(peakPrice, 2)}`, position: 'right', fill: '#ff9800', fontSize: 12 }}
                        />
                    )}
                </AreaChart>
            </ResponsiveContainer>
        </Box>
    );
}
