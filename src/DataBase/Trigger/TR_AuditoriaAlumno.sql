CREATE TRIGGER TR_AuditoriaAlumno
ON Alumno
AFTER INSERT, UPDATE, DELETE
AS
BEGIN
    SET NOCOUNT ON;

    -- Detectar el tipo de operación
    DECLARE @Operacion NVARCHAR(10);

    IF EXISTS (SELECT 1 FROM Inserted) AND EXISTS (SELECT 1 FROM Deleted)
        SET @Operacion = 'UPDATE';
    ELSE IF EXISTS (SELECT 1 FROM Inserted)
        SET @Operacion = 'INSERT';
    ELSE IF EXISTS (SELECT 1 FROM Deleted)
        SET @Operacion = 'DELETE';

    -- INSERT: Registrar nuevos registros
    IF @Operacion = 'INSERT'
    BEGIN
        INSERT INTO AuditoriaAlumno (FechaHora, IdUsuario, Operacion, IdRegistro, Detalles)
        SELECT 
            GETDATE(),
            i.IdAdministrador, -- Usuario que realizó la operación
            @Operacion,
            i.Id,
            (SELECT 
                'Operacion' AS TipoOperacion,
                GETDATE() AS FechaHora,
                i.IdAdministrador AS Usuario,
                (SELECT 
                    i.Nombre AS Nombre,
                    i.Apellido AS Apellido,
                    i.FechaNacimiento AS FechaNacimiento,
                    i.IdSexo AS Sexo,
                    i.IdRole AS Role,
                    i.IdGrado AS Grado,
                    i.IdTurno AS Turno,
                    i.IdEncargado AS Encargado,
                    i.IdTipoDocumento AS TipoDocumento,
                    i.NumDocumento AS NumeroDocumento,
                    i.EsBecado AS Becado,
                    COALESCE(i.IdPadrino, NULL) AS Padrino
                 FOR JSON PATH, WITHOUT_ARRAY_WRAPPER) AS Detalles
             FOR JSON PATH, WITHOUT_ARRAY_WRAPPER)
        FROM Inserted i;
    END

    -- UPDATE: Registrar cambios en los registros
    IF @Operacion = 'UPDATE'
    BEGIN
        INSERT INTO AuditoriaAlumno (FechaHora, IdUsuario, Operacion, IdRegistro, Detalles)
        SELECT 
            GETDATE(),
            i.IdAdministrador, -- Usuario que realizó la operación
            @Operacion,
            i.Id,
            (SELECT 
                'Operacion' AS TipoOperacion,
                GETDATE() AS FechaHora,
                i.IdAdministrador AS Usuario,
                (SELECT 
                    d.Nombre AS Antes,
                    i.Nombre AS Despues
                 FOR JSON PATH, WITHOUT_ARRAY_WRAPPER) AS Nombre,
                (SELECT 
                    d.Apellido AS Antes,
                    i.Apellido AS Despues
                 FOR JSON PATH, WITHOUT_ARRAY_WRAPPER) AS Apellido,
                (SELECT 
                    CONVERT(NVARCHAR, d.FechaNacimiento, 120) AS Antes,
                    CONVERT(NVARCHAR, i.FechaNacimiento, 120) AS Despues
                 FOR JSON PATH, WITHOUT_ARRAY_WRAPPER) AS FechaNacimiento,
                (SELECT 
                    d.IdGrado AS Antes,
                    i.IdGrado AS Despues
                 FOR JSON PATH, WITHOUT_ARRAY_WRAPPER) AS Grado,
                (SELECT 
                    d.IdTurno AS Antes,
                    i.IdTurno AS Despues
                 FOR JSON PATH, WITHOUT_ARRAY_WRAPPER) AS Turno,
                (SELECT 
                    d.NumDocumento AS Antes,
                    i.NumDocumento AS Despues
                 FOR JSON PATH, WITHOUT_ARRAY_WRAPPER) AS NumeroDocumento,
                (SELECT 
                    d.EsBecado AS Antes,
                    i.EsBecado AS Despues
                 FOR JSON PATH, WITHOUT_ARRAY_WRAPPER) AS Becado
             FOR JSON PATH, WITHOUT_ARRAY_WRAPPER)
        FROM Inserted i
        INNER JOIN Deleted d ON i.Id = d.Id;
    END

    -- DELETE: Registrar eliminación de registros
    IF @Operacion = 'DELETE'
    BEGIN
        INSERT INTO AuditoriaAlumno (FechaHora, IdUsuario, Operacion, IdRegistro, Detalles)
        SELECT 
            GETDATE(),
            d.IdAdministrador, -- Usuario que realizó la operación
            @Operacion,
            d.Id,
            (SELECT 
                'Operacion' AS TipoOperacion,
                GETDATE() AS FechaHora,
                d.IdAdministrador AS Usuario,
                (SELECT 
                    d.Nombre AS Nombre,
                    d.Apellido AS Apellido,
                    d.FechaNacimiento AS FechaNacimiento,
                    d.IdSexo AS Sexo,
                    d.IdRole AS Role,
                    d.IdGrado AS Grado,
                    d.IdTurno AS Turno,
                    d.IdEncargado AS Encargado,
                    d.IdTipoDocumento AS TipoDocumento,
                    d.NumDocumento AS NumeroDocumento,
                    d.EsBecado AS Becado,
                    COALESCE(d.IdPadrino, NULL) AS Padrino
                 FOR JSON PATH, WITHOUT_ARRAY_WRAPPER) AS Detalles
             FOR JSON PATH, WITHOUT_ARRAY_WRAPPER)
        FROM Deleted d;
    END
END;
GO
