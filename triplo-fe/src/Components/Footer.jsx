import { Box } from '@mui/material';

const Footer = () => (
    <Box
        component="footer"
        sx={{
            textAlign: 'center',
            py: 2,
            mt: 6,
            borderTop: '1px solid #ccc',
            color: '#888',
            fontSize: '0.875rem',
        }}
    >
        Triplo © {new Date().getFullYear()}
    </Box>
);

export default Footer;
