import { Box, Container, Typography, TextField, Button, CircularProgress } from '@mui/material';
import { useState } from 'react';
import { useNavigate } from "react-router-dom";
import axios from "axios";
import PhoneInput from 'react-phone-number-input';
import 'react-phone-number-input/style.css';
import { useTheme } from '@mui/material/styles';

function RegisterPage() {
  const [email, setEmail] = useState("");
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const navigate = useNavigate();
  const theme = useTheme();

  const isFormValid = () => {
    return (
      email.trim() !== "" &&
      name.trim() !== "" &&
      phone.trim() !== "" &&
      password.length >= 3 &&
      password.length <= 12
    );
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const response = await axios.post(`${import.meta.env.VITE_API_URL}/api/v1/auth/register`, {
        email,
        name,
        password,
        phone,
      });

      const token = response.data.token;
      localStorage.setItem("authToken", token);
      navigate("/");
    } catch (err) {
      setError("An error occurred during Sign Up");
      console.error("Registration failed: ", err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Container
      maxWidth="xs"
      sx={{
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        minHeight: '100vh',
      }}
    >
      <Box
        sx={{
          width: '100%',
          padding: 3,
          boxShadow: 3,
          borderRadius: 5,
          backgroundColor: theme.palette.background.paper,
        }}
      >
        <Typography variant="h5" align="center" gutterBottom sx={{ color: theme.palette.text.primary }}>
          Sign Up
        </Typography>

        {error && (
          <Box sx={{ width: '100%', display: 'flex', justifyContent: 'center', marginBottom: 2 }}>
            <Typography variant="body2" color={theme.palette.text.primary}>
              {error}
            </Typography>
          </Box>
        )}

        <form onSubmit={handleSubmit}>
          <TextField
            label="Email"
            variant="outlined"
            type="email"
            fullWidth
            margin="normal"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            sx={{
              '& .MuiOutlinedInput-root.Mui-focused fieldset': {
                borderColor: theme.palette.text.primary,
              },
              '& label': {
                color: theme.palette.text.primary,
              },
              '& label.Mui-focused': {
                color: theme.palette.text.primary,
              },
            }}
          />

          <TextField
            label="Name"
            variant="outlined"
            fullWidth
            margin="normal"
            value={name}
            onChange={(e) => setName(e.target.value)}
            sx={{
              '& .MuiOutlinedInput-root.Mui-focused fieldset': {
                borderColor: theme.palette.text.primary,
              },
              '& label': {
                color: theme.palette.text.primary,
              },
              '& label.Mui-focused': {
                color: theme.palette.text.primary,
              },
            }}
          />

          <TextField
            label="Password"
            variant="outlined"
            type="password"
            fullWidth
            margin="normal"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            helperText="Password must be 3–12 characters"
            sx={{
              '& .MuiOutlinedInput-root.Mui-focused fieldset': {
                borderColor: theme.palette.text.primary,
              },
              '& label': {
                color: theme.palette.text.primary,
              },
              '& label.Mui-focused': {
                color: theme.palette.text.primary,
              },
            }}
          />

          <Box sx={{ mt: 2, mb: 1 }}>
            <PhoneInput
              defaultCountry="RO"
              value={phone}
              onChange={setPhone}
              placeholder="Enter your phone number"
              style={{
                width: '100%',
                padding: '14px',
                borderRadius: '4px',
                border: `1px solid ${theme.palette.divider}`,
                background: theme.palette.background.default,
                color: theme.palette.text.primary,
              }}
            />
          </Box>

          <Button
            type="submit"
            variant="contained"
            fullWidth
            disabled={!isFormValid() || loading}
            sx={{
              marginTop: 2,
              backgroundColor: theme.palette.text.primary,
              color: theme.palette.background.default,
              '&:hover': {
                backgroundColor: theme.palette.text.primary,
                opacity: 0.9,
              },
            }}
          >
            {loading ? (
              <CircularProgress size={25} sx={{ color: theme.palette.background.default }} />
            ) : (
              "Submit"
            )}
          </Button>
        </form>
      </Box>
    </Container>
  );
}

export default RegisterPage;
