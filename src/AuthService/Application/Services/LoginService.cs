namespace AuthService.Application.Services;

using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Text;
using AuthService.Application.DTOs;
using AuthService.Application.Interfaces;
using Microsoft.IdentityModel.Tokens;

public class LoginService : ILoginService
{
    private readonly IUsuarioRepository _usuarios;
    private readonly byte[] _keyBytes;
    private readonly int _expirationHours;
    private readonly string? _issuer;
    private readonly string? _audience;

    public LoginService(IUsuarioRepository usuarios, IConfiguration config)
    {
        _usuarios = usuarios;
        var secretKey = config["JwtSettings:SecretKey"]
                        ?? "SuperSecretKeyForRetoTecnicoSenior2026CasinoAtlanticCity!";
        _keyBytes = Encoding.UTF8.GetBytes(secretKey);

        _expirationHours = int.Parse(config["JwtSettings:ExpirationHours"] ?? "4");
        _issuer = config["JwtSettings:Issuer"];
        _audience = config["JwtSettings:Audience"];
    }

    public async Task<LoginResponse?> LoginAsync(LoginRequest request)
    {
        if (string.IsNullOrWhiteSpace(request.Usuario) || string.IsNullOrWhiteSpace(request.Password))
            return null;

        var user = await _usuarios.GetByEmailAsync(request.Usuario);
        if (user is null || !BCrypt.Net.BCrypt.Verify(request.Password, user.PasswordHash))
            return null;

        var tokenHandler = new JwtSecurityTokenHandler();
        var tokenDescriptor = new SecurityTokenDescriptor
        {
            Subject = new ClaimsIdentity(new[]
            {
                new Claim(ClaimTypes.NameIdentifier, user.Id.ToString()),
                new Claim(ClaimTypes.Email, user.Email),
                new Claim(ClaimTypes.Role, user.Rol.ToString())
            }),
            Expires = DateTime.UtcNow.AddHours(_expirationHours),
            Issuer = _issuer,
            Audience = _audience,
            SigningCredentials = new SigningCredentials(new SymmetricSecurityKey(_keyBytes), SecurityAlgorithms.HmacSha256Signature)
        };

        var token = tokenHandler.CreateToken(tokenDescriptor);
        var tokenString = tokenHandler.WriteToken(token);

        return new LoginResponse(tokenString, user.Email, "Bearer", DateTime.UtcNow.AddHours(_expirationHours));
    }
}


