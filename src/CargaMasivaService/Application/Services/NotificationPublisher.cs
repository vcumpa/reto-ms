using System.Text;
using System.Text.Json;
using CargaMasivaService.Application.DTOs;
using CargaMasivaService.Application.Interfaces;
using RabbitMQ.Client;

namespace CargaMasivaService.Application.Services;

public class NotificationPublisher : INotificationPublisher
{
    private readonly IConfiguration _config;
    private readonly ILogger<NotificationPublisher> _logger;

    public NotificationPublisher(IConfiguration config, ILogger<NotificationPublisher> logger)
    {
        _config = config;
        _logger = logger;
    }

    public void PublicarNotificacion(int idCarga, string usuario)
    {
        try
        {
            var rabbitConfig = _config.GetSection("RabbitMQ");
            var factory = new ConnectionFactory
            {
                HostName = rabbitConfig["HostName"] ?? "localhost",
                Port = int.Parse(rabbitConfig["Port"] ?? "5672"),
                UserName = rabbitConfig["UserName"] ?? "guest",
                Password = rabbitConfig["Password"] ?? "guest"
            };

            using var connection = factory.CreateConnection();
            using var channel = connection.CreateModel();

            var queueName = _config["RabbitMQ:NotificationQueueName"] ?? "notificaciones";
            channel.QueueDeclare(queue: queueName, durable: true, exclusive: false, autoDelete: false, arguments: null);

            var message = new NotificationMessage
            {
                IdCarga = idCarga,
                Usuario = usuario,
            };

            var json = JsonSerializer.Serialize(message);
            var body = Encoding.UTF8.GetBytes(json);

            var properties = channel.CreateBasicProperties();
            properties.Persistent = true;

            channel.BasicPublish(exchange: "", routingKey: queueName, basicProperties: properties, body: body);

            _logger.LogInformation("--> [RabbitMQ] Evento de notificación publicado para la carga ID {idCarga} en la cola '{queue}'", idCarga, queueName);
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "--> Error al publicar evento de notificación para Carga ID {idCarga}", idCarga);
        }
    }
}
