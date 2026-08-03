namespace ControlService.Application.Interfaces;

using ControlService.Application.DTOs;

public interface ICargaArchivoService
{
    Task<CargaArchivoResponseDto> ProcesarCargaAsync(IFormFile archivo, int periodo, string usuario);
    Task<IEnumerable<CargaArchivoResponseDto>> ObtenerCargasAsync(int periodo);
}
