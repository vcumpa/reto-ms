namespace CargaMasivaService.Application.Interfaces;

public interface INotificationPublisher
{
    void PublicarNotificacion(int idCarga, string usuario);
}
