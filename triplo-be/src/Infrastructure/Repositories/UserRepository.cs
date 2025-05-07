using log4net;
using Microsoft.EntityFrameworkCore;
using src.Application.Interfaces.Repositories;
using src.Domain.Entities;
using src.Infrastructure.Contexts;

namespace src.Infrastructure.Repositories
{
    public class UserRepository : IUserRepository
    {
        private readonly PgSqlDbContext _context;
        private readonly ILog _log;

        public UserRepository(PgSqlDbContext context,ILog log)
        {
            _context = context;
            _log=log;
        }

        public async Task<User> GetByEmailAsync(string email)
        {
            _log.Info($"Getting the user by email : {email} ");
            var user = await _context.Users.FirstOrDefaultAsync(x => x.Email == email);
            if(user is null)
            {
                _log.Info($"User with email: {email} was not found");
                return null;
            }

            _log.Info($"User with email:{email} was found");
            return user;
        }

        public async Task<bool> Exists(string email)
        {
            bool exists= await _context.Users.AnyAsync(u => u.Email == email);
           if(exists is false)
           {
                _log.Info("Email was not found");
                return false;
           }

            _log.Info("Email exists");
            return true;


            
        }

        public async Task<User> Add(User user)
        {
            _log.Info("Adding user in database");
            await _context.Users.AddAsync(user);
            return user;
        }
    }
}
