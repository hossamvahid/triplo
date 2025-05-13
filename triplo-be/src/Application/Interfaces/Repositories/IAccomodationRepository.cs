using src.Domain.Entities;
using src.Domain.Enums;

namespace src.Application.Interfaces.Repositories
{
    public interface IAccomodationRepository
    {
        Task<Accommodation> GetAccommodationByNameAsync(string name);

        Task<Accommodation> GetAccommodationById(int id);
        Task<Accommodation> Add(Accommodation accommodation);

        Task<(List<Accommodation>, int)> PaginateByCity(City cityFilter, int page, int size);
        Task<(List<Accommodation>, int)> PaginateByCityAndDate(City cityFilter, int page, int size,DateOnly startDate,DateOnly endDate);
       
    }
}
