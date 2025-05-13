using log4net;
using Microsoft.EntityFrameworkCore;
using src.Application.Interfaces.Repositories;
using src.Domain.Entities;
using src.Infrastructure.Contexts;

namespace src.Infrastructure.Repositories
{
    public class ReservationRepository : IReservationRepository
    {
        private readonly PgSqlDbContext _context;
        private readonly ILog _log;

        public ReservationRepository(PgSqlDbContext context, ILog log)
        {
            _context = context;
            _log = log;
        }
        public async Task<Reservation> Add(Reservation reservation)
        {
            _log.Info($"Adding reservation of the user with id: {reservation.UserId}");
            _context.Reservations.Add( reservation );

            return reservation;
        }
    }
}
