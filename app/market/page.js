import React from "react";
import Box from "@mui/material/Box";
import Container from "@mui/material/Container";
import MarketAnalysisManager from "@/components/market/MarketAnalysisManager";

export default function MarketPage() {
    return (
        <Box sx={{ py: 6, bgcolor: "background.default", minHeight: "100vh" }}>
            <Container maxWidth="lg">
                <MarketAnalysisManager />
            </Container>
        </Box>
    );
}
