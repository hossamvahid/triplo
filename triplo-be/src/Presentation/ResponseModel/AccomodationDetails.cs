using src.Domain.Enums;

namespace src.Presentation.ResponseModel
{
    public class AccomodationDetails
    {
        public int Id { get; set; }
        public string? Name { get; set; }
        public string? Description { get; set; }
        public string? PhotoBase64 { get; set; }
        public string? Address { get; set; }
        public City? City { get; set; }

    }
}
