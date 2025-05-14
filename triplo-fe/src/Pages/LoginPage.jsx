import { Box, Container, Typography, TextField, Button, CircularProgress } from '@mui/material';
import { useState } from 'react';
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { useTheme } from '@mui/material/styles';

function LoginPage() {
    const theme = useTheme();
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const navigate = useNavigate();

    const isFormValid = () =>
        email.trim() !== "" &&
        password.length >= 3 &&
        password.length <= 12;

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError(null);

        try {
            const response = await axios.post(`${import.meta.env.VITE_API_URL}/api/v1/auth/login`, { email, password });
            const token = response.data.token;
            localStorage.setItem("authToken", token);
            navigate("/");
        } catch (err) {
            setError("Invalid Email or Password");
            console.error("Login failed: ", err);
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
                    backgroundColor: theme.palette.mode === 'dark' ? '#1e1e1e' : theme.palette.background.paper,
                }}
            >
                <Typography variant="h5" align="center" gutterBottom sx={{ color: theme.palette.text.primary }}>
                    Sign In
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

                    <Button
                        type="submit"
                        variant="contained"
                        fullWidth
                        disabled={!isFormValid() || loading}
                        sx={{
                            marginTop: 2,
                            backgroundColor: theme.palette.text.primary,
                            color: theme.palette.background.paper,
                            '&:hover': {
                                backgroundColor: theme.palette.text.secondary,
                            },
                        }}
                    >
                        {loading ? (
                            <CircularProgress size={25} sx={{ color: theme.palette.background.paper }} />
                        ) : (
                            "Submit"
                        )}
                    </Button>
                </form>
            </Box>
        </Container>
    );
}

export default LoginPage;
