CREATE TRIGGER TR_AuditoriaEncargado
ON Encargado
AFTER INSERT, UPDATE, DELETE
AS
BEGIN
    SET NOCOUNT ON;

    DECLARE @Operacion NVARCHAR(10), @IdRegistro INT, @IdUsuario INT, @Detalles NVARCHAR(MAX);

    -- Auditoría para INSERT
    IF EXISTS (SELECT * FROM Inserted) AND NOT EXISTS (SELECT * FROM Deleted)
    BEGIN
        SET @Operacion = 'INSERT';

        INSERT INTO AuditoriaEncargado (FechaHora, IdUsuario, Operacion, IdRegistro, Detalles)
        SELECT 
            GETDATE(),
            i.IdAdministrador, -- ID del usuario que realiza la operación
            @Operacion,
            i.Id,
            CONCAT(
                'Nombre: ', QUOTENAME(i.Nombre, '"'),
                ', Apellido: ', QUOTENAME(i.Apellido, '"'),
                ', Telefono: ', QUOTENAME(i.Telefono, '"'),
                ', Correo: ', QUOTENAME(i.Correo, '"'),
                ', IdDireccion: ', i.IdDireccion,
                ', IdRole: ', i.IdRole,
                ', IdParentezco: ', i.IdParentezco,
                ', IdTipoDocumento: ', i.IdTipoDocumento,
                ', NumDocumento: ', QUOTENAME(i.NumDocumento, '"')
            ) AS Detalles
        FROM Inserted i;
    END

    -- Auditoría para UPDATE
    IF EXISTS (SELECT * FROM Inserted) AND EXISTS (SELECT * FROM Deleted)
    BEGIN
        SET @Operacion = 'UPDATE';

        INSERT INTO AuditoriaEncargado (FechaHora, IdUsuario, Operacion, IdRegistro, Detalles)
        SELECT 
            GETDATE(),
            i.IdAdministrador, -- ID del usuario que esta loguead
            @Operacion,
            i.Id,
            CONCAT(
                'Antiguo -> Nombre: ', QUOTENAME(d.Nombre, '"'),
                ', Apellido: ', QUOTENAME(d.Apellido, '"'),
                ', Telefono: ', QUOTENAME(d.Telefono, '"'),
                ', Correo: ', QUOTENAME(d.Correo, '"'),
                ', IdDireccion: ', d.IdDireccion,
                ', IdRole: ', d.IdRole,
                ', IdParentezco: ', d.IdParentezco,
                ', IdTipoDocumento: ', d.IdTipoDocumento,
                ', NumDocumento: ', QUOTENAME(d.NumDocumento, '"'),
                ' | Nuevo -> Nombre: ', QUOTENAME(i.Nombre, '"'),
                ', Apellido: ', QUOTENAME(i.Apellido, '"'),
                ', Telefono: ', QUOTENAME(i.Telefono, '"'),
                ', Correo: ', QUOTENAME(i.Correo, '"'),
                ', IdDireccion: ', i.IdDireccion,
                ', IdRole: ', i.IdRole,
                ', IdParentezco: ', i.IdParentezco,
                ', IdTipoDocumento: ', i.IdTipoDocumento,
                ', NumDocumento: ', QUOTENAME(i.NumDocumento, '"')
            ) AS Detalles
        FROM Inserted i
        INNER JOIN Deleted d ON i.Id = d.Id;
    END

    -- Auditoría para DELETE
    IF NOT EXISTS (SELECT * FROM Inserted) AND EXISTS (SELECT * FROM Deleted)
    BEGIN
        SET @Operacion = 'DELETE';

        INSERT INTO AuditoriaEncargado (FechaHora, IdUsuario, Operacion, IdRegistro, Detalles)
        SELECT 
            GETDATE(),
            d.IdAdministrador, -- ID del usuario que realiza la operación
            @Operacion,
            d.Id,
            CONCAT(
                'Nombre: ', QUOTENAME(d.Nombre, '"'),
                ', Apellido: ', QUOTENAME(d.Apellido, '"'),
                ', Telefono: ', QUOTENAME(d.Telefono, '"'),
                ', Correo: ', QUOTENAME(d.Correo, '"'),
                ', IdDireccion: ', d.IdDireccion,
                ', IdRole: ', d.IdRole,
                ', IdParentezco: ', d.IdParentezco,
                ', IdTipoDocumento: ', d.IdTipoDocumento,
                ', NumDocumento: ', QUOTENAME(d.NumDocumento, '"')
            ) AS Detalles
        FROM Deleted d;
    END
END;
GO
