namespace src.Domain.Entities
{
    public class Reservation
    {
        public int Id { get; set; }

        public DateOnly StartDate { get; set; }

        public DateOnly EndDate { get; set; }

        public int UserId { get; set; }

        public int AccomodationId { get; set; }

        public User? User { get; set; }

        public Accommodation? Accommodation { get; set; }
    }
}
