namespace CargaMasivaService.Application.DTOs;

public class CargaArchivoDto
{
    public int IdCarga { get; set; }
    public string Usuario { get; set; } = string.Empty;
    public int Periodo { get; set; }
    public string Estado { get; set; } = string.Empty;
    public string Mensaje { get; set; } = string.Empty;
}
