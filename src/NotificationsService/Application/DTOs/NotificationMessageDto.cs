namespace NotificationsService.Application.DTOs;

public class NotificationMessageDto
{
    public int IdCarga { get; set; }
    public string Usuario { get; set; } = string.Empty;
    public DateTime FechaFin { get; set; }
    public string Estado { get; set; } = "FINALIZADO";
}
