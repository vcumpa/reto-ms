namespace ControlService.Infraestructure.Repositories;

using ControlService.Application.Interfaces;
using ControlService.Domain.Entities;
using ControlService.Infraestructure;
using Microsoft.EntityFrameworkCore;

public class CargaArchivoRepository : ICargaArchivoRepository
{
    private readonly ControlDbContext _context;

    public CargaArchivoRepository(ControlDbContext context)
    {
        _context = context;
    }

    public async Task<int> RegistrarCargaAsync(CargaArchivoEntity carga)
    {
        _context.CargaArchivo.Add(carga);
        await _context.SaveChangesAsync();

        return carga.Id;
    }

    public async Task<IEnumerable<CargaArchivoEntity>> ObtenerCargasAsync(int periodo)
    {
        var query = _context.CargaArchivo.AsQueryable();

        if (periodo != 0)
        {
            query = query.Where(c => c.Periodo.ToString() == periodo.ToString());
        }

        return await query
            .OrderByDescending(c => c.FechaRegistro)
            .ToListAsync();
    }

}
