namespace CargaMasivaService.Application.Services;

using Amazon.Runtime;
using Amazon.S3;
using Amazon.S3.Model;

public class S3Downloader
{
    private readonly IAmazonS3 _s3Client;

    public S3Downloader(IConfiguration config)
    {
        var seaweedConfig = config.GetSection("SeaweedFS");
        var s3Config = new AmazonS3Config
        {
            ServiceURL = seaweedConfig["ServiceUrl"],
            ForcePathStyle = true,
            UseHttp = true,
            AuthenticationRegion = "us-east-1"
        };

        _s3Client = new AmazonS3Client(new AnonymousAWSCredentials(), s3Config);
    }

    public async Task<MemoryStream> DownloadFileAsync(string rutaStorage)
    {
        var partes = rutaStorage.Split('/', 2);
        var bucketName = partes[0];
        var objectKey = partes[1];

        var response = await _s3Client.GetObjectAsync(new GetObjectRequest
        {
            BucketName = bucketName,
            Key = objectKey
        });

        var memoryStream = new MemoryStream();
        await response.ResponseStream.CopyToAsync(memoryStream);
        memoryStream.Position = 0;
        return memoryStream;
    }
}
