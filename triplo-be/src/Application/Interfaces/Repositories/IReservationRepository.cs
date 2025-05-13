using src.Domain.Entities;

namespace src.Application.Interfaces.Repositories
{
    public interface IReservationRepository
    {
        Task<Reservation> Add(Reservation accommodation);
    }
}
