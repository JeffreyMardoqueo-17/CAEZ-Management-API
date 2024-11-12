CREATE TRIGGER TR_AuditoriaAlumno
ON Alumno
AFTER INSERT, UPDATE, DELETE
AS
BEGIN
    SET NOCOUNT ON;

    DECLARE @Operacion NVARCHAR(10), @IdRegistro INT, @IdUsuario INT, @Detalles NVARCHAR(MAX);

    -- Auditoría para INSERT
    IF EXISTS (SELECT * FROM Inserted) AND NOT EXISTS (SELECT * FROM Deleted)
    BEGIN
        SET @Operacion = 'INSERT';

        INSERT INTO AuditoriaAlumno (FechaHora, IdUsuario, Operacion, IdRegistro, Detalles)
        SELECT 
            GETDATE(),
            i.IdAdministrador, -- ID del administrador que realiza la operación
            @Operacion,
            i.Id,
            CONCAT(
                'Nombre: ', QUOTENAME(i.Nombre, '"'),
                ', Apellido: ', QUOTENAME(i.Apellido, '"'),
                ', FechaNacimiento: ', CONVERT(NVARCHAR, i.FechaNacimiento, 120),
                ', IdSexo: ', i.IdSexo,
                ', IdRole: ', i.IdRole,
                ', IdGrado: ', i.IdGrado,
                ', IdTurno: ', i.IdTurno,
                ', IdEncargado: ', i.IdEncargado,
                ', IdTipoDocumento: ', i.IdTipoDocumento,
                ', NumDocumento: ', QUOTENAME(i.NumDocumento, '"'),
                ', EsBecado: ', i.EsBecado,
                ', IdPadrino: ', COALESCE(CONVERT(NVARCHAR, i.IdPadrino), 'NULL')  -- Usa COALESCE para manejar NULL
            ) AS Detalles
        FROM Inserted i;
    END

    -- Auditoría para UPDATE
    IF EXISTS (SELECT * FROM Inserted) AND EXISTS (SELECT * FROM Deleted)
    BEGIN
        SET @Operacion = 'UPDATE';

        INSERT INTO AuditoriaAlumno (FechaHora, IdUsuario, Operacion, IdRegistro, Detalles)
        SELECT 
            GETDATE(),
            i.IdAdministrador, -- ID del administrador que realiza la operación
            @Operacion,
            i.Id,
            CONCAT(
                'Antiguo -> Nombre: ', QUOTENAME(d.Nombre, '"'),
                ', Apellido: ', QUOTENAME(d.Apellido, '"'),
                ', FechaNacimiento: ', CONVERT(NVARCHAR, d.FechaNacimiento, 120),
                ', IdSexo: ', d.IdSexo,
                ', IdRole: ', d.IdRole,
                ', IdGrado: ', d.IdGrado,
                ', IdTurno: ', d.IdTurno,
                ', IdEncargado: ', d.IdEncargado,
                ', IdTipoDocumento: ', d.IdTipoDocumento,
                ', NumDocumento: ', QUOTENAME(d.NumDocumento, '"'),
                ', EsBecado: ', d.EsBecado,
                ', IdPadrino: ', COALESCE(CONVERT(NVARCHAR, d.IdPadrino), 'NULL'), -- Valor anterior de IdPadrino
                ' | Nuevo -> Nombre: ', QUOTENAME(i.Nombre, '"'),
                ', Apellido: ', QUOTENAME(i.Apellido, '"'),
                ', FechaNacimiento: ', CONVERT(NVARCHAR, i.FechaNacimiento, 120),
                ', IdSexo: ', i.IdSexo,
                ', IdRole: ', i.IdRole,
                ', IdGrado: ', i.IdGrado,
                ', IdTurno: ', i.IdTurno,
                ', IdEncargado: ', i.IdEncargado,
                ', IdTipoDocumento: ', i.IdTipoDocumento,
                ', NumDocumento: ', QUOTENAME(i.NumDocumento, '"'),
                ', EsBecado: ', i.EsBecado,
                ', IdPadrino: ', COALESCE(CONVERT(NVARCHAR, i.IdPadrino), 'NULL') -- Valor nuevo de IdPadrino
            ) AS Detalles
        FROM Inserted i
        INNER JOIN Deleted d ON i.Id = d.Id;
    END

    -- Auditoría para DELETE
    IF NOT EXISTS (SELECT * FROM Inserted) AND EXISTS (SELECT * FROM Deleted)
    BEGIN
        SET @Operacion = 'DELETE';

        INSERT INTO AuditoriaAlumno (FechaHora, IdUsuario, Operacion, IdRegistro, Detalles)
        SELECT 
            GETDATE(),
            d.IdAdministrador, -- ID del administrador que realiza la operación
            @Operacion,
            d.Id,
            CONCAT(
                'Nombre: ', QUOTENAME(d.Nombre, '"'),
                ', Apellido: ', QUOTENAME(d.Apellido, '"'),
                ', FechaNacimiento: ', CONVERT(NVARCHAR, d.FechaNacimiento, 120),
                ', IdSexo: ', d.IdSexo,
                ', IdRole: ', d.IdRole,
                ', IdGrado: ', d.IdGrado,
                ', IdTurno: ', d.IdTurno,
                ', IdEncargado: ', d.IdEncargado,
                ', IdTipoDocumento: ', d.IdTipoDocumento,
                ', NumDocumento: ', QUOTENAME(d.NumDocumento, '"'),
                ', EsBecado: ', d.EsBecado,
                ', IdPadrino: ', COALESCE(CONVERT(NVARCHAR, d.IdPadrino), 'NULL') -- Manejo de NULL para IdPadrino
            ) AS Detalles
        FROM Deleted d;
    END
END;
GO
