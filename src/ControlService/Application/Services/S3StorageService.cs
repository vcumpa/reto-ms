using Amazon.Runtime;
using Amazon.S3;
using Amazon.S3.Model;
using ControlService.Application.Interfaces;

namespace ControlService.Services;

public class S3StorageService : IArchivoStorageService
{
    private readonly IAmazonS3 _s3Client;
    private readonly string _bucketName;

    public S3StorageService(IConfiguration config)
    {
        var seaweedConfig = config.GetSection("SeaweedFS");
        _bucketName = seaweedConfig["BucketName"] ?? "archivos-excel";

        var s3Config = new AmazonS3Config
        {
            ServiceURL = seaweedConfig["ServiceUrl"],
            ForcePathStyle = true,
            UseHttp = true,
            AuthenticationRegion = "us-east-1"
        };

        _s3Client = new AmazonS3Client(new AnonymousAWSCredentials(), s3Config);
    }

    public async Task<string> UploadFileAsync(IFormFile file)
    {
        try
        {
            await _s3Client.PutBucketAsync(_bucketName);
        }
        catch (AmazonS3Exception ex) when (ex.ErrorCode == "BucketAlreadyOwnedByYou" || ex.ErrorCode == "BucketAlreadyExists")
        {
        }

        var objectKey = $"{Guid.NewGuid()}_{file.FileName}";

        using var stream = file.OpenReadStream();
        var request = new PutObjectRequest
        {
            BucketName = _bucketName,
            Key = objectKey,
            InputStream = stream,
            ContentType = file.ContentType ?? "application/octet-stream"
        };

        await _s3Client.PutObjectAsync(request);
        return $"{_bucketName}/{objectKey}";
    }
}
