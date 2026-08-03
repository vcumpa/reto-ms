namespace CargaMasivaService.Infrastructure;

using CargaMasivaService.Domain.Entities;
using Microsoft.EntityFrameworkCore;

public class CargaMasivaDbContext : DbContext
{
    public CargaMasivaDbContext(DbContextOptions<CargaMasivaDbContext> options) : base(options) { }

    public DbSet<CargaArchivoEntity> CargaArchivo => Set<CargaArchivoEntity>();
    public DbSet<CargaDetalleEntity> CargaDetalle => Set<CargaDetalleEntity>();
    public DbSet<DataProcesadaEntity> DataProcesada => Set<DataProcesadaEntity>();

    protected override void OnModelCreating(ModelBuilder modelBuilder)
    {
        base.OnModelCreating(modelBuilder);

        modelBuilder.Entity<CargaArchivoEntity>().ToTable("CargaArchivo");
        modelBuilder.Entity<CargaDetalleEntity>().ToTable("CargaDetalle");
        modelBuilder.Entity<DataProcesadaEntity>().ToTable("DataProcesada");
    }
}
