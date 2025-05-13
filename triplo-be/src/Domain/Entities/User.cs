using System.ComponentModel.DataAnnotations;
using src.Domain.Enums;

namespace src.Domain.Entities
{
    public class User
    {
        
        public int Id { get; set; }

        public string? Email { get; set; }

        public string? Name { get; set; }

        public string? Password { get; set; }

        public string? PhoneNumber { get; set; }

        public Role Role { get; set; } = Role.User; 

        public IEnumerable<Reservation>? Reservations { get; set; }

    }
}
