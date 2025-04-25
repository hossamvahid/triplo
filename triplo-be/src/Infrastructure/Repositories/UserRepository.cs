using Microsoft.EntityFrameworkCore;
using src.Application.Interfaces.Repositories;
using src.Domain.Entities;
using src.Infrastructure.Contexts;

namespace src.Infrastructure.Repositories
{
    public class UserRepository : IUserRepository
    {
        private readonly PgSqlDbContext _context;

        public UserRepository(PgSqlDbContext context)
        {
            _context = context;
        }

        public async Task<User> GetByEmailAsync(string email)
        {
            return await _context.Users.FirstOrDefaultAsync(x => x.Email == email);
        }

        public async Task<bool> Exists(string email)
        {
            return await  _context.Users.AnyAsync(u=>u.Email == email);  
            
        }

        public async Task<User> Add(User user)
        {
            await _context.Users.AddAsync(user);
            return user;
        }
    }
}
