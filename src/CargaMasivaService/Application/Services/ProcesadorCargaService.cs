namespace CargaMasivaService.Application.Services;

using ExcelDataReader;
using CargaMasivaService.Application.DTOs;
using CargaMasivaService.Application.Interfaces;
using CargaMasivaService.Domain.Entities;
using CargaMasivaService.Domain.Enums;
using System.Globalization;

public class ProcesadorCargaService : IProcesadorCargaService
{
    private readonly S3Downloader _s3Downloader;
    private readonly ICargaArchivoRepository _cargaRepository;
    private readonly ICargaDetalleRepository _detalleRepository;
    private readonly INotificationPublisher _notificationPublisher;

    public ProcesadorCargaService(
        S3Downloader s3Downloader,
        ICargaArchivoRepository cargaRepository,
        ICargaDetalleRepository detalleRepository,
        INotificationPublisher notificationPublisher)
    {
        _s3Downloader = s3Downloader;
        _cargaRepository = cargaRepository;
        _detalleRepository = detalleRepository;
        _notificationPublisher = notificationPublisher;
        System.Text.Encoding.RegisterProvider(System.Text.CodePagesEncodingProvider.Instance);
    }

    public async Task ProcesarCargaAsync(CargaMasivaMessage mensaje)
    {
        try
        {
            var carga = await _cargaRepository.ObtenerCargaAsync(mensaje.IdCarga);
            if (carga is null)
                throw new InvalidOperationException($"No existe la carga {mensaje.IdCarga}.");

            if (await _cargaRepository.ExisteCargaFinalizadaAsync(mensaje.IdCarga, carga.Periodo))
            {
                await _cargaRepository.ActualizarEstadoAsync(mensaje.IdCarga, EstadoCarga.Rechazado,
                    $"Ya existe una carga finalizada para el periodo {carga.Periodo}.");
                return;
            }

            if (await _cargaRepository.ExisteCargaActivaAsync(mensaje.IdCarga, carga.Periodo))
            {
                await _cargaRepository.ActualizarEstadoAsync(mensaje.IdCarga, EstadoCarga.Bloqueado,
                    $"Ya existe una carga activa para el periodo {carga.Periodo}.");
                return;
            }

            await _cargaRepository.ActualizarEstadoAsync(mensaje.IdCarga, EstadoCarga.EnProceso, "Procesando archivo Excel.");

            using var excelStream = await _s3Downloader.DownloadFileAsync(mensaje.RutaStorage);
            using var reader = ExcelReaderFactory.CreateReader(excelStream);
            var result = reader.AsDataSet(new ExcelDataSetConfiguration
            {
                ConfigureDataTable = _ => new ExcelDataTableConfiguration { UseHeaderRow = true }
            });

            var table = result.Tables[0];
            var rows = new List<ExcelRowDto>();

            for (int i = 0; i < table.Rows.Count; i++)
            {
                var row = table.Rows[i];

                // 1. Validación si una fila está vacía no se procesa
                if (row.ItemArray.All(cell => cell is null || string.IsNullOrWhiteSpace(cell.ToString())))
                    continue;

                var periodo = row[0]?.ToString()?.Trim() ?? $"";
                var codigoProducto = row.ItemArray.Length > 1 ? row[1]?.ToString()?.Trim() ?? $"" : $"";
                var descripcion = row.ItemArray.Length > 2 ? row[2]?.ToString()?.Trim() ?? "" : "";

                string[] formatos = { "yyyy-MM", "yyyy/MM" };

                if (!DateTime.TryParseExact(periodo, formatos,
                    CultureInfo.InvariantCulture,
                    DateTimeStyles.None,
                    out var periodoDate))
                {
                    throw new FormatException($"Formato de periodo inválido en la fila {i + 2}.");
                }

                var periodoInt = int.Parse(periodoDate.ToString("yyyyMM"));

                rows.Add(new ExcelRowDto
                {
                    NumeroFila = i + 2,
                    Periodo = periodo,
                    PeriodoInt = periodoInt,
                    CodigoProducto = codigoProducto,
                    Descripcion = descripcion
                });
            }

            var resultado = await ProcesarFilasAsync(mensaje.IdCarga, rows);

            await _cargaRepository.FinalizarCargaAsync(
                mensaje.IdCarga,
                $"Filas válidas: {resultado.FilasValidas}; rechazadas/duplicadas: {resultado.FilasRechazadas}.");

            _notificationPublisher.PublicarNotificacion(mensaje.IdCarga, carga.Usuario);

        }
        catch (Exception ex)
        {
            await _cargaRepository.MarcarErrorAsync(mensaje.IdCarga, ex.Message);
            throw;
        }
    }

    private async Task<ProcesamientoResultado> ProcesarFilasAsync(int idCarga, IEnumerable<ExcelRowDto> filas)
    {
        var resultado = new ProcesamientoResultado();

        foreach (var fila in filas)
        {
            var detalle = new CargaDetalleEntity
            {
                IdCargaArchivo = idCarga,
                NumeroFila = fila.NumeroFila,
                CodigoProducto = fila.CodigoProducto,
                Periodo = fila.Periodo,
                Descripcion = fila.Descripcion,
                Estado = EstadoDetalleCarga.Procesado,
                Observacion = "Registro procesado correctamente",
                FechaRegistro = DateTime.UtcNow
            };

            resultado.FilasRecibidas++;

            // 2. Validación de código de producto vacío o duplicado
            if (string.IsNullOrWhiteSpace(fila.CodigoProducto))
            {
                detalle.Estado = EstadoDetalleCarga.Error;
                detalle.Observacion = "Código de producto vacío";
                resultado.FilasRechazadas++;
            }
            else
            {
                var existe = await _detalleRepository.ExisteCodigoProductoAsync(fila.CodigoProducto);
                if (existe)
                {
                    detalle.Estado = EstadoDetalleCarga.Existente;
                    detalle.Observacion = "Código de producto duplicado";
                    resultado.FilasRechazadas++;
                }
                else
                {
                    await _detalleRepository.RegistrarDataProcesadaAsync(new DataProcesadaEntity
                    {
                        IdCargaArchivo = idCarga,
                        CodigoProducto = fila.CodigoProducto,
                        Periodo = fila.PeriodoInt,
                        Descripcion = fila.Descripcion,
                        FechaProceso = DateTime.UtcNow
                    });
                    resultado.FilasValidas++;
                }
            }

            await _detalleRepository.RegistrarDetalleAsync(detalle);
        }

        return resultado;
    }
}
