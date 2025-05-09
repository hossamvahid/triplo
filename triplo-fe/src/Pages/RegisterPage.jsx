import { Box, Container, Typography, TextField, Button, CircularProgress } from '@mui/material';
import { useState } from 'react';
import { useNavigate } from "react-router-dom";
import axios from "axios";
import PhoneInput from 'react-phone-number-input';
import 'react-phone-number-input/style.css';


function RegisterPage() {

    const [email, setEmail] = useState("");
    const [name, setName] = useState("");
    const [phone, setPhone] = useState("");
    const [password, setPassword] = useState("");
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError(null);

        try {
            const response = await axios.post(`${import.meta.env.VITE_API_URL}/api/v1/auth/register`, { email, name, password, phone })

            const token = response.data.token;
            localStorage.setItem("authToken", token);
            navigate("/");
        }
        catch (err) {
            setError("An error occurred during Sign Up");
            console.error("Login failed: ", err);
        }
        finally {
            setLoading(false);
        }
    }

    return (
        <>
            <Container
                maxWidth="xs"
                sx={{
                    display: 'flex',
                    justifyContent: 'center',
                    alignItems: 'center',
                    minHeight: '100vh',
                }}>


                <Box
                    sx={{
                        width: '100%',
                        padding: 3,
                        boxShadow: 3,
                        borderRadius: 5,
                        backgroundColor: '#F5F5F5'
                    }}>

                    <Typography variant="h5" align="center" gutterBottom sx={{ color: '#3C3C3C' }}>
                        Sign Up
                    </Typography>

                    {error && (
                        <Box sx={{
                            width: '100%',
                            display: 'flex',
                            justifyContent: 'center',
                            marginBottom: 2
                        }}>
                            <Typography variant="body2" color="#2B2B2B">
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
                                '& .MuiOutlinedInput-root': {
                                    '&.Mui-focused fieldset': {
                                        borderColor: '#2B2B2B',
                                    },
                                },
                                '& label': {
                                    color: '#2B2B2B',
                                },
                                '& label.Mui-focused': {
                                    color: '#2B2B2B',
                                },
                            }}
                        />

                        <TextField
                            label="Name"
                            variant="outlined"
                            type="name"
                            fullWidth
                            margin="normal"
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            sx={{
                                '& .MuiOutlinedInput-root': {
                                    '&.Mui-focused fieldset': {
                                        borderColor: '#2B2B2B',
                                    },
                                },
                                '& label': {
                                    color: '#2B2B2B',
                                },
                                '& label.Mui-focused': {
                                    color: '#2B2B2B',
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
                            sx={{
                                '& .MuiOutlinedInput-root': {
                                    '&.Mui-focused fieldset': {
                                        borderColor: '#2B2B2B',
                                    },
                                },
                                '& label': {
                                    color: '#2B2B2B',
                                },
                                '& label.Mui-focused': {
                                    color: '#2B2B2B',
                                },
                            }}
                        />

                        <Box sx={{ marginTop: 2, marginBottom: 1, marginLeft: 2 }}>
                            <PhoneInput
                                defaultCountry="RO"
                                value={phone}
                                onChange={setPhone}
                                placeholder="Enter your phone number"
                            />
                        </Box>

                        <Button
                            type="submit"
                            variant="contained"
                            fullWidth
                            color="#3C3C3C"
                            sx={{ marginTop: 2, backgroundColor: '#3C3C3C', color: '#FFFFFF', '&:hover': { backgroundColor: '#2B2B2B' } }}
                        >
                            {loading ? <CircularProgress size={25} color="#F5F5F5" /> : "Submit"}
                        </Button>

                    </form>

                </Box>


            </Container>
        </>
    )
}

export default RegisterPage;