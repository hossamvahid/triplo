using src.Application.Implementation;
using src.Presentation.ResponseModel;

namespace src.Application.Interfaces.Services
{
    public interface IUserService
    {
        public Task<(ServiceResult,int,string?, string?)> GetUser(string email);
        public Task<ServiceResult> ResetPassword(string email,string newPassword);

        public Task<(ServiceResult,List<UserReservation>?,int)> GetAccomodations(string email,int page,int size);
    }
}
