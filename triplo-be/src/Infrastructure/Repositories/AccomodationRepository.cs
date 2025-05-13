using log4net;
using Microsoft.EntityFrameworkCore;
using src.Application.Interfaces.Repositories;
using src.Domain.Entities;
using src.Domain.Enums;
using src.Infrastructure.Contexts;

namespace src.Infrastructure.Repositories
{
    public class AccomodationRepository : IAccomodationRepository
    {
        private readonly PgSqlDbContext _context;
        private readonly ILog _log;

        public AccomodationRepository(PgSqlDbContext context, ILog log)
        {
            _context = context;
            _log = log;
        }

        public async Task<Accommodation>  GetAccommodationByNameAsync(string name)
        {
            _log.Info($"Verify if an accomodation with the name: {name} exists");

            var accomodation = await _context.Accommodations.FirstOrDefaultAsync(x => x.Name == name);

            if(accomodation is null)
            {
                _log.Info($"Accomodation with name {name} was not found");
                return null;
            }

            _log.Info($"Accomodation with name {name} was found");

            return accomodation;
        }

        public async Task<Accommodation> GetAccommodationById(int id)
        {
            _log.Info($"Getting the accomdation with id: {id}");
            var accommodation = await _context.Accommodations.FirstOrDefaultAsync(x=>x.Id == id);

            if (accommodation is null)
            {
                _log.Info($"Accomdation with id: {id} was not found");
                return null;
            }

            _log.Info($"Accomdation with id: {id} was found");

            return accommodation;
        }

        public async Task<Accommodation> Add(Accommodation accommodation)
        {
            _log.Info($"Adding accomodation with name: {accommodation.Name} in database");
            _context.Accommodations.AddAsync(accommodation);
            
            return accommodation;
        }

        public async Task<(List<Accommodation>,int)> PaginateByCity(City cityFilter, int page, int size)
        {
            List<Accommodation> accommodations = new List<Accommodation>();
            if (cityFilter.Equals(City.NONE))
            {
                accommodations = await _context.Accommodations.ToListAsync();
            }
            else
            {
                accommodations = await _context.Accommodations.Where(x => x.City.Equals(cityFilter)).ToListAsync();
            }

            var totalAccomodations = accommodations.Count();

            var totalPages = (int)Math.Ceiling((decimal)totalAccomodations / size);

            var accomodationsOnPage = accommodations.Skip((page - 1) * size).Take(size).ToList();

            _log.Info($"Retreaving the Accomodation in paginated style with total of pages: {totalPages}");

            return new(accomodationsOnPage, totalPages);
        }

        public async Task<(List<Accommodation>, int)> PaginateByCityAndDate(City cityFilter, int page, int size,DateOnly startDate,DateOnly endDate)
        {
            List<Accommodation> accommodations = new List<Accommodation>();
            if (cityFilter.Equals(City.NONE))
            {
                accommodations = await _context.Accommodations.Include(x=>x.Reservations).Where(x=> !x.Reservations.Any(r=> startDate<=r.EndDate && endDate>=r.StartDate)).ToListAsync();
            }
            else
            {
                accommodations = await _context.Accommodations.Include(x=>x.Reservations)
                    .Where(x => x.City.Equals(cityFilter) && !x.Reservations.Any(r => startDate <= r.EndDate && endDate >= r.StartDate)).ToListAsync();
                
            }

            var totalAccomodations = accommodations.Count();

            var totalPages = (int)Math.Ceiling((decimal)totalAccomodations / size);

            var accomodationsOnPage = accommodations.Skip((page - 1) * size).Take(size).ToList();

            _log.Info($"Retreaving the Accomodation in paginated style with total of pages: {totalPages}");

            return new(accomodationsOnPage, totalPages);
        }

    }
}
