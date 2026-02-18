export const pad2 = (n) => String(n).padStart(2, "0");

export const toUTCDate = (d) =>
    new Date(Date.UTC(d.getFullYear(), d.getMonth(), d.getDate()));

export const getISOWeekYear = (date) => {
    const d = toUTCDate(date);
    d.setUTCDate(d.getUTCDate() + 4 - (d.getUTCDay() || 7));
    return d.getUTCFullYear();
};

export const getISOWeek = (date) => {
    const d = toUTCDate(date);
    d.setUTCDate(d.getUTCDate() + 4 - (d.getUTCDay() || 7));
    const yearStart = new Date(Date.UTC(d.getUTCFullYear(), 0, 1));
    const weekNo = Math.ceil(((d - yearStart) / 86400000 + 1) / 7);
    return weekNo;
};

export const parseExcelDate = (v) => {
    if (!v) return null;
    if (v instanceof Date) return v;
    if (typeof v === "string") {
        const str = v.trim();
        // Handle "DD.MM.YYYY, HH:mm" or "DD.MM.YYYY HH:mm"
        const parts = str.split(/[,\s]+/);
        if (parts.length >= 2) {
            const datePart = parts[0];
            const timePart = parts[1];
            const [dd, mm, yyyy] = datePart.split(".").map((s) => parseInt(s, 10));
            const [HH, MM] = timePart.split(":").map((s) => parseInt(s, 10));
            if (yyyy && mm && dd) {
                return new Date(yyyy, mm - 1, dd, HH || 0, MM || 0, 0, 0);
            }
        }
        // Fallback for simple ISO or other standard JS formats
        const d = new Date(str);
        if (!isNaN(d.getTime())) return d;
    }
    if (typeof v === "number") {
        const excelEpoch = new Date(Date.UTC(1899, 11, 30));
        const ms = v * 24 * 60 * 60 * 1000;
        return new Date(excelEpoch.getTime() + ms);
    }
    return null;
};

export const coerceKW = (val) => {
    if (val == null) return null;
    if (typeof val === "number") return val;
    if (typeof val === "string") return parseFloat(val.replace(",", "."));
    return null;
};

export const findHeader = (rows) => {
    for (let i = 0; i < Math.min(rows.length, 30); i++) {
        const row = rows[i] || [];
        for (let j = 0; j < row.length; j++) {
            const cell = String(row[j] || "").trim();
            if (
                /^datum\s*\/\s*zeit$/i.test(cell) ||
                /^datum\s*-?\s*zeit$/i.test(cell) ||
                /date\/?time/i.test(cell)
            ) {
                return { headerRow: i, tsCol: j, kwCol: j + 1 };
            }
        }
    }
    return { headerRow: 0, tsCol: 0, kwCol: 1 };
};

export const round = (n, d = 2) => {
    if (!n) return 0;
    return Math.round(n * 10 ** d) / 10 ** d;
};

export const calculateThresholdStats = (series, threshold) => {
    if (!series || series.length < 2) return null;

    let energyAbove = 0;
    let energyBelow = 0;
    let timeAbove = 0; // in hours
    let timeBelow = 0; // in hours

    for (let i = 1; i < series.length; i++) {
        const prev = series[i - 1];
        const cur = series[i];
        const deltaH = (cur.tsm - prev.tsm) / 3600000;

        const val = prev.kW;
        if (val > threshold) {
            energyAbove += (val - threshold) * deltaH;
            energyBelow += threshold * deltaH;
            timeAbove += deltaH;
        } else {
            energyBelow += val * deltaH;
            timeBelow += deltaH;
        }
    }

    return {
        energyAbove: round(energyAbove),
        energyBelow: round(energyBelow),
        timeAbove: round(timeAbove),
        timeBelow: round(timeBelow),
        totalEnergy: round(energyAbove + energyBelow),
        peakRatio: round((energyAbove / (energyAbove + energyBelow || 1)) * 100, 1)
    };
};

export const getPeriodDomain = (filterMode, selectedKey, data) => {
    if (!selectedKey || selectedKey === "all" || filterMode === "all") {
        if (!data || !data.length) return ["auto", "auto"];
        return [data[0].tsm, data[data.length - 1].tsm];
    }

    if (filterMode === "month") {
        const [yyyy, mm] = selectedKey.split("-").map(Number);
        // Date.UTC uses 0-11 for months.
        const start = Date.UTC(yyyy, mm - 1, 1, 0, 0, 0, 0);
        // Next month's 0th day is the last day of the current month.
        const end = Date.UTC(yyyy, mm, 0, 23, 59, 59, 999);
        return [start, end];
    }

    if (filterMode === "week") {
        const filtered = (data || []).filter(d => d.weekKey === selectedKey);
        if (!filtered.length) return ["auto", "auto"];

        const d = new Date(filtered[0].tsm);
        const day = d.getDay() || 7;
        d.setHours(0, 0, 0, 0);
        d.setDate(d.getDate() - day + 1);
        const start = d.getTime();
        const end = start + 7 * 86400000 - 1;
        return [start, end];
    }

    if (filterMode === "day") {
        const [yyyy, mm, dd] = selectedKey.split("-").map(Number);
        const start = Date.UTC(yyyy, mm - 1, dd, 0, 0, 0, 0);
        const end = Date.UTC(yyyy, mm - 1, dd, 23, 59, 59, 999);
        return [start, end];
    }

    return ["auto", "auto"];
};

export const formatNum = (val, decimals = 1) => {
    if (!Number.isFinite(val)) return "0";
    return new Intl.NumberFormat("de-DE", {
        minimumFractionDigits: decimals,
        maximumFractionDigits: decimals,
    }).format(val);
};

export const formatDT = (date, options = {}) => {
    const d = date instanceof Date ? date : new Date(date);
    return new Intl.DateTimeFormat("de-DE", options).format(d);
};

export const formatPeriodKey = (mode, key) => {
    if (!key || key === "all") return "Alle";
    if (mode === "month") {
        const [y, m] = key.split("-").map(Number);
        return new Intl.DateTimeFormat("de-DE", { month: "long", year: "numeric" }).format(new Date(y, m - 1));
    }
    if (mode === "day") {
        const [y, m, d] = key.split("-").map(Number);
        return new Intl.DateTimeFormat("de-DE", { day: "2-digit", month: "2-digit", year: "numeric" }).format(new Date(y, m - 1, d));
    }
    return key;
};

export const convertEnergy = (kWh, unit) => {
    if (unit === "MWh") return kWh / 1000;
    if (unit === "GWh") return kWh / 1000000;
    return kWh;
};
