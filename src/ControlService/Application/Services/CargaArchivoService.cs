namespace ControlService.Services;

using ControlService.Application.DTOs;
using ControlService.Application.Interfaces;
using ControlService.Domain.Entities;
using ControlService.Domain.Enums;

public class CargaArchivoService : ICargaArchivoService
{
    private readonly ICargaArchivoRepository _repository;
    private readonly IArchivoStorageService _storageService;
    private readonly IRabbitMqPublisher _publisher;

    public CargaArchivoService(ICargaArchivoRepository repository,
                               IArchivoStorageService storageService,
                               IRabbitMqPublisher publisher)
    {
        _repository = repository;
        _storageService = storageService;
        _publisher = publisher;
    }

    public async Task<CargaArchivoResponseDto> ProcesarCargaAsync(IFormFile archivo, int periodo, string usuario)
    {
        try
        {
            // 1. Subida a almacenamiento (SeaweedFS / S3)
            var rutaStorage = await _storageService.UploadFileAsync(archivo);

            // 2. Registro inicial con estado Pendiente
            var idCarga = await _repository.RegistrarCargaAsync(new CargaArchivoEntity
            {
                NombreArchivo = archivo.FileName,
                RutaStorage = rutaStorage,
                Usuario = usuario,
                Periodo = periodo,
                Estado = EstadoCarga.Pendiente,
                Observacion = "Carga inicial"
            });

            // 3. Publicar evento en RabbitMQ
            _publisher.PublicarEventoCarga(idCarga, rutaStorage, usuario);

            return new CargaArchivoResponseDto
            {
                IdCarga = idCarga,
                Usuario = usuario,
                Periodo = periodo,
                Estado = EstadoCarga.Pendiente.ToString(),
                Mensaje = "Archivo recibido, almacenado y encolado correctamente para su procesamiento."
            };
        }
        catch (Exception ex)
        {
            return new CargaArchivoResponseDto
            {
                IdCarga = 0,
                Usuario = usuario,
                Periodo = periodo,
                Estado = EstadoCarga.Rechazado.ToString(),
                Mensaje = $"Error al procesar la carga: {ex.Message}"
            };
        }
    }

    public async Task<IEnumerable<CargaArchivoResponseDto>> ObtenerCargasAsync(int periodo)
    {
        var cargas = await _repository.ObtenerCargasAsync(periodo);

        return cargas.Select(c => new CargaArchivoResponseDto
        {
            IdCarga = c.Id,
            Usuario = c.Usuario,
            Periodo = c.Periodo,
            Estado = c.Estado.ToString(),
            Mensaje = c.Observacion ?? string.Empty
        });
    }

}
