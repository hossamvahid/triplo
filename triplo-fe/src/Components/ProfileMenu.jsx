import {
    Box,
    Card,
    CardContent,
    IconButton,
    Typography,
    TextField,
    Button,
    Drawer,
    List,
    ListItem,
    ListItemText,
    Divider,
    ListItemButton
} from '@mui/material';
const ProfileMenu = () => {
    return (
        <>
            <Box
                className="w-60 bg-[#FAF9F6] border-r-1 border-black-100 p-4 mt-16"  
              >
                <List>
                    <ListItem disablePadding>
                        <ListItemButton>
                            <ListItemText primary="Profile" />
                        </ListItemButton>
                    </ListItem>
                </List>
            </Box>
        </>
    )
}

export default ProfileMenu;