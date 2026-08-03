namespace NotificationsService.Application.Services;

using NotificationsService.Application.DTOs;
using NotificationsService.Application.Interfaces;
using NotificationsService.Domain.Entities;
using NotificationsService.Domain.Enums;

public class NotificationProcessor : INotificationProcessor
{
    private readonly IEmailService _emailService;
    private readonly ICargaArchivoRepository _cargaRepository;
    private readonly ILogger<NotificationProcessor> _logger;

    public NotificationProcessor(IEmailService emailService,
                                 ICargaArchivoRepository cargaRepository,
                                 ILogger<NotificationProcessor> logger)
    {
        _emailService = emailService;
        _cargaRepository = cargaRepository;
        _logger = logger;
    }

    public async Task ProcesarNotificacionAsync(NotificationMessageDto mensaje)
    {
        try
        {
            if (mensaje is null)
            {
                _logger.LogWarning("--> [NotificationProcessor] Mensaje de notificación nulo.");
                return;
            }

            var carga = await _cargaRepository.ObtenerCargaAsync(mensaje.IdCarga);
            if (carga is null)
            {
                _logger.LogWarning("--> [NotificationProcessor] No se encontró la carga con Id {IdCarga}.", mensaje.IdCarga);
                return;
            }

            var subject = $"Finalización de Cargas - ID #{mensaje.IdCarga}";
            var content = $@"
                <h2>Notificación de Carga Masiva</h2>
                <p>Estimado usuario <strong>{mensaje.Usuario}</strong>,</p>
                <p>Le informamos que la carga masiva con <strong>ID #{mensaje.IdCarga}</strong> ha finalizado exitosamente el {DateTime.UtcNow:yyyy-MM-dd HH:mm:ss} UTC.</p>
                <hr/>
                <p>Este es un correo automático generado por el servicio de notificaciones.</p>";

            await _emailService.SendEmailAsync(mensaje.Usuario, subject, content);

            carga.Estado = EstadoCarga.Notificado;
            carga.Observacion = "Notificación por correo enviada exitosamente.";

            await _cargaRepository.ActualizarEstadoAsync(mensaje.IdCarga, EstadoCarga.Notificado, "Notificación por correo enviada exitosamente.");

            _logger.LogInformation("--> [NotificationProcessor] Notificación procesada para la carga {IdCarga}.", mensaje.IdCarga);
        }
        catch (System.Exception ex)
        {
            _logger.LogError(ex, "--> [NotificationProcessor] Error al procesar notificación para la carga {IdCarga}.", mensaje.IdCarga);
            throw;
        }
    }
}
