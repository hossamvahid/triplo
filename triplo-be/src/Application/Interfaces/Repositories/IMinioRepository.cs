namespace src.Application.Interfaces.Repositories
{
    public interface IMinioRepository
    {
        public Task<bool> UploadFileAsync(IFormFile file);
        public Task<byte[]> GetFileAsync(string fileName);
        public Task<bool> DeleteFileAsync(string fileName);
    }
}
