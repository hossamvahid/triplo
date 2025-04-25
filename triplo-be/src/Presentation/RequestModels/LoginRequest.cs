using System.ComponentModel.DataAnnotations;

namespace src.Presentation.RequestModels
{
    public class LoginRequest
    {
        [EmailAddress]
        public string? Email { get; set; }

        public string? Password { get; set; }
    }
}
