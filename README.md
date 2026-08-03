# Reto Microservicios – Carga Masiva

## Descripción

Sistema de carga masiva de archivos Excel. El frontend permite iniciar sesión, subir archivos y consultar el historial y detalle de las cargas. El backend está compuesto por microservicios que autentican usuarios, registran y procesan la carga de forma asíncrona, almacenan la información y envían una notificación al finalizar.

Flujo principal: **Frontend → API Gateway → Control → RabbitMQ → Carga Masiva → Notificaciones**.

## Tecnologías

- Backend: ASP.NET 8, Entity Framework Core y JWT.
- Frontend: React, TypeScript y Vite.
- Infraestructura: Docker Compose, PostgreSQL, RabbitMQ, SeaweedFS y Mailpit.
- Mensajería y correo: RabbitMQ y MailKit.

## Requisitos previos

- Docker Desktop con Docker Compose.
- Postman para probar la API.
- Opcional para ejecución local sin contenedores: .NET SDK 8 y Node.js/npm.

La configuración de desarrollo se encuentra en los archivos `appsettings*.json`. Las variables básicas son:

- `ConnectionStrings__PostgresDb`
- `JwtSettings__SecretKey`, `JwtSettings__Issuer` y `JwtSettings__Audience`
- `RabbitMQ__HostName`, `RabbitMQ__UserName` y `RabbitMQ__Password`
- `SeaweedFS__ServiceUrl`, `SeaweedFS__AccessKey`, `SeaweedFS__SecretKey` y `SeaweedFS__BucketName`
- `Smtp__Host`, `Smtp__Port` y `Smtp__From`

> Para la demostración local, `docker-compose` ya incluye valores predeterminados para estas variables. Antes de desplegar en otro ambiente, reemplazar secretos, credenciales y cadenas de conexión.

## Ejecución

Desde la raíz del repositorio:

```bash
docker compose -f infra/docker-compose.yml up --build
```

Cuando los contenedores estén listos, abrir:

- Frontend: http://localhost:3000
- API Gateway: http://localhost:5000
- RabbitMQ Management: http://localhost:15672 (`guest` / `guest`)
- Mailpit (correos de prueba): http://localhost:8025
- SeaweedFS: http://localhost:9333

Para detener los servicios:

```bash
docker compose -f infra/docker-compose.yml down
```

### Puertos y endpoints principales

| Servicio | Puerto | Uso |
| --- | --- | --- |
| API Gateway | 5000 | `POST /api/auth/login`, `POST/GET /api/cargas`, `GET /api/detalle/{idCarga}` |
| AuthService | 5001 | Servicio de autenticación |
| ControlService | 5002 | Registro e inicio de cargas |
| CargaMasivaService | 5003 | Procesamiento y detalle de cargas |
| NotificationsService | 5004 | Consumidor de notificaciones |
| PostgreSQL | 5432 | Base de datos |
| RabbitMQ | 5672 / 15672 | AMQP / consola web |
| SeaweedFS | 9333 / 8080 / 8333 | Master / volumen / S3 |
| Mailpit | 1025 / 8025 | SMTP / consola web |

## Colección Postman

La colección está en [`postman/RetoMicroservicios.postman_collection.json`](postman/RetoMicroservicios.postman_collection.json).

1. En Postman, seleccionar **Import** y elegir el archivo de la colección.
2. Ejecutar `LoginAdmin` o `LoginReader`.
3. Copiar el campo `token` de la respuesta en la variable de colección `tkn`.
4. Usar `Cargar Archivo`, `Obtener Cargas por Periodo` y `Detalle Carga Excel` según corresponda.

Credenciales de prueba:

- Administrador: `admin@retoms.com` / `Admin123!` (puede cargar archivos).
- Lector: `vcumpa@retoms.com` / `Reader123!` (puede consultar cargas).

## Datos de prueba

Los archivos de ejemplo están en [`test-data`](test-data):

- `data202607.xlsx` — usar período `202607`.
- `data202608.xlsx` — usar período `202608`.

En la solicitud de carga, enviar el archivo como `archivo` (form-data) y el período como `periodo`.

## Video demostrativo

Pendiente de agregar. El video demostrará el inicio de sesión, la carga de un Excel, la consulta de su estado y la notificación en Mailpit.
