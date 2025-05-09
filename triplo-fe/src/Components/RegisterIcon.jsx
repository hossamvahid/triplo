import { UserPlus } from 'lucide-react';
import { Box, useMediaQuery, useTheme, Typography } from '@mui/material';

const RegisterIcon = ({onClick}) => {
    const theme = useTheme();
    const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
    return (
        <>
            <Box
                onClick={onClick}
                sx={{ cursor: 'pointer', display: 'inline-flex', alignItems: 'center' }}
            >
                <UserPlus color="#3C3C3C" size={isMobile ? 16 : 20} />
            </Box>
        </>
    )
}

export default RegisterIcon;