using src.Application.Implementation;

namespace src.Application.Interfaces.Services
{
    public interface IUserService
    {
        public Task<(ServiceResult,int,string?, string?)> GetUser(string email);
        public Task<ServiceResult> ResetPassword(string email,string newPassword);
    }
}
