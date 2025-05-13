import { Box, Typography, useMediaQuery, TextField, Button, CircularProgress } from '@mui/material';
import ProfileMenu from '../Components/ProfileMenu';
import ProfileMenuMobile from '../Components/ProfileMenuMobile';
import { useState, useEffect } from 'react';
import axios from "axios";
import { useAuth } from "../hooks/useAuth";
import { Mail } from 'lucide-react';
import { Phone } from 'lucide-react';
import { RotateCcwKey } from 'lucide-react';

function ProfilePage() {
    const isMobile = useMediaQuery('(max-width:768px)');
    const { getToken } = useAuth();
    const token = getToken();
    const [id, setId] = useState();
    const [name, setName] = useState();
    const [email, setEmail] = useState();
    const [phone, setPhone] = useState();
    const [newPassword, setNewPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    useEffect(() => {

        const fetchUser = async () => {
            try {
                const response = await axios.get(`${import.meta.env.VITE_API_URL}/api/v1/user/detail`, { headers: { Authorization: `Bearer ${token}` } });

                setId(response.data.id);
                setName(response.data.name);
                setEmail(response.data.email);
                setPhone(response.data.phone);
            }
            catch (error) {
                console.error("Error at fetching the user details: " + error);
            }
        };

        fetchUser();


    }, [token]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError(null);

        if (newPassword !== confirmPassword) {
            setError("Invalid Passwords");
            setLoading(false);
            return;
        }

        try {
            const response = await axios.put(`${import.meta.env.VITE_API_URL}/api/v1/user/update`, {newPassword} ,{ headers: { Authorization: `Bearer ${token}`}});
            window.location.reload();
        }
        catch (err) {
            setError("Invalid Passwords");
            console.error("Reset failed: ", err);
        }
        finally {
            setLoading(false);
        }

    }

    return (
        <>
            {!isMobile && (
                <Box className="flex min-h-screen">
                    <Box className="flex-1 p-4 mt-16 md:ml-8 flex flex-col gap-6">
                        <Typography variant="h4" className="text-4xl font-bold text-[#2B2B2B] leading-tight"> Welcome, {name}</Typography>

                        <Box className="flex items-center gap-3 border py-1 px-3 rounded-md bg-[#F5F5F5] text-[#2B2B2B] text-sm max-w-xs">
                            <Mail size={20} className="text-[#2B2B2B]" />
                            <Typography variant="h6" className="truncate text-[#2B2B2B]">{email}</Typography>
                        </Box>

                        <Box className="flex items-center gap-3 border py-1 px-3 rounded-md bg-[#F5F5F5] text-[#2B2B2B] text-sm max-w-xs">
                            <Phone size={20} className="text-[#2B2B2B]" />
                            <Typography variant="h6" className="truncate text-[#2B2B2B]">{phone}</Typography>
                        </Box>

                        <Box className="border py-4 px-6 rounded-md bg-[#F5F5F5] text-[#2B2B2B] text-sm max-w-xs">

                            <Box className="flex items-center gap-3 bg-[#F5F5F5] text-[#2B2B2B] text-sm max-w-xs">
                                <RotateCcwKey size={20} className="text-[#2B2B2B]" />
                                <Typography variant="h6" className="font-semibold mb-4">Reset Password</Typography>
                            </Box>

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
                                    label="New Password"
                                    variant="outlined"
                                    type="password"
                                    fullWidth
                                    margin="normal"
                                    value={newPassword}
                                    onChange={(e) => setNewPassword(e.target.value)}
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
                                    label="Confirm Password"
                                    variant="outlined"
                                    type="password"
                                    fullWidth
                                    margin="normal"
                                    value={confirmPassword}
                                    onChange={(e) => setConfirmPassword(e.target.value)}
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


                    </Box>
                </Box>
            )}"

            {isMobile && (
                <Box className="flex min-h-screen">

                    <Box className="flex-1 p-4 mt-16">
                        <Box className="flex flex-row items-center">
                            <Typography variant='h1'> Hello {name}</Typography>
                        </Box>
                        <p>Adăugați aici conținutul profilului utilizatorului.</p>
                    </Box>
                </Box>
            )}
        </>

    );
}

export default ProfilePage;
