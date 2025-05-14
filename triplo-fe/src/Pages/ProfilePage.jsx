import {
  Box, Typography, useMediaQuery, TextField, Button, CircularProgress
} from '@mui/material';
import { useState, useEffect } from 'react';
import axios from "axios";
import { useAuth } from "../hooks/useAuth";
import { Mail, Phone, RotateCcwKey } from 'lucide-react';
import { useTheme } from '@mui/material/styles';
import { grey } from '@mui/material/colors';

function ProfilePage() {
  const isMobile = useMediaQuery('(max-width:768px)');
  const theme = useTheme();
  const { getToken } = useAuth();
  const token = getToken();

  const [name, setName] = useState();
  const [email, setEmail] = useState();
  const [phone, setPhone] = useState();
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [reservations, setReservations] = useState([]);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  const cityNames = {
    0: "Toate orașele",
    1: "București",
    2: "Iași",
    3: "Cluj",
    4: "Brașov",
    5: "Timișoara",
    6: "Craiova"
  };

  const size = isMobile ? 1 : 2;

  useEffect(() => {
    axios.get(`${import.meta.env.VITE_API_URL}/api/v1/user/detail`, {
      headers: { Authorization: `Bearer ${token}` }
    }).then(res => {
      setName(res.data.name);
      setEmail(res.data.email);
      setPhone(res.data.phone);
    }).catch(err => console.error(err));
  }, [token]);

  useEffect(() => {
    axios.get(`${import.meta.env.VITE_API_URL}/api/v1/user/reservations?page=${page}&size=${size}`, {
      headers: { Authorization: `Bearer ${token}` }
    }).then(res => {
      setReservations(res.data.accomodations);
      setTotalPages(res.data.total);
    }).catch(err => console.error(err));
  }, [page, isMobile, token]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    if (newPassword !== confirmPassword) {
      setError("Passwords do not match");
      setLoading(false);
      return;
    }

    try {
      await axios.put(`${import.meta.env.VITE_API_URL}/api/v1/user/update`, { newPassword }, {
        headers: { Authorization: `Bearer ${token}` }
      });
      window.location.reload();
    } catch (err) {
      setError("Password reset failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box sx={{ display: 'flex', flexDirection: { xs: 'column', md: 'row' }, gap: 6, padding: 4, mt: 8 }}>
      {/* USER INFO */}
      <Box sx={{ flex: 2, display: 'flex', flexDirection: 'column', gap: 3 }}>
        <Typography variant="h4" sx={{ color: theme.palette.text.primary }}>
          Welcome, {name}
        </Typography>

        <Box sx={{
          display: 'flex', alignItems: 'center', gap: 2,
          border: `1px solid ${theme.palette.divider}`,
          py: 1, px: 2, borderRadius: 2,
          backgroundColor: theme.palette.background.paper,
          color: theme.palette.text.primary,
          maxWidth: 300
        }}>
          <Mail size={20} />
          <Typography variant="body1">{email}</Typography>
        </Box>

        <Box sx={{
          display: 'flex', alignItems: 'center', gap: 2,
          border: `1px solid ${theme.palette.divider}`,
          py: 1, px: 2, borderRadius: 2,
          backgroundColor: theme.palette.background.paper,
          color: theme.palette.text.primary,
          maxWidth: 300
        }}>
          <Phone size={20} />
          <Typography variant="body1">{phone}</Typography>
        </Box>

        {/* RESET PASSWORD */}
        <Box sx={{
          border: `1px solid ${theme.palette.divider}`,
          py: 3, px: 3, borderRadius: 2,
          backgroundColor: theme.palette.background.paper,
          maxWidth: 300
        }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 2 }}>
            <RotateCcwKey size={20} />
            <Typography variant="h6" sx={{ fontWeight: 'bold' }}>Reset Password</Typography>
          </Box>

          {error && (
            <Typography color="error" variant="body2" sx={{ mb: 1, textAlign: 'center' }}>
              {error}
            </Typography>
          )}

          <form onSubmit={handleSubmit}>
            <TextField
              label="New Password"
              type="password"
              fullWidth
              margin="normal"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              error={newPassword.length > 0 && (newPassword.length < 3 || newPassword.length > 12)}
              helperText={
                newPassword.length > 0 && (newPassword.length < 3 || newPassword.length > 12)
                  ? 'Password must be 3-12 characters'
                  : ''
              }
            />
            <TextField
              label="Confirm Password"
              type="password"
              fullWidth
              margin="normal"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              error={confirmPassword.length > 0 && confirmPassword !== newPassword}
              helperText={
                confirmPassword.length > 0 && confirmPassword !== newPassword
                  ? 'Passwords do not match'
                  : ''
              }
            />
            <Button
              type="submit"
              variant="contained"
              fullWidth
              disabled={
                !newPassword ||
                !confirmPassword ||
                newPassword.length < 3 ||
                newPassword.length > 12 ||
                confirmPassword !== newPassword ||
                loading
              }
              sx={{
                mt: 2,
                backgroundColor: theme.palette.mode === 'dark' ? grey[100] : grey[900],
                color: theme.palette.mode === 'dark' ? grey[900] : '#fff',
                '&:hover': {
                  backgroundColor: theme.palette.mode === 'dark' ? grey[300] : grey[800],
                }
              }}
            >
              {loading ? <CircularProgress size={25} sx={{ color: theme.palette.mode === 'dark' ? grey[900] : '#fff' }} /> : "Submit"}
            </Button>
          </form>
        </Box>
      </Box>

      {/* RESERVATIONS */}
      <Box sx={{ flex: 3, py: 2, px: 1 }}>
        <Box
          sx={{
            display: isMobile ? 'flex' : 'grid',
            flexDirection: isMobile ? 'column' : undefined,
            justifyContent: 'center',
            alignItems: isMobile ? 'center' : undefined,
            gridTemplateColumns: isMobile ? undefined : '1fr 1fr',
            gap: 2,
          }}
        >
          {reservations.map((rez, idx) => (
            <Box
              key={idx}
              sx={{
                borderRadius: 2,
                backgroundColor: theme.palette.background.paper,
                boxShadow: 2,
                padding: 2,
                display: 'flex',
                flexDirection: 'column',
                width: isMobile ? 260 : '100%',
                height: isMobile ? 300 : 'auto',
              }}
            >
              <img
                src={rez.photoBase64}
                alt={rez.accomodationName}
                style={{
                  width: '100%',
                  height: isMobile ? 160 : 180,
                  objectFit: 'cover',
                  borderRadius: 8,
                  marginBottom: 8,
                }}
              />
              <Typography variant="subtitle1" fontWeight={600}>
                {rez.accomodationName}, {cityNames[rez.city]}
              </Typography>
              <Typography variant="body2" color="text.secondary">{rez.address}</Typography>
              <Typography variant="body2" color="text.secondary">{rez.startDate} → {rez.endDate}</Typography>
            </Box>
          ))}
        </Box>

        {/* PAGINATION */}
        <Box sx={{
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          gap: 2,
          mt: 3,
        }}>
          <Button
            variant="contained"
            disabled={page === 1}
            onClick={() => setPage((prev) => prev - 1)}
            sx={{
              backgroundColor: theme.palette.mode === 'dark' ? grey[100] : grey[900],
              color: theme.palette.mode === 'dark' ? grey[900] : '#fff',
              '&:hover': {
                backgroundColor: theme.palette.mode === 'dark' ? grey[300] : grey[800],
              }
            }}
          >
            Previous
          </Button>
          <Typography variant="body2" fontWeight={500}>
            {page} / {totalPages}
          </Typography>
          <Button
            variant="contained"
            disabled={page === totalPages}
            onClick={() => setPage((prev) => prev + 1)}
            sx={{
              backgroundColor: theme.palette.mode === 'dark' ? grey[100] : grey[900],
              color: theme.palette.mode === 'dark' ? grey[900] : '#fff',
              '&:hover': {
                backgroundColor: theme.palette.mode === 'dark' ? grey[300] : grey[800],
              }
            }}
          >
            Next
          </Button>
        </Box>
      </Box>
    </Box>
  );
}

export default ProfilePage;
    