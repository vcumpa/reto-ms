namespace CargaMasivaService.Infraestructure.Repositories;

using CargaMasivaService.Application.Interfaces;
using CargaMasivaService.Domain.Entities;
using CargaMasivaService.Domain.Enums;
using CargaMasivaService.Infrastructure;
using Microsoft.EntityFrameworkCore;

public class CargaArchivoRepository : ICargaArchivoRepository
{
    private readonly CargaMasivaDbContext _context;

    public CargaArchivoRepository(CargaMasivaDbContext context)
    {
        _context = context;
    }

    public async Task<bool> ExisteCargaFinalizadaAsync(int idCarga,int periodo)
    {
        return await _context.CargaArchivo.AsNoTracking()
            .AnyAsync(c => c.Periodo == periodo && c.Id != idCarga &&
                        (c.Estado == EstadoCarga.Finalizado ||
                            c.Estado == EstadoCarga.Cargado ||
                            c.Estado == EstadoCarga.Notificado));
    }

    public async Task<bool> ExisteCargaActivaAsync(int idCarga, int periodo)
    {
        return await _context.CargaArchivo.AsNoTracking()
            .AnyAsync(c => c.Periodo == periodo && c.Id != idCarga &&
                        (c.Estado == EstadoCarga.Pendiente ||
                            c.Estado == EstadoCarga.EnProceso));
    }

    public async Task<CargaArchivoEntity?> ObtenerCargaAsync(int idCarga)
    {
        return await _context.CargaArchivo.AsNoTracking()
            .FirstOrDefaultAsync(c => c.Id == idCarga);
    }

    public async Task ActualizarEstadoAsync(int idCarga, EstadoCarga estado, string observacion)
    {
        var carga = await _context.CargaArchivo.FirstOrDefaultAsync(c => c.Id == idCarga);
        if (carga is null) return;

        carga.Estado = estado;
        carga.Observacion = observacion;
        await _context.SaveChangesAsync();
    }

    public async Task FinalizarCargaAsync(int idCarga, string observacion)
    {
        var carga = await _context.CargaArchivo.FirstOrDefaultAsync(c => c.Id == idCarga);
        if (carga is null) return;

        carga.Estado = EstadoCarga.Finalizado;
        carga.Observacion = observacion;
        carga.FechaFin = DateTime.UtcNow;
        await _context.SaveChangesAsync();
    }

    public async Task MarcarErrorAsync(int idCarga, string observacion)
    {
        var carga = await _context.CargaArchivo.FirstOrDefaultAsync(c => c.Id == idCarga);
        if (carga is null) return;

        carga.Estado = EstadoCarga.Rechazado;
        carga.FechaFin = DateTime.UtcNow;
        carga.Observacion = observacion;
        await _context.SaveChangesAsync();
    }

}
