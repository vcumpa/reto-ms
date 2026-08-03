namespace CargaMasivaService.Domain.Entities;

using CargaMasivaService.Domain.Enums;

public class CargaDetalleEntity
{
    public int Id { get; set; }
    public int IdCargaArchivo { get; set; }
    public int NumeroFila { get; set; }
    public string Periodo { get; set; } = string.Empty;
    public string CodigoProducto { get; set; } = string.Empty;
    public string Descripcion { get; set; } = string.Empty;
    public EstadoDetalleCarga Estado { get; set; }
    public string Observacion { get; set; } = string.Empty;
    public DateTime FechaRegistro { get; set; } = DateTime.UtcNow;
}
