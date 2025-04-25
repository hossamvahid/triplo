namespace src.Application.Interfaces.Repositories
{
    public interface IDapi
    {

        IUserRepository Users { get; }

        Task<int> CompleteAsync();
        Task BeginTransactionAsync();
        Task CommitTransactionAsync();
        Task RollbackTransactionAsync();
    }
}
