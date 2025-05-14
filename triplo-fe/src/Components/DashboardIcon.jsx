import { Gauge } from 'lucide-react';
import { Box, useMediaQuery, useTheme } from '@mui/material';

const DashboardIcon = ({ onClick }) => {
    const theme = useTheme();
    const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

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
            <Gauge color={theme.palette.text.primary} size={isMobile ? 16 : 20} />
        </Box>
    );
};

export default DashboardIcon;
