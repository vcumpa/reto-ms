namespace ControlService.Application.DTOs;

public class CargaMasivaMessageDto
{
    public int IdCarga { get; set; }
    public string RutaStorage { get; set; } = string.Empty;
    public string Usuario { get; set; } = string.Empty;
}
