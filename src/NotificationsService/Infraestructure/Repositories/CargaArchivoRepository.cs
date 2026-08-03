namespace NotificationsService.Infraestructure.Repositories;

using Microsoft.EntityFrameworkCore;
using NotificationsService.Application.Interfaces;
using NotificationsService.Domain.Entities;
using NotificationsService.Domain.Enums;


public class CargaArchivoRepository : ICargaArchivoRepository
{
    private readonly NotificationsDbContext _context;

    public CargaArchivoRepository(NotificationsDbContext context)
    {
        _context = context;
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

}
