using log4net;
using src.Application.Interfaces.Repositories;
using src.Application.Interfaces.Services;
using src.Application.Utils;

namespace src.Application.Implementation.Services
{
    public class UserService : IUserService
    {
        private readonly IDapi _dapi;
        private readonly ILog _log;
        public UserService(IDapi dapi, ILog log)
        {
            _dapi = dapi;
            _log = log;
        }

        public async Task<(ServiceResult,int,string?,string?)> GetUser(string email)
        {
            _log.Info($"Getting the details about user with email {email}");
            var user = await _dapi.Users.GetByEmailAsync(email);    

            if (user == null)
            {
                return new(ServiceResult.EMAIL_NOT_FOUND, 0 ,null, null);
            }

            return new(ServiceResult.OK, user.Id ,user.Name, user.PhoneNumber);
        }

        public async Task<ServiceResult> ResetPassword(string email,string newPassword)
        {
            _log.Info($"Starting to reset the password for user with Email: {email}");
            var user = await _dapi.Users.GetByEmailAsync(email);


            if(user is null)
            {
                return ServiceResult.EMAIL_NOT_FOUND;
            }

            _log.Info($"Begging the transaction with the user with email: {user.Email}");

            user.Password= PasswordHelper.EncryptPassword(newPassword);

            await _dapi.BeginTransactionAsync();
            try
            {
                _dapi.Users.Update(user);
                await _dapi.CompleteAsync();
                await _dapi.CommitTransactionAsync();
            }
            catch (Exception ex)
            {
                await _dapi.RollbackTransactionAsync();
                throw;
            }

            return ServiceResult.OK;
        }
    }
}
