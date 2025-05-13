using src.Domain.Enums;

namespace src.Presentation.ResponseModel
{
    public class PaginateAccomodation
    {
        public int Id { get; set; }
        public string? Name { get; set; }
        public string? Description { get; set; }
        public string? PhotoBase64 { get; set; }
        public City? City { get; set; }
    }
}
