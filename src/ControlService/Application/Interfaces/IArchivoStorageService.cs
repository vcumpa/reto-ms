namespace ControlService.Application.Interfaces;

public interface IArchivoStorageService
{
    Task<string> UploadFileAsync(IFormFile file);
}
