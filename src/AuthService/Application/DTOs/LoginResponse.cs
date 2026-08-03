namespace AuthService.Application.DTOs;

public record LoginResponse(string Token, string Usuario, string TokenType, DateTime Expiration);