namespace AuthService.Application.Interfaces;

using AuthService.Application.DTOs;

public interface ILoginService
{
    Task<LoginResponse?> LoginAsync(LoginRequest request);

}
