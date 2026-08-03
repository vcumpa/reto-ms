using ControlService.Application.Interfaces;
using ControlService.Domain.Enums;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

[ApiController]
[Route("api/cargas")]
public class CargaArchivoController : ControllerBase
{
    private readonly ICargaArchivoService _service;
    private readonly IConfiguration _config;

    public CargaArchivoController(ICargaArchivoService service, IConfiguration config)
    {
        _service = service;
        _config = config;
    }

    [Authorize(Roles = "Admin")]
    [HttpPost]
    public async Task<IActionResult> Cargar([FromForm] IFormFile archivo, [FromForm] int periodo)
    {
        var usuario = User.FindFirst(System.Security.Claims.ClaimTypes.Email)?.Value;
        if (string.IsNullOrEmpty(usuario)){
            return BadRequest(new { mensaje = "Usuario no autenticado." });
        }

        // 1. Validación de archivo
        if (archivo == null || archivo.Length == 0)
        {
            return BadRequest(new { mensaje = "Debe adjuntar un archivo válido." });
        }

        // 2. Validación de extensión (.xlsx)
        var extension = Path.GetExtension(archivo.FileName).ToLowerInvariant();
        if (extension != ".xlsx")
        {
            return BadRequest(new { mensaje = "Solo se permiten archivos con extensión .xlsx." });
        }

        // 2. Validación de tamaño máximo (default 10 MB)
        var maxSizeBytes = _config.GetValue<long>("UploadSettings:MaxFileSizeBytes", 10 * 1024 * 1024);
        if (archivo.Length > maxSizeBytes)
        {
            return BadRequest(new { mensaje = $"El archivo excede el tamaño máximo permitido ({maxSizeBytes / (1024 * 1024)} MB)." });
        }

        var resultado = await _service.ProcesarCargaAsync(archivo, periodo, usuario);

        if (resultado.Estado != EstadoCarga.Pendiente.ToString())
            return BadRequest(new { mensaje = resultado.Mensaje });

        return Accepted(resultado);
    }

    [Authorize(Roles = "Admin,Reader")]
    [HttpGet]
    public async Task<IActionResult> ObtenerCargas([FromForm] int periodo)
    {
        var cargas = await _service.ObtenerCargasAsync(periodo);
        return Ok(cargas);
    }

}
