namespace CargaMasivaService.Application.Interfaces;

using CargaMasivaService.Domain.Entities;
using CargaMasivaService.Domain.Enums;

public interface ICargaDetalleRepository
{

    Task<bool> ExisteCodigoProductoAsync(string codigoProducto);
    Task<IEnumerable<CargaDetalleEntity>> ObtenerDetalleAsync(int idCarga);
    Task RegistrarDetalleAsync(CargaDetalleEntity detalle);
    Task RegistrarDataProcesadaAsync(DataProcesadaEntity data);
}
