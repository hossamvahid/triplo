using src.Domain.Entities;

namespace src.Application.Interfaces.Repositories
{
    public interface IReservationRepository
    {
        Task<Reservation> Add(Reservation accommodation);

        Task<Reservation> FindByDateAsync(int accomodationId, DateOnly startDate ,  DateOnly endDate);

        Task<(List<Reservation>,int)> GetUserReservationPaginated(int userId,int page,int size);
    }
}
