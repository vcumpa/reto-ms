using CargaMasivaService;
using CargaMasivaService.Application.Interfaces;
using CargaMasivaService.Application.Services;
using CargaMasivaService.Infraestructure.Repositories;
using CargaMasivaService.Infrastructure;
using CargaMasivaService.Infrastructure.Repositories;
using CargaMasivaService.Api.Middleware;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.EntityFrameworkCore;
using Microsoft.IdentityModel.Tokens;
using System.Text;

var builder = WebApplication.CreateBuilder(args);

// Configuración de PostgreSQL EF Core
var connectionString = builder.Configuration.GetConnectionString("PostgresDb");
builder.Services.AddDbContext<CargaMasivaDbContext>(options =>
    options.UseNpgsql(connectionString));

var jwtSettings = builder.Configuration.GetSection("JwtSettings");
var secretKey = jwtSettings["SecretKey"]
    ?? throw new InvalidOperationException("JwtSettings:SecretKey no está configurado.");

builder.Services.AddAuthentication(JwtBearerDefaults.AuthenticationScheme)
    .AddJwtBearer(options =>
    {
        options.TokenValidationParameters = new TokenValidationParameters
        {
            ValidateIssuer = true,
            ValidateAudience = true,
            ValidateLifetime = true,
            ValidateIssuerSigningKey = true,
            ValidIssuer = jwtSettings["Issuer"],
            ValidAudience = jwtSettings["Audience"],
            IssuerSigningKey = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(secretKey))
        };
    });

builder.Services.AddAuthorization();

// Servicios de aplicación
builder.Services.AddSingleton<S3Downloader>();
builder.Services.AddSingleton<INotificationPublisher, NotificationPublisher>();
builder.Services.AddScoped<ICargaArchivoRepository, CargaArchivoRepository>();
builder.Services.AddScoped<ICargaDetalleRepository, CargaDetalleRepository>();
builder.Services.AddScoped<IProcesadorCargaService, ProcesadorCargaService>();
builder.Services.AddScoped<ICargaDetalleService, CargaDetalleService>();

// Worker de procesamiento (BackgroundService)
builder.Services.AddHostedService<Worker>();

// Swagger
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen();

// Controladores
builder.Services.AddControllers();

var app = builder.Build();

// Auto-migración al arrancar (desactivado: la BD se inicializa con infra/init.sql)
using (var scope = app.Services.CreateScope())
{
    try
    {
        var db = scope.ServiceProvider.GetRequiredService<CargaMasivaDbContext>();
        // db.Database.Migrate();
    }
    catch (Exception ex)
    {
        app.Logger.LogWarning(ex, "No se pudo verificar la BD al iniciar CargaMasivaDbContext.");
    }
}

if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI();
}

app.UseMiddleware<GlobalExceptionMiddleware>();
app.UseAuthentication();
app.UseAuthorization();
app.MapControllers();
app.Run();
