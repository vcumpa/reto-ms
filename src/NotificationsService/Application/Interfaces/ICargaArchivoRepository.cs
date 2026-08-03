namespace NotificationsService.Application.Interfaces;

using NotificationsService.Domain.Entities;
using NotificationsService.Domain.Enums;

public interface ICargaArchivoRepository
{
    Task<CargaArchivoEntity?> ObtenerCargaAsync(int idCarga);
    Task ActualizarEstadoAsync(int idCarga, EstadoCarga estado, string observacion);
}
