namespace CargaMasivaService.Application.DTOs;

public class CargaDetalleDto
{
    public int Id { get; set; }
    public int NumeroFila { get; set; }
    public string Periodo { get; set; } = string.Empty;
    public string? CodigoProducto { get; set; }
    public string? Descripcion { get; set; }
    public string Estado { get; set; } = string.Empty;
    public string? Observacion { get; set; }
    public DateTime FechaRegistro { get; set; }
}
