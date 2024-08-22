import * as React from "react";
import { styled } from "@mui/material/styles";
import AppBar from "@mui/material/AppBar";
import Box from "@mui/material/Box";
import Toolbar from "@mui/material/Toolbar";
import Typography from "@mui/material/Typography";
import { NavLink as MuiLink } from "react-router-dom";
import HomeIcon from '@mui/icons-material/Home';
import CalculateIcon from '@mui/icons-material/Calculate';

function Header() {
  return (
    <Box sx={{ flexGrow: 1 }}>
      <AppBar position="static" sx={{ bgcolor: "primary.dark" }}>
        <Toolbar>
          <MuiLink
            to="/"
            color="inherit"
            fontFamily="monospace"
            align="center"
            style={{ textDecoration: "none", marginRight: "20px", display: "flex", alignItems: "center" }}
          >
            <HomeIcon sx={{ marginRight: "8px", color: "black"}} />
            <Typography variant="h6" color="white">
              Learn you a linear algebra
            </Typography>
          </MuiLink>

          <MuiLink
            to="/vector"
            color="white"
            fontFamily="monospace"
            align="center"
            style={{ textDecoration: "none", marginRight: "20px", display: "flex", alignItems: "center" }}
          >
            <CalculateIcon sx={{ marginRight: "8px", color: "black" }} />
            <Typography variant="h6" color="white" align="center">
              Vector calculator
            </Typography>
          </MuiLink>

          <MuiLink
            to="/matrix"
            color="white"
            fontFamily="monospace"
            align="center"
            style={{ textDecoration: "none", marginRight: "20px", display: "flex", alignItems: "center" }}
          >
            <CalculateIcon sx={{ marginRight: "8px", color: "black"}} />
            <Typography variant="h6" color="white">
              Matrix calculator
            </Typography>
          </MuiLink>
        </Toolbar>
      </AppBar>
    </Box>
  );
}

export default Header;
