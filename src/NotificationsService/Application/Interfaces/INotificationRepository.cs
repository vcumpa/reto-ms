namespace NotificationsService.Application.Interfaces;

using NotificationsService.Domain.Entities;

public interface INotificationRepository
{
    Task<CargaArchivoEntity?> ObtenerCargaAsync(int idCarga);
    Task SaveChangesAsync();
}
