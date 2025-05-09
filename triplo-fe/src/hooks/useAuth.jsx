export const useAuth=()=>{
    
    const getToken = () => {
        return localStorage.getItem("authToken");
    };

    return {getToken};
}