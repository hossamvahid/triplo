import React, { useState, useEffect } from "react"
import AppBar from "@mui/material/AppBar";
import Toolbar from "@mui/material/Toolbar";
import Button from "@mui/material/Button";
import { Box } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import LoginIcon from "./LoginIcon";
import RegisterIcon from "./RegisterIcon";
import { useAuth } from "../hooks/useAuth";
import { fetchUserRole } from "../utils/fetchUserRole";
import DashboardIcon from "./DashboardIcon";
import LogoutIcon from "./LogoutIcon";
import HouseIcon from "./HouseIcon";
import UserProfileIcon from "./UserProfileIcon";

const Navbar = () => {

    const navigate = useNavigate();
    const { getToken } = useAuth();
    const [role, setRole] = useState(null);

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
                    }
                    else {
                        setRole(userRole);
                    }
                }
                catch (error) {
                    console.error("Error fetching user role: ", error);
                    localStorage.removeItem("authToken");
                    setRole("");
                    navigate("/");
                }

            }
            else {
                setRole("");
            }
        };


        fetchRole();

    }, [getToken, navigate]);


    const handleRedirect = (where) => {
        navigate(where);
    }

    const logOut = () => {
        localStorage.removeItem("authToken");
        navigate("/");
    }

    return (
        <>
            <header>
                <AppBar elevation={2}>
                    <Toolbar className="flex justify-between items-center px-4"
                        sx={{
                            backgroundColor: '#FAF9F6',
                            borderBottom: '0.25px solid #3C3C3C'
                        }}>

                        <Button sx={{ color: "#3C3C3C", backgroundColor: "transparent" }} onClick={() => handleRedirect("/")}> Triplo </Button>

                        <Box>

                        </Box>

                        <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
                            {role === "" && (
                                <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
                                    <LoginIcon onClick={() => handleRedirect("/login")} />

                                    <RegisterIcon onClick={() => handleRedirect("/register")} />
                                </Box>
                            )}


                            {role === "Admin" && (
                                <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
                                    <HouseIcon onClick={() => handleRedirect("/accomodations")} />
                                    <DashboardIcon onClick={() => handleRedirect("/")} />
                                    <LogoutIcon onClick={logOut} />
                                </Box>
                            )}

                            {role === "User" && (
                                <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
                                    <HouseIcon onClick={() => handleRedirect("/accomodations")} />
                                    <UserProfileIcon onClick={() => handleRedirect("/profile")} />
                                    <LogoutIcon onClick={logOut} />
                                </Box>
                            )}







                        </Box>

                    </Toolbar>
                </AppBar>
            </header>
        </>
    )

}

export default Navbar;