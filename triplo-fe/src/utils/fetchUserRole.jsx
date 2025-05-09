import axios from "axios";

export const fetchUserRole = async (token) =>
{
    try{
        const response = await axios.get(
            `${import.meta.env.VITE_API_URL}/api/v1/auth/role`,
            {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            }
        );
        
        return response.data.role;
    }
    catch(error)
    {
        console.error("Error fetching role: ",error);
        return null;
    }
};