namespace CargaMasivaService.Controllers;

using CargaMasivaService.Application.Interfaces;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

[ApiController]
[Route("api")]
public class CargaDetalleController : ControllerBase
{
    private readonly ICargaDetalleService _queryService;

    public CargaDetalleController(ICargaDetalleService queryService)
    {
        _queryService = queryService;
    }

    [Authorize(Roles = "Admin,Reader")]
    [HttpGet("detalle/{idCarga:int}")]
    public async Task<IActionResult> ObtenerContenidoExcel(int idCarga)
    {
        var contenido = await _queryService.ObtenerContenidoAsync(idCarga);
        return Ok(contenido);
    }
}
