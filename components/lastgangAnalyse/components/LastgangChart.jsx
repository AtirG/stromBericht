import React, { useCallback } from "react";
import { formatNum, convertEnergy } from "../utils/lastgangUtils";
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

    const tooltipLabelFormatter = (tsm) => {
        const d = new Date(tsm);
        return d.toLocaleString("de-DE", {
            year: "numeric",
            month: "2-digit",
            day: "2-digit",
            hour: "2-digit",
            minute: "2-digit",
        });
    };

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
                    <Tooltip
                        labelFormatter={tooltipLabelFormatter}
                        formatter={(v, name) => {
                            if (name.includes("Energie")) {
                                const prec = energyUnit === "kWh" ? 1 : 3;
                                return [formatNum(convertEnergy(v, energyUnit), prec) + " " + energyUnit, name];
                            }
                            return [formatNum(v) + " kW", name];
                        }}
                    />

                    <DataComponent
                        yAxisId="kW"
                        type="monotone"
                        dataKey="kW"
                        dot={false}
                        strokeWidth={2}
                        fillOpacity={0.35}
                        name="Leistung (kW)"
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
                            name="Energie (kWh)"
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
                            dy: -10,
                            dx: -10,
                            background: "white"
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
