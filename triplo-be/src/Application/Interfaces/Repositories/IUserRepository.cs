using src.Domain.Entities;

namespace src.Application.Interfaces.Repositories
{
    public interface IUserRepository
    {

        Task<User> GetByEmailAsync(string email);
        Task<bool> Exists(string email);
        Task<User> Add(User user);
       
    }
}
