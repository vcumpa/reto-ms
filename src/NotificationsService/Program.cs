using Microsoft.EntityFrameworkCore;
using NotificationsService.Application.Interfaces;
using NotificationsService.Application.Services;
using NotificationsService.Infraestructure;
using NotificationsService.Infraestructure.Repositories;
using NotificationsService.Infraestructure.Services;
using NotificationsService.Services;

var builder = WebApplication.CreateBuilder(args);

var connectionString = builder.Configuration.GetConnectionString("PostgresDb") 
                       ?? "Host=localhost;Port=5432;Database=retoms;Username=postgres;Password=postgrespassword";

builder.Services.AddDbContext<NotificationsDbContext>(options =>
    options.UseNpgsql(connectionString));

builder.Services.AddScoped<IEmailService, MailKitEmailService>();
builder.Services.AddScoped<ICargaArchivoRepository, CargaArchivoRepository>();
builder.Services.AddScoped<INotificationProcessor, NotificationProcessor>();
builder.Services.AddHostedService<NotificationWorker>();

var app = builder.Build();

app.MapGet("/health", () => Results.Ok(new { status = "Healthy", service = "NotificationsService" }));

app.Run();
