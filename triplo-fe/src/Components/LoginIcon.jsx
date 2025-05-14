import { User } from 'lucide-react';
import { Box, useMediaQuery, useTheme } from '@mui/material';
import { useContext } from 'react';
import { ColorModeContext } from "./ThemeContext";

const LoginIcon = ({ onClick }) => {
    const theme = useTheme();
    const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
    const colorMode = useContext(ColorModeContext);

    return (
        <Box
            sx={{
                cursor: 'pointer',
                display: 'inline-flex',
                alignItems: 'center',
                color: theme.palette.text.primary
            }}
            onClick={onClick}
        >
            <User color={theme.palette.text.primary} size={isMobile ? 16 : 20} />
        </Box>
    );
};

export default LoginIcon;
