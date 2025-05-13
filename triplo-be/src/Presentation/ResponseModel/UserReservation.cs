using src.Domain.Enums;

namespace src.Presentation.ResponseModel
{
    public class UserReservation
    {
        public string? AccomodationName { get; set; }

        public string? Address { get; set; }

        public string? PhotoBase64 { get; set; }

        public City? City { get; set; }

        public DateOnly StartDate {  get; set; }

        public DateOnly EndDate {  get; set; }

    }
}
