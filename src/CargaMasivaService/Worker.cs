using System.Text;
using System.Text.Json;
using CargaMasivaService.Application.DTOs;
using CargaMasivaService.Application.Interfaces;
using RabbitMQ.Client;
using RabbitMQ.Client.Events;

namespace CargaMasivaService;

public class Worker : BackgroundService
{
    private readonly ILogger<Worker> _logger;
    private readonly IConfiguration _config;
    // private readonly IProcesadorCargaService _procesador;
    private readonly IServiceScopeFactory _scopeFactory;
    private IConnection? _connection;
    private IModel? _channel;

    public Worker(ILogger<Worker> logger, IConfiguration config, IServiceScopeFactory scopeFactory)
    {
        _logger = logger;
        _config = config;
        _scopeFactory = scopeFactory;
    }

    private void InitRabbitMQ()
    {
        try
        {
            var rabbitConfig = _config.GetSection("RabbitMQ");
            var factory = new ConnectionFactory
            {
                HostName = rabbitConfig["HostName"] ?? "localhost",
                Port = int.Parse(rabbitConfig["Port"] ?? "5672"),
                UserName = rabbitConfig["UserName"] ?? "guest",
                Password = rabbitConfig["Password"] ?? "guest",
                AutomaticRecoveryEnabled = true,
                NetworkRecoveryInterval = TimeSpan.FromSeconds(5)
            };

            _connection = factory.CreateConnection();
            _channel = _connection.CreateModel();

            var queueName = rabbitConfig["QueueName"] ?? "cola-cargas";
            _channel.QueueDeclare(queue: queueName, durable: true, exclusive: false, autoDelete: false);
            _channel.BasicQos(prefetchSize: 0, prefetchCount: 1, global: false);
        }
        catch (Exception ex)
        {
            _logger.LogWarning(ex, "RabbitMQ no está disponible todavía. Se reintentará la conexión.");
            _channel?.Dispose();
            _connection?.Dispose();
            _channel = null;
            _connection = null;
        }
    }

    protected override async Task ExecuteAsync(CancellationToken stoppingToken)
    {
        while (_channel is null && !stoppingToken.IsCancellationRequested)
        {
            InitRabbitMQ();

            if (_channel is null)
            {
                await Task.Delay(TimeSpan.FromSeconds(5), stoppingToken);
            }
        }

        if (_channel is null || stoppingToken.IsCancellationRequested)
        {
            return;
        }

        var queueName = _config["RabbitMQ:QueueName"] ?? "cola-cargas";
        var consumer = new EventingBasicConsumer(_channel);

        consumer.Received += async (ch, ea) =>
        {
            var body = ea.Body.ToArray();
            var json = Encoding.UTF8.GetString(body);
            _logger.LogInformation("--> [RabbitMQ] Mensaje recibido de la cola: {json}", json);

            try
            {
                using var scope = _scopeFactory.CreateScope();
                var procesador = scope.ServiceProvider.GetRequiredService<IProcesadorCargaService>();

                var mensaje = JsonSerializer.Deserialize<CargaMasivaMessage>(json);
                if (mensaje is null)
                {
                    throw new InvalidOperationException("Mensaje de carga inválido.");
                }

                await procesador.ProcesarCargaAsync(mensaje);

                _logger.LogInformation("--> [Worker] Carga ID {idCarga} procesada exitosamente.", mensaje.IdCarga);
                _channel?.BasicAck(deliveryTag: ea.DeliveryTag, multiple: false);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "--> [Worker] Error al procesar mensaje de la cola.");
                _channel?.BasicNack(deliveryTag: ea.DeliveryTag, multiple: false, requeue: false);
            }
        };

        _channel.BasicConsume(queue: queueName, autoAck: false, consumer: consumer);
        await Task.Delay(Timeout.InfiniteTimeSpan, stoppingToken);
    }

    public override void Dispose()
    {
        _channel?.Close();
        _connection?.Close();
        base.Dispose();
    }
}
