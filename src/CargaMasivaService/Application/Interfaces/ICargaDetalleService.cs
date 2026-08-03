namespace CargaMasivaService.Application.Interfaces;

using CargaMasivaService.Application.DTOs;

public interface ICargaDetalleService
{
    Task<IEnumerable<CargaDetalleDto>> ObtenerContenidoAsync(int idCarga);
}
