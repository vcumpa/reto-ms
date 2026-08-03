namespace CargaMasivaService.Infrastructure.Repositories;

using CargaMasivaService.Application.DTOs;
using CargaMasivaService.Application.Interfaces;
using CargaMasivaService.Domain.Entities;
using CargaMasivaService.Domain.Enums;
using CargaMasivaService.Infrastructure;
using Microsoft.EntityFrameworkCore;

public class CargaDetalleRepository : ICargaDetalleRepository
{
    private readonly CargaMasivaDbContext _context;

    public CargaDetalleRepository(CargaMasivaDbContext context)
    {
        _context = context;
    }

    public async Task<bool> ExisteCodigoProductoAsync(string codigoProducto)
    {
        return await _context.DataProcesada.AsNoTracking()
            .AnyAsync(d => d.CodigoProducto == codigoProducto);
    }

    public async Task<IEnumerable<CargaDetalleEntity>> ObtenerDetalleAsync(int idCarga)
    {
        return await _context.CargaDetalle.AsNoTracking()
            .Where(d => d.IdCargaArchivo == idCarga)
            .OrderBy(d => d.NumeroFila)
            .ToListAsync();
    }

    public async Task RegistrarDetalleAsync(CargaDetalleEntity detalle)
    {
        _context.CargaDetalle.Add(detalle);
        await _context.SaveChangesAsync();
    }

    public async Task RegistrarDataProcesadaAsync(DataProcesadaEntity data)
    {
        _context.DataProcesada.Add(data);
        await _context.SaveChangesAsync();
    }
}
