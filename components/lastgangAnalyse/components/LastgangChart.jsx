import React, { useCallback } from "react";
import { formatNum, convertEnergy, formatDT } from "../utils/lastgangUtils";
import Box from "@mui/material/Box";
import {
    ResponsiveContainer,
    LineChart,
    Line,
    XAxis,
    YAxis,
    Tooltip,
    CartesianGrid,
    Brush,
    AreaChart,
    Area,
    ReferenceLine,
} from "recharts";

const CustomTooltip = ({ active, payload, label, energyUnit }) => {
    if (active && payload && payload.length) {
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
                        {formatDT(label, { day: '2-digit', month: '2-digit', year: 'numeric' })} | {formatDT(label, { hour: '2-digit', minute: '2-digit' })} Uhr
                    </Box>
                </Box>
                <Box sx={{ display: 'flex', flexDirection: 'column', gap: 0.75 }}>
                    {payload.map((entry, index) => {
                        const isEnergy = entry.name === "Energie";
                        const prec = isEnergy ? (energyUnit === "kWh" ? 1 : 3) : 1;
                        const val = isEnergy ? convertEnergy(entry.value, energyUnit) : entry.value;
                        const unit = isEnergy ? energyUnit : "kW";

                        return (
                            <Box key={index} sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 2 }}>
                                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                                    <Box sx={{ width: 8, height: 8, borderRadius: '50%', bgcolor: entry.color }} />
                                    <Box sx={{ fontSize: "0.8rem", color: "text.secondary" }}>{entry.name}</Box>
                                </Box>
                                <Box sx={{ fontSize: "0.8rem", fontWeight: 700, color: "text.primary" }}>
                                    {formatNum(val, prec)} {unit}
                                </Box>
                            </Box>
                        );
                    })}
                </Box>
            </Box>
        );
    }
    return null;
};

export default function LastgangChart({
    chartType,
    finalSeries,
    energyOverlay,
    filterMode,
    thresholdKW,
    setThresholdKW,
    chartDomain,
    energyUnit
}) {
    const formatTick = useCallback(
        (tsm) => {
            const d = new Date(tsm);
            if (filterMode === "day") {
                return d.toLocaleTimeString("de-DE", {
                    hour: "2-digit",
                    minute: "2-digit",
                });
            }
            return d.toLocaleDateString("de-DE", {
                day: "2-digit",
                month: "2-digit",
            });
        },
        [filterMode],
    );

    const handleChartClick = (state) => {
        if (state && state.activePayload && state.activePayload[0]) {
            const val = state.activePayload[0].payload.kW;
            if (val !== undefined) {
                setThresholdKW(Math.round(val * 10) / 10);
            }
        }
    };

    const ChartComponent = chartType === "line" ? LineChart : AreaChart;
    const DataComponent = chartType === "line" ? Line : Area;

    return (
        <Box sx={{ width: "100%", height: 440 }}>
            <ResponsiveContainer>
                <ChartComponent
                    data={finalSeries}
                    margin={{ top: 10, right: 20, bottom: 20, left: 0 }}
                    onClick={handleChartClick}
                    style={{ cursor: "crosshair" }}
                >
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis
                        dataKey="tsm"
                        type="number"
                        domain={chartDomain || ["auto", "auto"]}
                        tickFormatter={formatTick}
                    />
                    <YAxis
                        yAxisId="kW"
                        width={64}
                        label={{
                            value: "kW",
                            angle: -90,
                            position: "insideLeft",
                        }}
                    />
                    <Tooltip content={<CustomTooltip energyUnit={energyUnit} />} />

                    <DataComponent
                        yAxisId="kW"
                        type="monotone"
                        dataKey="kW"
                        dot={false}
                        strokeWidth={2}
                        fillOpacity={0.35}
                        name="Leistung"
                    />

                    {energyOverlay && (
                        <YAxis
                            yAxisId="kWh"
                            orientation="right"
                            width={64}
                            label={{
                                value: "kWh",
                                angle: -90,
                                position: "insideRight",
                            }}
                        />
                    )}

                    {energyOverlay && (
                        <DataComponent
                            yAxisId="kWh"
                            type="monotone"
                            data={energyOverlay}
                            dataKey="kWh"
                            dot={false}
                            strokeWidth={2}
                            fillOpacity={0.15}
                            name="Energie"
                        />
                    )}

                    <ReferenceLine
                        y={thresholdKW}
                        yAxisId="kW"
                        stroke="red"
                        strokeWidth={2}
                        strokeDasharray="5 5"
                        label={{
                            value: `Limit: ${formatNum(thresholdKW)} kW`,
                            position: 'insideTopRight',
                            fill: 'red',
                            fontSize: 14,
                            fontWeight: "bold",
                            dy: -18,
                            dx: -10
                        }}
                        isFront={true}
                    />

                    <Brush
                        dataKey="tsm"
                        height={24}
                        tickFormatter={formatTick}
                        travellerWidth={8}
                    />
                    <ReferenceLine y={0} yAxisId="kW" strokeOpacity={0.2} />
                </ChartComponent>
            </ResponsiveContainer>
        </Box>
    );
}
