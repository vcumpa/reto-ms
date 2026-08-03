namespace AuthService.Application.Interfaces;

using AuthService.Domain;

public interface IUsuarioRepository
{
    Task<UsuarioEntity?> GetByEmailAsync(string email);
    Task<UsuarioEntity?> GetByIdAsync(Int64 id);
    Task AddAsync(UsuarioEntity usuario);
    Task UpdateAsync(UsuarioEntity usuario);
}
