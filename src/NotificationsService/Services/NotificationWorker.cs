using System.Text;
using System.Text.Json;
using NotificationsService.Application.DTOs;
using NotificationsService.Application.Interfaces;
using RabbitMQ.Client;
using RabbitMQ.Client.Events;

namespace NotificationsService.Services;

public class NotificationWorker : BackgroundService
{
    private readonly ILogger<NotificationWorker> _logger;
    private readonly IConfiguration _config;
    private readonly IServiceProvider _serviceProvider;
    private IConnection? _connection;
    private IModel? _channel;

    public NotificationWorker(
        ILogger<NotificationWorker> logger,
        IConfiguration config,
        IServiceProvider serviceProvider)
    {
        _logger = logger;
        _config = config;
        _serviceProvider = serviceProvider;
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

            var queueName = rabbitConfig["QueueName"] ?? "notificaciones";
            _channel.QueueDeclare(queue: queueName, durable: true, exclusive: false, autoDelete: false);
            _channel.BasicQos(prefetchSize: 0, prefetchCount: 1, global: false);
        }
        catch (Exception ex)
        {
            _logger.LogWarning(ex, "--> [NotificationWorker] RabbitMQ no está disponible todavía. Se reintentará la conexión.");
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

        var queueName = _config["RabbitMQ:QueueName"] ?? "notificaciones";
        var consumer = new EventingBasicConsumer(_channel);

        consumer.Received += async (ch, ea) =>
        {
            var body = ea.Body.ToArray();
            var json = Encoding.UTF8.GetString(body);
            _logger.LogInformation("--> [RabbitMQ Notifications] Mensaje recibido de la cola: {json}", json);

            try
            {
                var notification = JsonSerializer.Deserialize<NotificationMessageDto>(json);
                if (notification != null)
                {
                    using var scope = _serviceProvider.CreateScope();
                    var processor = scope.ServiceProvider.GetRequiredService<INotificationProcessor>();

                    await processor.ProcesarNotificacionAsync(notification);
                }

                _channel?.BasicAck(deliveryTag: ea.DeliveryTag, multiple: false);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "--> [NotificationWorker] Error procesando notificación.");
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
