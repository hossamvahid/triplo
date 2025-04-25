using Microsoft.EntityFrameworkCore;
using src.Domain.Entities;

namespace src.Infrastructure.Contexts
{
    public class PgSqlDbContext : DbContext
    {
        public DbSet<User> Users { get; set; }


        public PgSqlDbContext(DbContextOptions options) : base(options) { }
    }
}
