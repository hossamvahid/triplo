using src.Domain.Enums;

namespace src.Presentation.RequestModels
{
    public class CreateAccomodationRequest
    {
        //string name, string description, string address, City city, IFormFile photo
        public string? Name {  get; set; }
        public string?  Description { get; set; }

        public string? Address { get; set; }

        public City? City { get; set; }

        public IFormFile? Photo { get; set; }
    }
}
