namespace ControlService.Domain.Entities;

using ControlService.Domain.Enums;

public class CargaArchivoEntity
{
    public int Id { get; set; }
    public int Periodo { get; set; }
    public string NombreArchivo { get; set; } = string.Empty;
    public string RutaStorage { get; set; } = string.Empty;
    public string Usuario { get; set; } = string.Empty;
    public EstadoCarga Estado { get; set; }
    public DateTime FechaRegistro { get; set; } = DateTime.UtcNow;
    public DateTime? FechaFin { get; set; }
    public string? Observacion { get; set; }
}