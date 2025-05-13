import { Box, Button, TextField, Select, MenuItem, FormControl } from '@mui/material';
import { useEffect, useState } from "react";
import { useAuth } from '../hooks/useAuth';
import { Search } from 'lucide-react';
import { useMediaQuery } from '@mui/material';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

function AccomodationsPage() {
    const [cityFilter, setCityFilter] = useState(0);
    const [startDate, setStartDate] = useState("");
    const [endDate, setEndDate] = useState("");
    const [cazari, setCazari] = useState([]);
    const [page, setPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const { getToken } = useAuth();
    const token = getToken();
    const isMobile = useMediaQuery('(max-width:600px)');
    const navigate = useNavigate();


    const cityNames = {
        0: "Toate orașele",
        1: "București",
        2: "Iași",
        3: "Cluj",
        4: "Brașov",
        5: "Timișoara",
        6: "Craiova"
    };

    useEffect(() => {
        fetchCazari();
    }, [page]);

    const fetchCazari = async () => {
        const params = new URLSearchParams();
        params.append("cityFilter", cityFilter);
        params.append("page", page);
        params.append("size", 2); // 2 pe mobil, 6 pe desktop

        if (startDate) params.append("startDate", startDate);
        if (endDate) params.append("endDate", endDate);

        try {
            const response = await axios.get(`${import.meta.env.VITE_API_URL}/api/v1/accomodation/paginate?${params.toString()}`, {
                headers: { Authorization: `Bearer ${token}` }
            });
            setCazari(response.data.accomodations);
            setTotalPages(response.data.totalPages);
        } catch (err) {
            console.error("Eroare la fetch: ", err);
        }
    };

    return (
        <Box className="flex-grow mt-16">
            {/* SEARCH BAR */}
            <Box
                sx={{
                    display: 'flex',
                    flexDirection: 'row',
                    alignItems: 'center',
                    justifyContent: 'center',
                    flexWrap: 'nowrap',
                    borderRadius: '999px',
                    boxShadow: 3,
                    padding: isMobile ? '6px 10px' : '16px',
                    width: '100%',
                    maxWidth: isMobile ? '360px' : 'fit-content',
                    margin: '80px auto 24px auto',
                    gap: isMobile ? 1 : 3,
                    backgroundColor: '#FAF9F6',
                    boxSizing: 'border-box',
                    overflow: 'hidden',
                }}
            >
                <Box sx={{ display: 'flex', flexDirection: 'column', minWidth: isMobile ? '100px' : '140px' }}>
                    <strong style={{ fontSize: isMobile ? '0.85rem' : '1rem' }}>Where?</strong>
                    <FormControl variant="standard" fullWidth>
                        <Select
                            value={cityFilter}
                            onChange={(e) => setCityFilter(Number(e.target.value))}
                            disableUnderline
                            sx={{ fontSize: isMobile ? '0.85rem' : '1rem' }}
                        >
                            {Object.entries(cityNames).map(([key, name]) => (
                                <MenuItem key={key} value={key}>{name}</MenuItem>
                            ))}
                        </Select>
                    </FormControl>
                </Box>

                <Box sx={{ display: 'flex', flexDirection: 'column', minWidth: isMobile ? '100px' : '140px' }}>
                    <strong style={{ fontSize: isMobile ? '0.85rem' : '1rem' }}>Check-in</strong>
                    <TextField
                        type="date"
                        variant="standard"
                        value={startDate}
                        onChange={(e) => setStartDate(e.target.value)}
                        InputProps={{ disableUnderline: true }}
                        inputProps={{ style: { fontSize: isMobile ? '0.85rem' : '1rem' } }}
                    />
                </Box>

                <Box sx={{ display: 'flex', flexDirection: 'column', minWidth: isMobile ? '100px' : '140px' }}>
                    <strong style={{ fontSize: isMobile ? '0.85rem' : '1rem' }}>Check-out</strong>
                    <TextField
                        type="date"
                        variant="standard"
                        value={endDate}
                        onChange={(e) => setEndDate(e.target.value)}
                        InputProps={{ disableUnderline: true }}
                        inputProps={{ style: { fontSize: isMobile ? '0.85rem' : '1rem' } }}
                    />
                </Box>

                <Button
                    onClick={fetchCazari}
                    sx={{
                        minWidth: isMobile ? '40px' : '48px',
                        minHeight: isMobile ? '40px' : '48px',
                        borderRadius: '50%',
                        backgroundColor: '#3C3C3C',
                        color: 'white',
                        '&:hover': {
                            backgroundColor: '#2e2e2e',
                        },
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        padding: 0,
                    }}
                >
                    <Search size={isMobile ? 18 : 20} color="#FFFFFF" />
                </Button>
            </Box>


            {/* CAZARI GRID */}
            <Box
                className="cazari-list"
                sx={{
                    display: "grid",
                    gridTemplateColumns: isMobile ? "1fr" : "repeat(2, 1fr)", // 2 pe desktop, 1 pe mobil
                    gap: "24px",
                    padding: "24px",
                    justifyItems: "center",
                }}
            >
                {cazari.map((cazare) => (
                    <Box
                        key={cazare.id}
                        sx={{
                            width: "100%",
                            maxWidth: "500px",
                            display: "flex",
                            flexDirection: "column",
                            alignItems: "center",
                            textAlign: "center",
                            borderRadius: "16px",
                            marginBottom: "16px",
                        }}
                    >
                        <Box
                            sx={{
                                width: "100%",
                                aspectRatio: "4 / 3", // controlăm înălțimea relativ la lățime
                                borderRadius: "12px",
                                overflow: "hidden",
                                marginBottom: "8px",
                            }}
                        >
                            <img
                                src={cazare.photoBase64}
                                alt={cazare.name}
                                onClick={()=> navigate(`/accomodation/${cazare.id}`)}
                                style={{
                                    width: "100%",
                                    height: "100%",
                                    objectFit: "cover",
                                    display: "block",
                                }}
                            />
                        </Box>
                        <p style={{ fontWeight: 600, fontSize: isMobile ? "0.9rem" : "1.1rem" }}>
                            {cazare.name}, {cityNames[cazare.city]}
                        </p>
                    </Box>
                ))}

            </Box>
            <Box sx={{ display: "flex", justifyContent: "center", gap: 2, mt: 4 }}>
                <Button
                    variant="contained"
                    disabled={page === 1}
                    onClick={() => setPage((prev) => prev - 1)}
                    color="#3C3C3C"
                    sx={{ marginTop: 2, backgroundColor: '#3C3C3C', color: '#FFFFFF', '&:hover': { backgroundColor: '#2B2B2B' } }}
                >
                    Anterior
                </Button>
                <Box sx={{ display: 'flex', alignItems: 'center' }}>{page} / {totalPages}</Box>
                <Button
                    variant="contained"
                    disabled={page === totalPages}
                    onClick={() => setPage((prev) => prev + 1)}
                    color="#3C3C3C"
                    sx={{ marginTop: 2, backgroundColor: '#3C3C3C', color: '#FFFFFF', '&:hover': { backgroundColor: '#2B2B2B' } }}
                >
                    Următor
                </Button>
            </Box>

        </Box>
    );
}

export default AccomodationsPage;
