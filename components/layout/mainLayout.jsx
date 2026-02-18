import { AppBar, Toolbar, Typography, Box, Avatar } from "@mui/material";
import Image from "next/image";

export default function TopNav() {
  return (
    <AppBar position="static" sx={{ background: "black" }}>
      <Toolbar sx={{ justifyContent: "flex-start" }}>
        {/* Logo */}
        <Box sx={{ display: "flex", alignItems: "center" }}>
          <Avatar
            src="/logo2.png"
            alt="BountWare logo"
            sx={{
              width: 32,
              height: 32,
              marginRight: "8px",
              borderRadius: "15px", // or keep circular with default borderRadius
            }}
          />
          <Typography variant="h6" component="div">
            Bountware
          </Typography>
        </Box>
      </Toolbar>
    </AppBar>
  );
}
