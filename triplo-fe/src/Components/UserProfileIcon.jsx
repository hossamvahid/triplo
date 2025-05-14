import { UserCog } from 'lucide-react';
import { Box, useMediaQuery, useTheme } from '@mui/material';

const UserProfileIcon = ({ onClick }) => {
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
            <UserCog color={theme.palette.text.primary} size={isMobile ? 16 : 20} />
        </Box>
    );
};

export default UserProfileIcon;
