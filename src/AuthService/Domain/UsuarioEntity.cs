namespace  AuthService.Domain;

public enum AuthUserRole
{
    Admin,
    Reader
}

public class UsuarioEntity
{
    public int Id { get; set; }
    public string Email { get; set; } = string.Empty;
    public string PasswordHash { get; set; } = string.Empty;
    public bool IsActive { get; set; } = true;
    public string Rol { get; set; } = AuthUserRole.Reader.ToString();
    public DateTime FechaRegistro { get; set; } = DateTime.UtcNow;
}