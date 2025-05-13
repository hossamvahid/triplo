using log4net;
using src.Application.Interfaces.Repositories;
using src.Application.Interfaces.Services;
using src.Domain.Entities;
using src.Domain.Enums;
using src.Presentation.ResponseModel;

namespace src.Application.Implementation.Services
{
    public class AccommodationService : IAccommodationService
    {
        private readonly IDapi _dapi;
        private readonly ILog _log;
        private readonly IMinioRepository _minio;

        public AccommodationService(IDapi dapi, ILog log, IMinioRepository minio)
        {
            _dapi = dapi;
            _log = log;
            _minio = minio;
        }

        public async Task<ServiceResult> CreateAccommodation(string name, string description, string address, City city, IFormFile photo)
        {
            _log.Info($"Starting to create the acoomodation with name: {name}");

            var exists = await _dapi.Accomodations.GetAccommodationByNameAsync(name);

            if (exists != null)
            {
                return ServiceResult.ACCOMODATION_EXISTS;
            }

            var minioResult = _minio.UploadFileAsync(photo);

            if (minioResult is null)
            {
                return ServiceResult.MINIO_FAILED;
            }

            var accomodation = new Accommodation
            {
                Name = name,
                Description = description,
                Address = address,
                City = city,
                PhotoFileName = photo.FileName
            };

            _dapi.BeginTransactionAsync();
            try
            {
                await _dapi.Accomodations.Add(accomodation);
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

        public async Task<(ServiceResult, List<PaginateAccomodation>?, int)> Paginate(City cityFilter, int page, int size, DateOnly? startDate, DateOnly? endDate)
        {
            _log.Info($"Getting Accomodations in paginated for page: {page}");
            if (!startDate.HasValue && !endDate.HasValue)
            {
                var result = await _dapi.Accomodations.PaginateByCity(cityFilter, page, size);
                var accomodations = result.Item1;
                var total = result.Item2;
                var paginatedList = new List<PaginateAccomodation>();
                _log.Info("Converting the Accomodation to the Paginated Class");

                foreach (var accomodation in accomodations)
                {
                    byte[] blob = await _minio.GetFileAsync(accomodation.PhotoFileName);
                    string base64 = $"data:image/jpeg;base64,{Convert.ToBase64String(blob)}";

                    var paginated = new PaginateAccomodation
                    {
                        Id = accomodation.Id,
                        Name = accomodation.Name,
                        Description = accomodation.Description,
                        City = accomodation.City,
                        PhotoBase64 = base64
                    };

                    paginatedList.Add(paginated);
                }
                return new(ServiceResult.OK, paginatedList, total);
            }
            else
            {
                var result = await _dapi.Accomodations.PaginateByCityAndDate(cityFilter, page, size, startDate.Value, endDate.Value);
                var accomodations = result.Item1;
                var total = result.Item2;
                var paginatedList = new List<PaginateAccomodation>();
                _log.Info("Converting the Accomodation to the Paginated Class");
                foreach (var accomodation in accomodations)
                {
                    byte[] blob = await _minio.GetFileAsync(accomodation.PhotoFileName);
                    string base64 = $"data:image/jpeg;base64,{Convert.ToBase64String(blob)}";

                    var paginated = new PaginateAccomodation
                    {
                        Id = accomodation.Id,
                        Name = accomodation.Name,
                        Description = accomodation.Description,
                        City = accomodation.City,
                        PhotoBase64 = base64
                    };

                    paginatedList.Add(paginated);
                }
                return new(ServiceResult.OK, paginatedList, total);
            }
        }

        public async Task<ServiceResult> Reservate(int accomodationId, string email, DateOnly startDate, DateOnly endDate)
        {

            var user = await _dapi.Users.GetByEmailAsync(email);

            var exists = await _dapi.Reservations.FindByDateAsync(accomodationId, startDate, endDate);

            if(exists is not null)
            {
                return ServiceResult.RESERVATION_EXISTS;
            }

            var reservation = new Reservation
            {
                UserId = user.Id,
                AccomodationId = accomodationId,
                StartDate = startDate,
                EndDate = endDate
            };

            _dapi.BeginTransactionAsync();
            try
            {
                await _dapi.Reservations.Add(reservation);
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
        public async Task<(ServiceResult, AccomodationDetails?)> GetAccomodationDetails(int id)
        {
            _log.Info($"Getting details about accomodation with id: {id}");
            var accomodation = await _dapi.Accomodations.GetAccommodationById(id);

            if (accomodation is null)
            {
                return new(ServiceResult.ACCOMODATION_NOT_FOUND, null);
            }

            byte[] blob = await _minio.GetFileAsync(accomodation.PhotoFileName);
            string base64 = $"data:image/jpeg;base64,{Convert.ToBase64String(blob)}";
            var result = new AccomodationDetails
            {
                Id = id,
                Name = accomodation.Name,
                Description = accomodation.Description,
                City = accomodation.City,
                Address = accomodation.Address,
                PhotoBase64 = base64,
            };

            return new(ServiceResult.OK, result);
        }
    }

}

