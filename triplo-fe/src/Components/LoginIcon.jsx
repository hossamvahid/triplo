import { User } from 'lucide-react';
import { Box, useMediaQuery, useTheme } from '@mui/material';

const LoginIcon = ({onClick}) => {
    const theme = useTheme();
    const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

    return (
        <Box
            sx={{ cursor: 'pointer', display: 'inline-flex', alignItems: 'center' }}
            onClick={onClick}
        >
            <User color="#3C3C3C" size={isMobile ? 16 : 20} />
        </Box>
    );
};

export default LoginIcon;