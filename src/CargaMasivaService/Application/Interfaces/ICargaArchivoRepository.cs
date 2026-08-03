using CargaMasivaService.Domain.Entities;
using CargaMasivaService.Domain.Enums;

namespace CargaMasivaService.Application.Interfaces;

public interface ICargaArchivoRepository
{
    Task<bool> ExisteCargaFinalizadaAsync(int idCarga, int periodo);
    Task<bool> ExisteCargaActivaAsync(int idCarga,int periodo);
    Task<CargaArchivoEntity?> ObtenerCargaAsync(int idCarga);
    Task ActualizarEstadoAsync(int idCarga, EstadoCarga estado, string observacion);
    Task FinalizarCargaAsync(int idCarga, string observacion);
    Task MarcarErrorAsync(int idCarga, string observacion);
}
