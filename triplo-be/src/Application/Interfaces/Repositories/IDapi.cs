namespace src.Application.Interfaces.Repositories
{
    public interface IDapi
    {

        IUserRepository Users { get; }
        IAccomodationRepository Accomodations { get; }

        IReservationRepository Reservations { get; }

        Task<int> CompleteAsync();
        Task BeginTransactionAsync();
        Task CommitTransactionAsync();
        Task RollbackTransactionAsync();
    }
}
