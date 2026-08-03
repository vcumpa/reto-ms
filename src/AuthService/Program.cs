using AuthService.Application.Interfaces;
using AuthService.Application.Services;
using AuthService.Api.Middleware;
using AuthService.Infrastructure;
using AuthService.Infrastructure.Repositories;
using Microsoft.EntityFrameworkCore;

var builder = WebApplication.CreateBuilder(args);

// Configuración de PostgreSQL EF Core
var connectionString = builder.Configuration.GetConnectionString("PostgresDb");
builder.Services.AddDbContext<AuthDbContext>(options =>
    options.UseNpgsql(connectionString));


// Servicios de aplicación
builder.Services.AddScoped<IUsuarioRepository, UsuarioRepository>();
builder.Services.AddScoped<ILoginService, LoginService>();

// Swagger
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen();

// Controladores
builder.Services.AddControllers();

var app = builder.Build();

// Auto-migración al arrancar
using (var scope = app.Services.CreateScope())
{
    try
    {
        var db = scope.ServiceProvider.GetRequiredService<AuthDbContext>();
        // db.Database.Migrate();
    }
    catch (Exception ex)
    {
        app.Logger.LogWarning(ex, "No se pudo aplicar migraciones automáticas al iniciar AuthDbContext (posiblemente BD aún no lista en Docker).");
    }
}

if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI();
}

app.UseMiddleware<GlobalExceptionMiddleware>();
app.MapControllers();
app.Run();
