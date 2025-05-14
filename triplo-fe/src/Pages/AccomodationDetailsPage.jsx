import { Box, Typography, TextField, Button, CircularProgress, useTheme } from '@mui/material';
import { useParams } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { MapPinHouse } from 'lucide-react';
import axios from 'axios';
import { useAuth } from '../hooks/useAuth';

const cityNames = {
    0: "Toate orașele",
    1: "București",
    2: "Iași",
    3: "Cluj",
    4: "Brașov",
    5: "Timișoara",
    6: "Craiova"
};

function AccomodationDetailsPage() {
    const { id } = useParams();
    const [cazare, setCazare] = useState(null);
    const [checkIn, setCheckIn] = useState("");
    const [checkOut, setCheckOut] = useState("");
    const today = new Date().toISOString().split("T")[0];
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const { getToken } = useAuth();
    const token = getToken();
    const theme = useTheme();

    useEffect(() => {
        const fetchDetails = async () => {
            try {
                const response = await axios.get(`${import.meta.env.VITE_API_URL}/api/v1/accomodation/details?id=${id}`);
                setCazare(response.data.accomodation);
            } catch (err) {
                console.error('Eroare la fetch detalii:', err);
            }
        };

        fetchDetails();
    }, [id]);

    const handleReserve = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError(null);

        try {
            await axios.post(`${import.meta.env.VITE_API_URL}/api/v1/accomodation/reservate`,
                { accomodationId: id, startDate: checkIn, endDate: checkOut },
                { headers: { Authorization: `Bearer ${token}` } });
        } catch (err) {
            setError("These dates have already been booked.");
            console.error("Create reservation failed: ", err);
        } finally {
            setLoading(false);
        }
    };

    if (!cazare) return <Typography textAlign="center" mt={8}>Se încarcă...</Typography>;

    return (
        <Box sx={{ padding: 4, maxWidth: '1000px', margin: 'auto', mt: 10 }}>
            <Box sx={{ display: 'flex', flexDirection: { xs: 'column', md: 'row' }, gap: 4 }}>
                <Box sx={{ flex: 1, height: { xs: 'auto', md: '400px' }, borderRadius: 3, overflow: 'hidden' }}>
                    <img
                        src={cazare.photoBase64}
                        alt={cazare.name}
                        style={{ width: '100%', height: '100%', objectFit: 'cover', borderRadius: '12px' }}
                    />
                </Box>

                <Box
                    sx={{
                        flex: 1,
                        backgroundColor: theme.palette.background.paper,
                        color: theme.palette.text.primary,
                        padding: 3,
                        borderRadius: '20px',
                        boxShadow: 2,
                        display: 'flex',
                        flexDirection: 'column',
                        justifyContent: 'space-between',
                        height: { md: '400px', xs: 'auto' }
                    }}
                >
                    <Typography variant="h5" fontWeight={600} gutterBottom>
                        {cazare.name}
                    </Typography>

                    <Typography variant="body1" component="div" gutterBottom sx={{ mt: 2 }}>
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                            <MapPinHouse size={20} />
                            <span>{cazare.address}, {cityNames[cazare.city]}</span>
                        </Box>
                    </Typography>

                    <Typography variant="body2" sx={{ mt: 2 }}>
                        <strong>Description: </strong> {cazare.description}
                    </Typography>

                    <Box sx={{ display: 'flex', flexDirection: { xs: 'column', sm: 'row' }, gap: 2, mt: 3 }}>
                        <Box sx={{ flex: 1 }}>
                            <Typography variant="subtitle2" gutterBottom>Check-in</Typography>
                            <TextField
                                type="date"
                                variant="outlined"
                                size="small"
                                fullWidth
                                value={checkIn}
                                onChange={(e) => setCheckIn(e.target.value)}
                                inputProps={{ min: today }}
                            />
                        </Box>
                        <Box sx={{ flex: 1 }}>
                            <Typography variant="subtitle2" gutterBottom>Check-out</Typography>
                            <TextField
                                type="date"
                                variant="outlined"
                                size="small"
                                fullWidth
                                value={checkOut}
                                onChange={(e) => setCheckOut(e.target.value)}
                                inputProps={{ min: checkIn || today }}
                            />
                        </Box>
                    </Box>

                    <Button
                        variant="contained"
                        fullWidth
                        onClick={handleReserve}
                        sx={{
                            mt: 3,
                            backgroundColor: '#3C3C3C',
                            color: 'white',
                            '&:hover': {
                                backgroundColor: '#2B2B2B',
                            },
                            borderRadius: '8px',
                            paddingY: 1.2,
                            fontWeight: 600,
                            textTransform: 'none',
                        }}
                    >
                        {loading ? <CircularProgress size={25} color="inherit" /> : "Reserve"}
                    </Button>

                    {error && (
                        <Box sx={{ width: '100%', display: 'flex', justifyContent: 'center', marginTop: 2 }}>
                            <Typography variant="body2" color="error">{error}</Typography>
                        </Box>
                    )}
                </Box>
            </Box>
        </Box>
    );
}

export default AccomodationDetailsPage;
