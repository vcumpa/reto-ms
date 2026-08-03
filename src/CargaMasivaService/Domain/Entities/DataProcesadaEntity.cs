namespace CargaMasivaService.Domain.Entities;

public class DataProcesadaEntity
{
    public int Id { get; set; }
    public int IdCargaArchivo { get; set; }
    public string CodigoProducto { get; set; } = string.Empty;
    public int Periodo { get; set; }
    public string Descripcion { get; set; } = string.Empty;
    public DateTime FechaProceso { get; set; } = DateTime.UtcNow;
}
