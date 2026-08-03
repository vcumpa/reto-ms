using Microsoft.EntityFrameworkCore;
using NotificationsService.Domain.Entities;

namespace NotificationsService.Infraestructure;

public class NotificationsDbContext : DbContext
{
    public NotificationsDbContext(DbContextOptions<NotificationsDbContext> options) : base(options)
    {
    }

    public DbSet<CargaArchivoEntity> CargaArchivo => Set<CargaArchivoEntity>();

    protected override void OnModelCreating(ModelBuilder modelBuilder)
    {
        base.OnModelCreating(modelBuilder);

        modelBuilder.Entity<CargaArchivoEntity>().ToTable("CargaArchivo");
    }
}
