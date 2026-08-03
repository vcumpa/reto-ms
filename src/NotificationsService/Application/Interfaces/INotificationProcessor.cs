namespace NotificationsService.Application.Interfaces;

using NotificationsService.Application.DTOs;

public interface INotificationProcessor
{
    Task ProcesarNotificacionAsync(NotificationMessageDto mensaje);
}
