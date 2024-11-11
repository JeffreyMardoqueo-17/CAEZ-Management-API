-- sp para obtener todos los registros
CREATE PROCEDURE SPAuditoriaEncargadoGetAll
AS
BEGIN
    SET NOCOUNT ON;
    SELECT AE.Id,
           AE.FechaHora,
           AE.IdUsuario,
           U.Nombre AS UsuarioNombre,  -- Suponiendo que existe una tabla de Usuarios
           AE.Operacion,
           AE.IdRegistro,
           AE.Detalles
    FROM AuditoriaEncargado AE
    INNER JOIN Usuarios U ON AE.IdUsuario = U.Id -- Relaciona con la tabla Usuarios si existe
    ORDER BY AE.FechaHora DESC;
END;
GO


-- sp para obtener por fechas rangos de fechas como semnas, meses, años
CREATE PROCEDURE SPAuditoriaEncargadoGetByDateRange
    @StartDate DATETIME,
    @EndDate DATETIME
AS
BEGIN
    SET NOCOUNT ON;
    SELECT AE.Id,
           AE.FechaHora,
           AE.IdUsuario,
           U.Nombre AS UsuarioNombre,  -- Suponiendo que existe una tabla de Usuarios
           AE.Operacion,
           AE.IdRegistro,
           AE.Detalles
    FROM AuditoriaEncargado AE
    INNER JOIN Usuarios U ON AE.IdUsuario = U.Id -- Relaciona con la tabla Usuarios si existe
    WHERE AE.FechaHora BETWEEN @StartDate AND @EndDate
    ORDER BY AE.FechaHora DESC;
END;
GO
