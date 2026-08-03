using System.Text;
using System.Text.Json;
using ControlService.Application.DTOs;
using ControlService.Application.Interfaces;
using RabbitMQ.Client;

namespace ControlService.Services;

public class RabbitMQPublisher : IRabbitMqPublisher
{
    private readonly IConfiguration _config;

    public RabbitMQPublisher(IConfiguration config)
    {
        _config = config;
    }

    public void PublicarEventoCarga(int idCarga, string rutaStorage, string usuario)
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

        var queueName = rabbitConfig["QueueName"] ?? "cola-cargas";
        channel.QueueDeclare(queue: queueName, durable: true, exclusive: false, autoDelete: false, arguments: null);

        var mensajeObj = new CargaMasivaMessageDto
        {
            IdCarga = idCarga,
            RutaStorage = rutaStorage,
            Usuario = usuario,
        };

        var json = JsonSerializer.Serialize(mensajeObj);
        var body = Encoding.UTF8.GetBytes(json);

        var properties = channel.CreateBasicProperties();
        properties.Persistent = true;
        channel.BasicPublish(exchange: "", routingKey: queueName, basicProperties: properties, body: body);
    }
}
