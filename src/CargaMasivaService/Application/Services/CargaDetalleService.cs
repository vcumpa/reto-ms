namespace CargaMasivaService.Application.Services;

using CargaMasivaService.Application.DTOs;
using CargaMasivaService.Application.Interfaces;

public class CargaDetalleService : ICargaDetalleService
{
    private readonly ICargaDetalleRepository _repository;

    public CargaDetalleService(ICargaDetalleRepository repository)
    {
        _repository = repository;
    }

    public async Task<IEnumerable<CargaDetalleDto>> ObtenerContenidoAsync(int idCarga)
    {
        // var carga = await _repository.ObtenerCargaAsync(idCarga);
        // if (carga is null)
        // {
        //     return null;
        // }

        var detalle = await _repository.ObtenerDetalleAsync(idCarga);

        return detalle.Aggregate(new List<CargaDetalleDto>(), (list, d) =>
        {
            list.Add(new CargaDetalleDto
            {
                Id = d.Id,
                NumeroFila = d.NumeroFila,
                Periodo = d.Periodo,
                CodigoProducto = d.CodigoProducto,
                Descripcion = d.Descripcion,
                Estado = d.Estado.ToString(),
                Observacion = d.Observacion,
                FechaRegistro = d.FechaRegistro
            });
            return list;
        });
    }

}
