using src.Domain.Enums;

namespace src.Domain.Entities
{
    public class Accommodation
    {

        public int Id { get; set; }
        public string? Name { get; set; }

        public string? Description { get; set; }

        public string? Address { get; set; }

        public string? PhotoFileName { get; set; }
        public City? City { get; set; }

        public IEnumerable<Reservation>? Reservations { get; set; }
    }
}
