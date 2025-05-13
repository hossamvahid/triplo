import { Box, Typography, useMediaQuery, TextField, Button, CircularProgress } from '@mui/material';
import { useState, useEffect } from 'react';
import axios from "axios";
import { useAuth } from "../hooks/useAuth";
import { Mail, Phone, RotateCcwKey } from 'lucide-react';

function ProfilePage() {
    const isMobile = useMediaQuery('(max-width:768px)');
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

    const fetchUser = async () => {
        try {
            const response = await axios.get(`${import.meta.env.VITE_API_URL}/api/v1/user/detail`, {
                headers: { Authorization: `Bearer ${token}` }
            });
            setName(response.data.name);
            setEmail(response.data.email);
            setPhone(response.data.phone);
        } catch (error) {
            console.error("Error fetching user details:", error);
        }
    };

    const fetchReservations = async () => {
        try {
            const response = await axios.get(`${import.meta.env.VITE_API_URL}/api/v1/user/reservations?page=${page}&size=${size}`, {
                headers: { Authorization: `Bearer ${token}` }
            });
            setReservations(response.data.accomodations);
            setTotalPages(response.data.total);
        } catch (error) {
            console.error("Error loading reservations:", error);
        }
    };

    useEffect(() => {
        fetchUser();
    }, [token]);

    useEffect(() => {
        fetchReservations();
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
            console.error("Reset failed: ", err);
        } finally {
            setLoading(false);
        }
    };

    return (
        <Box sx={{ display: 'flex', flexDirection: { xs: 'column', md: 'row' }, gap: 6, padding: 4, mt: 8 }}>
            {/* USER DETAILS */}
            <Box className="col-span-2 flex flex-col gap-6">
                <Typography variant="h4" className="text-4xl font-bold text-[#2B2B2B] leading-tight">Welcome, {name}</Typography>

                <Box className="flex items-center gap-3 border py-1 px-3 rounded-md bg-[#F5F5F5] text-[#2B2B2B] text-sm max-w-xs">
                    <Mail size={20} className="text-[#2B2B2B]" />
                    <Typography variant="h6" className="truncate text-[#2B2B2B]">{email}</Typography>
                </Box>

                <Box className="flex items-center gap-3 border py-1 px-3 rounded-md bg-[#F5F5F5] text-[#2B2B2B] text-sm max-w-xs">
                    <Phone size={20} className="text-[#2B2B2B]" />
                    <Typography variant="h6" className="truncate text-[#2B2B2B]">{phone}</Typography>
                </Box>

                <Box className="border py-4 px-6 rounded-md bg-[#F5F5F5] text-[#2B2B2B] text-sm max-w-xs">
                    <Box className="flex items-center gap-3">
                        <RotateCcwKey size={20} className="text-[#2B2B2B]" />
                        <Typography variant="h6" className="font-semibold mb-4">Reset Password</Typography>
                    </Box>

                    {error && (
                        <Box sx={{ width: '100%', display: 'flex', justifyContent: 'center', marginBottom: 2 }}>
                            <Typography variant="body2" color="#2B2B2B">{error}</Typography>
                        </Box>
                    )}

                    <form onSubmit={handleSubmit}>
                        <TextField label="New Password" variant="outlined" type="password" fullWidth margin="normal" value={newPassword} onChange={(e) => setNewPassword(e.target.value)} />
                        <TextField label="Confirm Password" variant="outlined" type="password" fullWidth margin="normal" value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} />
                        <Button type="submit" variant="contained" fullWidth sx={{ marginTop: 2, backgroundColor: '#3C3C3C', color: '#FFFFFF', '&:hover': { backgroundColor: '#2B2B2B' } }}>
                            {loading ? <CircularProgress size={25} color="#F5F5F5" /> : "Submit"}
                        </Button>
                    </form>
                </Box>
            </Box>

            {/* RESERVATIONS */}
            <Box sx={{ flex: 1, py: 4, px: 6, color: '#2B2B2B' }}>
                <Box
                    sx={{
                        display: isMobile ? 'flex' : 'grid',
                        flexDirection: isMobile ? 'column' : undefined,
                        justifyContent: isMobile ? 'center' : undefined,
                        alignItems: isMobile ? 'center' : undefined,
                        gridTemplateColumns: isMobile ? undefined : '1fr 1fr',
                        gap: 2,
                    }}
                >
                    {reservations.map((rez, idx) => (
                        <Box
                            key={idx}
                            sx={{
                                borderRadius: 3,
                                backgroundColor: '#fff',
                                boxShadow: 3,
                                padding: 2,
                                display: 'flex',
                                flexDirection: 'column',
                                alignItems: 'start',
                                textAlign: 'left',
                                width: isMobile ? 260 : '100%',
                                height: isMobile ? 300 : 'auto',
                            }}
                        >
                            <img
                                src={rez.photoBase64}
                                alt={rez.accomodationName}
                                style={{
                                    width: '100%',
                                    height: isMobile ? 160 : '180px',
                                    objectFit: 'cover',
                                    borderRadius: '12px',
                                    marginBottom: '8px',
                                }}
                            />
                            <Typography variant="subtitle1" fontWeight={600}>{rez.accomodationName}, {cityNames[rez.city]} </Typography>
                            <Typography variant="body2" color="text.secondary">{rez.address}</Typography>
                            <Typography variant="body2" color="text.secondary">{rez.startDate} → {rez.endDate}</Typography>
                        </Box>
                    ))}
                </Box>

                {/* PAGINATION */}
                <Box
                    sx={{
                        gridColumn: isMobile ? undefined : '1 / -1',
                        display: 'flex',
                        justifyContent: 'center',
                        alignItems: 'center',
                        flexWrap: 'nowrap',
                        gap: 1,
                        mt: 2
                    }}
                >
                    <Button
                        variant="contained"
                        disabled={page === 1}
                        onClick={() => setPage((prev) => prev - 1)}
                        sx={{
                            backgroundColor: '#3C3C3C',
                            color: '#FFFFFF',
                            '&:hover': { backgroundColor: '#2B2B2B' },
                            minWidth: 90,
                            flexShrink: 0
                        }}
                    >
                        PREVIOUS
                    </Button>

                    <Typography
                        variant="body2"
                        sx={{
                            minWidth: 50,
                            textAlign: 'center',
                            fontWeight: 500,
                            flexShrink: 0
                        }}
                    >
                        {page} / {totalPages}
                    </Typography>

                    <Button
                        variant="contained"
                        disabled={page === totalPages}
                        onClick={() => setPage((prev) => prev + 1)}
                        sx={{
                            backgroundColor: '#3C3C3C',
                            color: '#FFFFFF',
                            '&:hover': { backgroundColor: '#2B2B2B' },
                            minWidth: 90,
                            flexShrink: 0
                        }}
                    >
                        NEXT
                    </Button>
                </Box>
            </Box>
        </Box>
    );
}

export default ProfilePage;
