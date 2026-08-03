namespace ControlService.Application.Interfaces;

public interface IRabbitMqPublisher
{
    void PublicarEventoCarga(int idCarga, string rutaStorage, string usuario);
}
