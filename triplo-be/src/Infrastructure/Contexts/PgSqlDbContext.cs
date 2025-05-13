using Microsoft.EntityFrameworkCore;
using src.Domain.Entities;

namespace src.Infrastructure.Contexts
{
    public class PgSqlDbContext : DbContext
    {
        public DbSet<User> Users { get; set; }
        public DbSet<Accommodation> Accommodations { get; set; }
        public DbSet<Reservation> Reservations { get; set; }
        public PgSqlDbContext(DbContextOptions options) : base(options) { }

        protected override void OnModelCreating(ModelBuilder modelBuilder)
        { 
            // User -> Reservation (One - To - Many)
            modelBuilder.Entity<User>()
                .HasMany(u => u.Reservations)
                .WithOne(r => r.User)
                .HasForeignKey(r => r.UserId);

            // Accomodation -> Reservation

            modelBuilder.Entity<Accommodation>()
                .HasMany(a=>a.Reservations)
                .WithOne(r=>r.Accommodation)
                .HasForeignKey(r=>r.AccomodationId);
        }
    }
}
