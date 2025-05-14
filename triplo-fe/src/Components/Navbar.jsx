import React, { useState, useEffect, useContext } from "react";
import AppBar from "@mui/material/AppBar";
import Toolbar from "@mui/material/Toolbar";
import Button from "@mui/material/Button";
import { Box, IconButton } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import LoginIcon from "./LoginIcon";
import RegisterIcon from "./RegisterIcon";
import { useAuth } from "../hooks/useAuth";
import { fetchUserRole } from "../utils/fetchUserRole";
import DashboardIcon from "./DashboardIcon";
import LogoutIcon from "./LogoutIcon";
import HouseIcon from "./HouseIcon";
import UserProfileIcon from "./UserProfileIcon";
import { Brightness4, Brightness7 } from '@mui/icons-material';
import { useTheme } from '@mui/material/styles';
import { ColorModeContext } from "./ThemeContext";

const Navbar = () => {
    const navigate = useNavigate();
    const { getToken } = useAuth();
    const [role, setRole] = useState(null);
    const theme = useTheme();
    const colorMode = useContext(ColorModeContext);

    useEffect(() => {
        const fetchRole = async () => {
            const token = getToken();

            if (token) {
                try {
                    const userRole = await fetchUserRole(token);

                    if (!userRole) {
                        localStorage.removeItem("authToken");
                        setRole("");
                        navigate("/");
                    } else {
                        setRole(userRole);
                    }
                } catch (error) {
                    console.error("Error fetching user role: ", error);
                    localStorage.removeItem("authToken");
                    setRole("");
                    navigate("/");
                }
            } else {
                setRole("");
            }
        };

        fetchRole();
    }, [getToken, navigate]);

    const handleRedirect = (path) => {
        navigate(path);
    };

    const logOut = () => {
        localStorage.removeItem("authToken");
        navigate("/");
    };

    return (
        <header>
            <AppBar elevation={2}>
                <Toolbar
                    className="flex justify-between items-center px-4"
                    sx={{
                        backgroundColor: theme.palette.background.default,
                        color: theme.palette.text.primary,
                        borderBottom: `0.25px solid ${theme.palette.divider}`
                    }}
                >
                    <Button
                        onClick={() => handleRedirect("/")}
                        sx={{
                            color: theme.palette.text.primary,
                            backgroundColor: "transparent",
                        }}
                    >
                        Triplo
                    </Button>

                    <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
                        {role === "" && (
                            <>
                                <LoginIcon onClick={() => handleRedirect("/login")} />
                                <RegisterIcon onClick={() => handleRedirect("/register")} />
                                <IconButton onClick={colorMode.toggleColorMode} color="inherit">
                                    {theme.palette.mode === 'dark' ? <Brightness7 /> : <Brightness4 />}
                                </IconButton>
                            </>
                        )}

                        {role === "Admin" && (
                            <>
                                <HouseIcon onClick={() => handleRedirect("/accomodations")} />
                                <DashboardIcon onClick={() => handleRedirect("/")} />
                                <LogoutIcon onClick={logOut} />

                                <IconButton onClick={colorMode.toggleColorMode} color="inherit">
                                    {theme.palette.mode === 'dark' ? <Brightness7 /> : <Brightness4 />}
                                </IconButton>
                            </>
                        )}

                        {role === "User" && (
                            <>
                                <HouseIcon onClick={() => handleRedirect("/accomodations")} />
                                <UserProfileIcon onClick={() => handleRedirect("/profile")} />
                                <LogoutIcon onClick={logOut} />

                                <IconButton onClick={colorMode.toggleColorMode} color="inherit">
                                    {theme.palette.mode === 'dark' ? <Brightness7 /> : <Brightness4 />}
                                </IconButton>
                            </>
                        )}
                    </Box>
                </Toolbar>
            </AppBar>
        </header>
    );
};

export default Navbar;
