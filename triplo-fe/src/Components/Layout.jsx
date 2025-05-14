import React, { useContext } from "react";
import Navbar from "./Navbar";
import Footer from "./Footer";
import { useTheme } from '@mui/material/styles';
import { ColorModeContext } from "./ThemeContext"; 

const Layout = ({ children }) => {
    const theme = useTheme();
    const colorMode = useContext(ColorModeContext);

    return (
        <div
            style={{
                backgroundColor: theme.palette.background.default,
                color: theme.palette.text.primary,
                minHeight: '100vh',
                display: 'flex',
                flexDirection: 'column',
            }}
        >
            <Navbar />
            <main style={{ flex: 1 }}>{children}</main>
            <Footer />
        </div>
    );
};

export default Layout;
