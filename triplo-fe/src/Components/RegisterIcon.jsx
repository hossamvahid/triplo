import { useContext } from 'react';
import { UserPlus } from 'lucide-react';
import { Box, useMediaQuery, useTheme } from '@mui/material';
import { ColorModeContext } from "./ThemeContext";

const RegisterIcon = ({ onClick }) => {
    const theme = useTheme();
    const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
    const colorMode = useContext(ColorModeContext); // doar dacă vei folosi toggleColorMode mai târziu

    return (
        <Box
            sx={{
                cursor: 'pointer',
                display: 'inline-flex',
                alignItems: 'center',
                color: theme.palette.text.primary,
            }}
            onClick={onClick}
        >
            <UserPlus color={theme.palette.text.primary} size={isMobile ? 16 : 20} />
        </Box>
    );
};

export default RegisterIcon;
