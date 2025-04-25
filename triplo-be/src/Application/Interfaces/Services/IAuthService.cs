using Microsoft.AspNetCore.Mvc;
using src.Application.Implementation;

namespace src.Application.Interfaces.Services
{
    public interface IAuthService
    {
        Task<(ServiceResult,string?)> RegisterUser(string email,string name,string password);
        Task<(ServiceResult, string?)> LoginUser(string email, string password);
    }
}
