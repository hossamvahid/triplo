    using log4net;
    using Minio;
    using Minio.DataModel.Args;
    using src.Application.Interfaces.Repositories;

    namespace src.Infrastructure.Repositories
    {
        public class MinioRepository : IMinioRepository
        {
            private readonly IMinioClient _minio;
            private readonly ILog _log;

            public MinioRepository(IMinioClient minio, ILog log)
            {
                _minio = minio;
                _log = log;
            }

            public async Task<bool> UploadFileAsync(IFormFile file)
            {
                _log.Info($"Starting to upload the file with name: {file.FileName}");

                using (Stream stream = new MemoryStream())
                {
                    _log.Info($"Copping the file with name: {file.FileName} into the stream");
                    await file.CopyToAsync(stream);

                    stream.Position = 0;

                    try
                    {
                        PutObjectArgs putObjectArgs = new PutObjectArgs()
                            .WithBucket(Environment.GetEnvironmentVariable("PhotoBucket"))
                            .WithObject(file.FileName)
                            .WithContentType(file.ContentType)
                            .WithObjectSize(stream.Length)
                            .WithStreamData(stream);

                        await _minio.PutObjectAsync(putObjectArgs);
                        _log.Info($"File with name:{file.FileName} was succesfuly uploaded in bucket");
                        return true;
                    }
                    catch (Exception ex)
                    {
                        _log.Error($"Error at uploading the file with name: {file.FileName} into the bucket. Reason: {ex.Message}");
                        return false;
                    }

                }
            }

            public async Task<byte[]> GetFileAsync(string fileName)
            {
                _log.Info($"Trying to get file with name: {fileName} from bucket ");
                try
                {
                    byte[] fileBytes = null;

                    await _minio.GetObjectAsync(new GetObjectArgs()
                        .WithBucket(Environment.GetEnvironmentVariable("PhotoBucket"))
                        .WithObject(fileName)
                        .WithCallbackStream(stream =>
                        {
                            using var ms = new MemoryStream();
                            stream.CopyTo(ms);
                            fileBytes = ms.ToArray();
                        }));

                    _log.Info($"Successfully retrieved blob for file: {fileName}");

                    return fileBytes;
                }
                catch (Exception ex)
                {
                    _log.Error($"Error retrieving blob content for file: {fileName}. Reason: {ex.Message}");
                    return null;
                }
            }

            public async Task<bool> DeleteFileAsync(string fileName)
            {
                _log.Info($"Trying to delete the file: {fileName} from bucket");
                try
                {
                    await _minio.RemoveObjectAsync(new RemoveObjectArgs()
                        .WithBucket(Environment.GetEnvironmentVariable("PhotoBucket"))
                        .WithObject(fileName));

                    _log.Info($"File: {fileName} was succesfuly deleted");
                    return true;
                }
                catch (Exception ex)
                {
                    _log.Error($"Failed to delete file: {fileName} Reason: {ex.Message}", ex);
                    return false;
                }
            }


        }
    }
