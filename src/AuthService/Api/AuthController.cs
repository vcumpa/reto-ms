using Microsoft.AspNetCore.Mvc;
using AuthService.Application.DTOs;
using AuthService.Application.Interfaces;

[ApiController]
[Route("api/auth")]
public class AuthController : ControllerBase
{
    private readonly ILoginService _loginService;

    public AuthController(ILoginService authService)
    {
        _loginService = authService;
    }

    [HttpPost("login")]
    public async Task<IActionResult> Login(LoginRequest request)
    {
        if (string.IsNullOrWhiteSpace(request.Usuario) || string.IsNullOrWhiteSpace(request.Password))
        return BadRequest(new { mensaje = "Usuario y contraseña son obligatorios." });

        var loginResponse = await _loginService.LoginAsync(request);
        if (loginResponse is null)
            return Unauthorized(new { mensaje = "Credenciales inválidas." });

        return Ok(loginResponse);
    }
    
}
