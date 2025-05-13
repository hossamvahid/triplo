import React, { useState } from 'react';
import { Drawer, List, ListItem, ListItemButton, ListItemText, IconButton } from '@mui/material';
import { Menu } from 'lucide-react'; // Iconul pentru sandwich

const ProfileMenuMobile = () => {
    const [menuOpen, setMenuOpen] = useState(false); // Starea meniului (deschis/închis)

    // Funcția pentru a deschide și închide meniul
    const toggleMenu = () => {
        setMenuOpen(!menuOpen);
    };


    return (
        <>
            {/* Butonul de sandwich pentru mobil */}
            <IconButton onClick={toggleMenu}>
                <Menu size={16} /> {/* Iconul pentru sandwich */}
            </IconButton>

            {/* Meniul de tip Drawer pentru mobil, care acoperă întregul conținut */}
            <Drawer
                anchor="left"
                open={menuOpen}
                onClose={toggleMenu}
                sx={{
                    width: 240,
                    flexShrink: 0,
                    '& .MuiDrawer-paper': {
                        width: 350,
                        boxSizing: 'border-box',
                    },
                    zIndex: 1300, // Asigură-te că Drawer apare deasupra altor elemente
                }}
            >

            <IconButton onClick={toggleMenu}>
                <Menu size={16} /> {/* Iconul pentru sandwich */}
            </IconButton>
                <List>
                    <ListItem disablePadding>
                        <ListItemButton>
                            <ListItemText primary="Profile" />
                        </ListItemButton>
                    </ListItem>
                </List>
            </Drawer>
        </>
    );
};

export default ProfileMenuMobile;
