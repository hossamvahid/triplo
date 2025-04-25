using System.ComponentModel.DataAnnotations;

namespace src.Presentation.RequestModels
{
    public class RegisterRequest
    {
        [EmailAddress]
        public string Email { get; set; }

        public string Name { get; set; }

        public string Password { get; set; }
    }
}
