namespace AuthService.Infrastructure.Repositories;

using AuthService.Application.Interfaces;
using AuthService.Domain;
using Microsoft.EntityFrameworkCore;

public class UsuarioRepository : IUsuarioRepository
{
    private readonly AuthDbContext _db;

    public UsuarioRepository(AuthDbContext db)
    {
        _db = db;
    }

    public async Task<UsuarioEntity?> GetByEmailAsync(string email)
    {
        return await _db.Usuarios
            .FirstOrDefaultAsync(u => u.Email.ToLower() == email.ToLower() && u.IsActive);
    }

    public async Task<UsuarioEntity?> GetByIdAsync(Int64 id)
    {
        return await _db.Usuarios.FirstOrDefaultAsync(u => u.Id == id && u.IsActive);
    }

    public async Task AddAsync(UsuarioEntity usuario)
    {
        await _db.Usuarios.AddAsync(usuario);
        await _db.SaveChangesAsync();
    }

    public async Task UpdateAsync(UsuarioEntity usuario)
    {
        _db.Usuarios.Update(usuario);
        await _db.SaveChangesAsync();
    }
}
