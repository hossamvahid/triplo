import { House } from 'lucide-react';
import { Box, useMediaQuery, useTheme } from '@mui/material';

const HouseIcon = ({onClick}) => {
    const theme = useTheme();
    const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

    return (
        <Box
            sx={{ cursor: 'pointer', display: 'inline-flex', alignItems: 'center' }}
            onClick={onClick}
        >
            <House color="#3C3C3C" size={isMobile ? 16 : 20} />
        </Box>
    );
};

export default HouseIcon;