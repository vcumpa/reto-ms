using CargaMasivaService.Application.DTOs;

namespace CargaMasivaService.Application.Interfaces;

public interface IProcesadorCargaService
{
    Task ProcesarCargaAsync(CargaMasivaMessage mensaje);
}
