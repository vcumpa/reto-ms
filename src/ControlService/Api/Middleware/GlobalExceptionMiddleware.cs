using Microsoft.AspNetCore.Mvc;

namespace ControlService.Api.Middleware;

public sealed class GlobalExceptionMiddleware(
    RequestDelegate next,
    ILogger<GlobalExceptionMiddleware> logger)
{
    public async Task InvokeAsync(HttpContext context)
    {
        try
        {
            await next(context);
        }
        catch (OperationCanceledException) when (context.RequestAborted.IsCancellationRequested)
        {
            logger.LogInformation("La solicitud {TraceId} fue cancelada por el cliente.", context.TraceIdentifier);
        }
        catch (Exception exception)
        {
            logger.LogError(exception, "Excepción no controlada en {Method} {Path}. TraceId: {TraceId}",
                context.Request.Method, context.Request.Path, context.TraceIdentifier);

            if (context.Response.HasStarted)
            {
                throw;
            }

            context.Response.Clear();
            context.Response.StatusCode = StatusCodes.Status500InternalServerError;
            context.Response.ContentType = "application/problem+json";

            await context.Response.WriteAsJsonAsync(new ProblemDetails
            {
                Status = StatusCodes.Status500InternalServerError,
                Title = "Error interno del servidor.",
                Detail = "Ocurrió un error inesperado al procesar la solicitud.",
                Instance = context.Request.Path
            }, cancellationToken: context.RequestAborted);
        }
    }
}
