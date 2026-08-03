namespace CargaMasivaService.Application.DTOs;

public class CargaMasivaMessage
{
    public int IdCarga { get; set; }
    public string RutaStorage { get; set; } = string.Empty;
    public string Usuario { get; set; } = string.Empty;
    public DateTime FechaCreacion { get; set; } = DateTime.UtcNow;
}
