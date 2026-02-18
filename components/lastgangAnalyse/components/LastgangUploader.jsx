import React, { useState } from "react";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Stack from "@mui/material/Stack";
import Alert from "@mui/material/Alert";
import CircularProgress from "@mui/material/CircularProgress";
import CloudUploadIcon from "@mui/icons-material/CloudUpload";
import Typography from "@mui/material/Typography";
import * as XLSX from "xlsx";
import {
    findHeader,
    parseExcelDate,
    coerceKW,
    getISOWeek,
    getISOWeekYear,
    pad2
} from "../utils/lastgangUtils";

export default function LastgangUploader({ onDataLoaded, loading, setLoading, error, setError, setFileName }) {
    const [isDragging, setIsDragging] = useState(false);

    const handleDragOver = (e) => {
        e.preventDefault();
        if (!loading) setIsDragging(true);
    };

    const handleDragLeave = (e) => {
        e.preventDefault();
        setIsDragging(false);
    };

    const handleDrop = (e) => {
        e.preventDefault();
        setIsDragging(false);
        if (loading) return;

        const file = e.dataTransfer.files?.[0];
        if (file) {
            handleFile(file);
        }
    };

    const handleFile = async (file) => {
        setLoading(true);
        setError("");
        setFileName(file?.name || "");
        try {
            const buf = await file.arrayBuffer();
            const wb = XLSX.read(buf, { cellDates: true, cellNF: true });
            const sheet = wb.Sheets[wb.SheetNames[0]];
            const rows = XLSX.utils.sheet_to_json(sheet, { header: 1, raw: true });
            if (!rows || !rows.length) throw new Error("Die Tabelle ist leer.");

            const { headerRow, tsCol, kwCol } = findHeader(rows);
            const dataStart = headerRow + 1;

            const parsed = [];
            for (let i = dataStart; i < rows.length; i++) {
                const r = rows[i] || [];
                const ts = parseExcelDate(r[tsCol]);
                const kW = coerceKW(r[kwCol]);
                if (!ts || !Number.isFinite(kW)) continue;

                const tsm = ts.getTime();
                const year = ts.getFullYear();
                const month = ts.getMonth() + 1;
                const day = ts.getDate();
                const week = getISOWeek(ts);
                const wyear = getISOWeekYear(ts);

                parsed.push({
                    ts,
                    tsm,
                    kW,
                    monthKey: `${year}-${pad2(month)}`,
                    weekKey: `${wyear}-W${pad2(week)}`,
                    dayKey: `${year}-${pad2(month)}-${pad2(day)}`,
                });
            }

            if (!parsed.length)
                throw new Error(
                    "Keine gültigen Datenzeilen unter der Kopfzeile gefunden.",
                );
            onDataLoaded(parsed);
        } catch (e) {
            console.error(e);
            setError(e?.message || "Fehler beim Lesen der Datei.");
            onDataLoaded([]);
        } finally {
            setLoading(false);
        }
    };

    const handleLoadDemo = async () => {
        setLoading(true);
        setError("");
        try {
            const response = await fetch("/LastgangExample2024.xlsx");
            if (!response.ok) throw new Error("Demo-Datei konnte nicht geladen werden.");
            const blob = await response.blob();
            const file = new File([blob], "LastgangExample2024.xlsx", {
                type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
            });
            await handleFile(file);
        } catch (e) {
            console.error(e);
            setError(e?.message || "Fehler beim Laden der Demo-Datei.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <Box
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
            onDrop={handleDrop}
            sx={{
                textAlign: "center",
                py: 4,
                px: 2,
                border: "2px dashed",
                borderColor: isDragging ? "primary.main" : "divider",
                borderRadius: 3,
                bgcolor: "background.darker",
                transition: "all 0.2s ease-in-out",
                cursor: loading ? "default" : "pointer",
                "&:hover": {
                    bgcolor: "action.hover",
                    borderColor: "primary.main"
                },
                position: "relative"
            }}
        >
            <Box
                onClick={() => !loading && document.getElementById("xls-input")?.click()}
                sx={{ position: "absolute", top: 0, left: 0, right: 0, bottom: 0, zIndex: 1 }}
            />
            <input
                id="xls-input"
                type="file"
                accept=".xlsx,.xls,.csv"
                style={{ display: "none" }}
                onChange={(e) => e.target.files?.[0] && handleFile(e.target.files[0])}
            />

            <Box sx={{ position: "relative", zIndex: 2, pointerEvents: "none" }}>
                <CloudUploadIcon sx={{ fontSize: 32, color: isDragging ? "primary.main" : "text.secondary", mb: 1.5 }} />

                <Typography variant="subtitle1" sx={{ mb: 0.5, fontWeight: "bold" }}>
                    Zertifizierten Lastgang hochladen
                </Typography>
                <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                    Ziehen Sie Ihre Excel- oder CSV-Datei hierher oder klicken Sie zum Auswählen.
                </Typography>
            </Box>

            <Stack
                direction="row"
                spacing={1}
                justifyContent="center"
                sx={{ position: "relative", zIndex: 3 }}
            >
                <Button
                    variant="contained"
                    size="small"
                    startIcon={<CloudUploadIcon />}
                    disabled={loading}
                    component="span"
                    onClick={() => document.getElementById("xls-input")?.click()}
                >
                    Datei auswählen
                </Button>

                <Button
                    variant="outlined"
                    size="small"
                    disabled={loading}
                    onClick={(e) => {
                        e.stopPropagation();
                        handleLoadDemo();
                    }}
                >
                    Demo laden
                </Button>
            </Stack>

            {loading && (
                <Box sx={{ mt: 2, display: "flex", alignItems: "center", justifyContent: "center" }}>
                    <CircularProgress size={24} sx={{ mr: 1 }} />
                    <Typography variant="caption">Analysiere Daten...</Typography>
                </Box>
            )}

            {error && (
                <Alert severity="error" sx={{ mt: 2, mx: "auto", maxWidth: 560 }}>
                    {error}
                </Alert>
            )}
        </Box>
    );
}
