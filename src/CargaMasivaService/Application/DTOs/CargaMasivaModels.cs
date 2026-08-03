namespace CargaMasivaService.Application.DTOs;

// DTOs de procesamiento interno
public class ExcelRowDto
{
    public int NumeroFila { get; set; }
    public string CodigoProducto { get; set; } = string.Empty;
    public string Descripcion { get; set; } = string.Empty;
    public string Periodo { get; set; } = string.Empty;
    public int PeriodoInt { get; set; }
}
