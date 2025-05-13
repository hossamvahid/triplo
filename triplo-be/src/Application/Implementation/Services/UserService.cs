using log4net;
using src.Application.Interfaces.Repositories;
using src.Application.Interfaces.Services;
using src.Application.Utils;
using src.Presentation.ResponseModel;

namespace src.Application.Implementation.Services
{
    public class UserService : IUserService
    {
        private readonly IDapi _dapi;
        private readonly ILog _log;
        private readonly IMinioRepository _minio;
        public UserService(IDapi dapi, ILog log, IMinioRepository minio)
        {
            _dapi = dapi;
            _log = log;
            _minio = minio;
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

        public async Task<(ServiceResult,List<UserReservation>?,int)> GetAccomodations(string email,int page ,int size)
        {
            _log.Info($"Getting the reservations for the user with email: {email}");
            var user = await _dapi.Users.GetByEmailAsync(email);

            var reservations= await _dapi.Reservations.GetUserReservationPaginated(user.Id,page,size);

            if(reservations.Item1 is null)
            {
                _log.Info($"No reservation was found for the user with email: {email}");
                return new(ServiceResult.NO_RESERVATION, null,0);
            }
            var total = reservations.Item2;
            var paginatedList = new List<UserReservation>();
            foreach (var reservation in reservations.Item1)
            {
                byte[] blob = await _minio.GetFileAsync(reservation.Accommodation.PhotoFileName);
                string base64 = $"data:image/jpeg;base64,{Convert.ToBase64String(blob)}";

                var paginated = new UserReservation
                {
                    AccomodationName = reservation.Accommodation.Name,
                    Address = reservation.Accommodation.Address,
                    PhotoBase64 = base64,
                    City = reservation.Accommodation.City,
                    StartDate = reservation.StartDate,
                    EndDate = reservation.EndDate,
                };

                paginatedList.Add(paginated);

            }

            return new(ServiceResult.OK, paginatedList, total);


        }
    }
}
