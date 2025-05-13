using log4net;
using Microsoft.EntityFrameworkCore.Storage;
using src.Application.Interfaces.Repositories;
using src.Infrastructure.Contexts;

namespace src.Infrastructure.Repositories
{
    public class Dapi : IDapi
    {
        private readonly PgSqlDbContext _context;
        private IDbContextTransaction _transaction;
        public IUserRepository Users { get; }
        public IAccomodationRepository Accomodations { get; }

        public IReservationRepository Reservations { get; }

        public Dapi(PgSqlDbContext context,ILog log)
        {
            _context = context;
            Users = new UserRepository(_context,log);
            Accomodations = new AccomodationRepository(_context,log);
            Reservations = new ReservationRepository(_context,log);
        }

        public async Task<int> CompleteAsync()
        {
            return await _context.SaveChangesAsync();
        }

        public async Task BeginTransactionAsync()
        {
            if (_transaction != null)
            {
                throw new InvalidOperationException("A transaction is already in progress.");
            }
            _transaction = await _context.Database.BeginTransactionAsync();
        }

        public async Task CommitTransactionAsync()
        {
            if (_transaction == null)
            {
                throw new InvalidOperationException("No transaction in progress.");
            }

            try
            {
                await _transaction.CommitAsync();
            }
            finally
            {
                await DisposeTransactionAsync();
            }
        }

        public async Task RollbackTransactionAsync()
        {
            if (_transaction == null)
            {
                throw new InvalidOperationException("No transaction in progress.");
            }

            try
            {
                await _transaction.RollbackAsync();
            }
            finally
            {
                await DisposeTransactionAsync();
            }
        }

        private async Task DisposeTransactionAsync()
        {
            if (_transaction != null)
            {
                await _transaction.DisposeAsync();
                _transaction = null;
            }
        }

        public void Dispose()
        {
            _context.Dispose();
            if (_transaction != null)
            {
                _transaction.Dispose();
                _transaction = null;
            }
        }

    }
}
