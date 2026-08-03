using MailKit.Net.Smtp;
using MimeKit;
using NotificationsService.Application.Interfaces;

namespace NotificationsService.Infraestructure.Services;

public class MailKitEmailService : IEmailService
{
    private readonly IConfiguration _config;
    private readonly ILogger<MailKitEmailService> _logger;

    public MailKitEmailService(IConfiguration config, ILogger<MailKitEmailService> logger)
    {
        _config = config;
        _logger = logger;
    }

    public async Task SendEmailAsync(string toEmail, string subject, string htmlContent)
    {
        try
        {
            var smtpHost = _config["Smtp:Host"] ?? "localhost";
            var smtpPort = int.Parse(_config["Smtp:Port"] ?? "1025");
            var fromEmail = _config["Smtp:From"] ?? "notificaciones@retoms.com";

            var message = new MimeMessage();
            message.From.Add(new MailboxAddress("Sistema de Carga Masiva", fromEmail));
            message.To.Add(new MailboxAddress(toEmail, toEmail));
            message.Subject = subject;

            var bodyBuilder = new BodyBuilder { HtmlBody = htmlContent };
            message.Body = bodyBuilder.ToMessageBody();

            using var client = new SmtpClient();
            await client.ConnectAsync(smtpHost, smtpPort, MailKit.Security.SecureSocketOptions.None);
            await client.SendAsync(message);
            await client.DisconnectAsync(true);

            _logger.LogInformation("--> [MailKit] Correo enviado exitosamente a {toEmail} vía {host}:{port}", toEmail, smtpHost, smtpPort);
        }
        catch (System.Exception ex)
        {
            _logger.LogError(ex, "--> [MailKit] Error al enviar correo a {toEmail}", toEmail);
            throw;
        }
    }
}
