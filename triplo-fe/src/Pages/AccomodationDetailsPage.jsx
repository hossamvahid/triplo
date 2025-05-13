import { Box, Typography, TextField, Button } from '@mui/material';
import { useParams } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { MapPinHouse } from 'lucide-react';
import axios from 'axios';

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

    if (!cazare) return <Typography textAlign="center" mt={8}>Se încarcă...</Typography>;

    return (
        <Box sx={{ padding: 4, maxWidth: '1000px', margin: 'auto', mt: 10 }}>
            <Box
                sx={{
                    display: 'flex',
                    flexDirection: { xs: 'column', md: 'row' },
                    gap: 4,
                }}
            >
                {/* Imaginea */}
                <Box
                    sx={{
                        flex: 1,
                        height: { xs: 'auto', md: '400px' },
                        borderRadius: 3,
                        overflow: 'hidden',
                    }}
                >
                    <img
                        src={cazare.photoBase64}
                        alt={cazare.name}
                        style={{
                            width: '100%',
                            height: '100%',
                            objectFit: 'cover',
                            borderRadius: '12px',
                        }}
                    />
                </Box>

                {/* Detalii în dreapta */}
                <Box
                    sx={{
                        flex: 1,
                        backgroundColor: '#FAF9F6',
                        padding: 3,
                        borderRadius: '20px',
                        boxShadow: 2,
                        display: 'flex',
                        flexDirection: 'column',
                        justifyContent: 'space-between',
                        height: { md: '400px', xs: 'auto' }, // elimină height fix pe mobil
                    }}
                >
                    <Box>
                        <Typography variant="h5" fontWeight={600} gutterBottom>
                            {cazare.name}
                        </Typography>


                        <Typography variant="body1" gutterBottom sx={{ mt: 2 }}>
                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                                <MapPinHouse size={20} />
                                <span>{cazare.address}, {cityNames[cazare.city]}</span>
                            </Box>
                        </Typography>

                        <Typography variant="body2" sx={{ mt: 2 }}>
                            <strong>Description: </strong> {cazare.description}
                        </Typography>

                        <Box
                            sx={{
                                display: 'flex',
                                flexDirection: { xs: 'column', sm: 'row' }, // xs: column pentru mobil, row de la sm+
                                gap: 2,
                                mt: 3
                            }}
                        >
                            <Box sx={{ flex: 1 }}>
                                <Typography variant="subtitle2" gutterBottom>Check-in</Typography>
                                <TextField
                                    type="date"
                                    variant="outlined"
                                    size="small"
                                    fullWidth
                                    InputLabelProps={{ shrink: true }}
                                />
                            </Box>
                            <Box sx={{ flex: 1 }}>
                                <Typography variant="subtitle2" gutterBottom>Check-out</Typography>
                                <TextField
                                    type="date"
                                    variant="outlined"
                                    size="small"
                                    fullWidth
                                    InputLabelProps={{ shrink: true }}
                                />
                            </Box>
                        </Box>

                        <Button
                            variant="contained"
                            fullWidth
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
                            Reserve
                        </Button>
                    </Box>
                </Box>
            </Box>
        </Box>
    );
}

export default AccomodationDetailsPage;
