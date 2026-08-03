namespace ControlService.Application.DTOs;

public class CargaArchivoRequestDto
{
    public string NombreArchivo { get; set; } = string.Empty;
    public string RutaStorage { get; set; } = string.Empty;
    public string Usuario { get; set; } = string.Empty;
    public string Periodo { get; set; } = string.Empty;
    public string? Observacion { get; set; }
}