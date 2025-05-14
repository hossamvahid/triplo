import { Box, Typography, Container, Button } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { useTheme } from '@mui/material/styles';
import { useAuth } from '../hooks/useAuth';
import { motion } from 'framer-motion';

function HomePage() {
  const navigate = useNavigate();
  const theme = useTheme();
  const { getToken } = useAuth();
  const token = getToken();

  const handleClick = () => {
    if (token) {
      navigate('/accomodations');
    } else {
      navigate('/login');
    }
  };

  return (
    <Box className="flex-grow mt-16">
      <Container maxWidth="md" sx={{ textAlign: 'center', py: 10 }}>
        
        {/* Title */}
        <motion.div
          initial={{ opacity: 0, y: -30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <Typography variant="h2" sx={{ fontWeight: 'bold', mb: 2, color: theme.palette.text.primary }}>
            Welcome to Triplo
          </Typography>
        </motion.div>

        {/* Subheadline */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
        >
          <Typography variant="h6" sx={{ mb: 2, color: theme.palette.text.secondary }}>
            Discover, book, and enjoy your stay in top Romanian cities.
          </Typography>
        </motion.div>

        {/* Expanded Text */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1, delay: 0.4 }}
        >
          <Typography variant="body1" sx={{ mb: 2, color: theme.palette.text.secondary }}>
            Triplo was built to simplify travel and help you feel at home wherever you go. Whether you're planning a short weekend getaway or a longer business trip,
            our platform makes it easy to explore accommodations tailored to your needs.
          </Typography>

          <Typography variant="body1" sx={{ mb: 2, color: theme.palette.text.secondary }}>
            We currently operate in cities like <strong>București</strong>, <strong>Cluj</strong>, <strong>Iași</strong>, <strong>Brașov</strong>, and more.
            Each listing provides full details, images, and easy reservation steps.
          </Typography>

          <Typography variant="body1" sx={{ mb: 4, color: theme.palette.text.secondary }}>
            With just a few clicks, you can reserve a room, manage your bookings, and travel with peace of mind. Our secure system ensures your data is protected
            and your stay is guaranteed.
          </Typography>
        </motion.div>

        {/* CTA Button */}
        <motion.div
          initial={{ scale: 0.95, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 0.6, delay: 0.6 }}
        >
          <Button
            variant="contained"
            size="large"
            onClick={handleClick}
            whileHover={{ scale: 1.05 }}
            component={motion.button}
            sx={{
              backgroundColor: theme.palette.mode === 'dark' ? '#fff' : '#2B2B2B',
              color: theme.palette.mode === 'dark' ? '#2B2B2B' : '#fff',
              '&:hover': {
                backgroundColor: theme.palette.mode === 'dark' ? '#f0f0f0' : '#1a1a1a'
              },
              borderRadius: 2,
              px: 4,
              py: 1.5,
              boxShadow: 3
            }}
          >
            {token ? 'Browse Accommodations' : 'Log in to Explore'}
          </Button>
        </motion.div>
      </Container>
    </Box>
  );
}

export default HomePage;
