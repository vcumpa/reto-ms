namespace ControlService.Infraestructure;

using ControlService.Domain.Entities;
using Microsoft.EntityFrameworkCore;

public class ControlDbContext : DbContext
{
    public ControlDbContext(DbContextOptions<ControlDbContext> options) : base(options) {}

    public DbSet<CargaArchivoEntity> CargaArchivo => Set<CargaArchivoEntity>();

    protected override void OnModelCreating(ModelBuilder modelBuilder)
    {
        base.OnModelCreating(modelBuilder);

         modelBuilder.Entity<CargaArchivoEntity>().ToTable("CargaArchivo");
    }
}
