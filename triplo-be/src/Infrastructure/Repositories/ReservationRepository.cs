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

        public async Task<Reservation> FindByDateAsync(int accomodationId,DateOnly startDate, DateOnly endDate)
        {
            _log.Info($"Finding if an reservation already exists for the accomodation with Id: {accomodationId} on dates Check-In {startDate} Check-Out {endDate}");
            var reservation = await _context.Reservations.FirstOrDefaultAsync(x=> x.AccomodationId == accomodationId && startDate <= x.EndDate && endDate >= x.StartDate);

            if(reservation is null)
            {
                _log.Info($"Reservation was not found with Id: {accomodationId} on dates Check-In {startDate} Check-Out {endDate}");
                return null;
            }

            _log.Info($"Reservation was found with Id: {accomodationId} on dates Check-In {startDate} Check-Out {endDate}");
            return reservation;
        }

        public async Task<(List<Reservation>,int)> GetUserReservationPaginated(int userId,int page ,int size)
        {
            _log.Info($"Getting the reservation for user with Id: {userId}");

            var reservations = await _context.Reservations.Include(x=>x.User).Include(x=> x.Accommodation).Where(x => x.UserId == userId).ToListAsync();

            var totalReservations = reservations.Count();

            var totalPages = (int)Math.Ceiling((decimal)totalReservations / size);

            var reservationOnPage = reservations.Skip((page-1)*size).Take(size).ToList();

            return new(reservationOnPage, totalPages);
        }
    }
}
