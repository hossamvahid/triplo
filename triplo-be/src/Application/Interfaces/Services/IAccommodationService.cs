using src.Application.Implementation;
using src.Domain.Enums;
using src.Presentation.ResponseModel;

namespace src.Application.Interfaces.Services
{
    public interface IAccommodationService
    {
        public Task<ServiceResult> CreateAccommodation(string name, string description, string address , City city, IFormFile photo);
        public Task<(ServiceResult, List<PaginateAccomodation>?,int)> Paginate(City cityFilter, int page, int size, DateOnly? startDate, DateOnly? endDate);

        public Task<ServiceResult> Reservate(int accomodationId, string email, DateOnly startDate, DateOnly endDate);
        public Task<(ServiceResult,AccomodationDetails?)> GetAccomodationDetails(int id);
    }
}
