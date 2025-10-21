import React from "react";
import { Drawer, List, ListItem, ListItemIcon, ListItemText } from "@mui/material";
import DashboardIcon from "@mui/icons-material/Dashboard";
import PeopleIcon from "@mui/icons-material/People";
import BarChartIcon from "@mui/icons-material/BarChart";
import AccountBalanceWalletIcon from "@mui/icons-material/AccountBalanceWallet";
import { Link } from "react-router-dom";

export default function Sidebar() {
  const menuItems = [
    { text: "Tổng quan", icon: <DashboardIcon />, path: "/admin/overview" },
    { text: "Người dùng", icon: <PeopleIcon />, path: "/admin/users" },
    { text: "Báo cáo", icon: <BarChartIcon />, path: "/reports" },
    { text: "Ví tiền", icon: <AccountBalanceWalletIcon />, path: "/wallet" },
  ];

  return (
    <Drawer
      variant="permanent"
      sx={{
        width: 240,
        flexShrink: 0,
        [`& .MuiDrawer-paper`]: {
          width: 240,
          boxSizing: "border-box",
          backgroundColor: "var(--pastel-lavender)",
        },
      }}
    >
      <List>
        {menuItems.map((item) => (
          <ListItem
            button
            key={item.text}
            component={Link}
            to={item.path}
            sx={{
              "&:hover": { backgroundColor: "#e3e3f0" },
            }}
          >
            <ListItemIcon>{item.icon}</ListItemIcon>
            <ListItemText primary={item.text} />
          </ListItem>
        ))}
      </List>
    </Drawer>
  );
}