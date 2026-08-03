namespace ControlService.Application.Interfaces;

using ControlService.Domain.Entities;

public interface ICargaArchivoRepository
{
    Task<int> RegistrarCargaAsync(CargaArchivoEntity carga);
    Task<IEnumerable<CargaArchivoEntity>> ObtenerCargasAsync(int periodo);
}
