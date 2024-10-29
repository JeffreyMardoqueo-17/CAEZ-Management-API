CREATE TRIGGER TR_AuditPagoAllActions
ON Pago
AFTER INSERT, UPDATE, DELETE
AS
BEGIN
    SET NOCOUNT ON;

    DECLARE @IdUsuario INT, @IdRegistro INT, @Tabla NVARCHAR(50), @Operacion NVARCHAR(10), @DatosAnteriores NVARCHAR(MAX), @DatosNuevos NVARCHAR(MAX);
    SET @Tabla = 'Pago';

    -- Auditoría para INSERT
    IF EXISTS (SELECT * FROM Inserted) AND NOT EXISTS (SELECT * FROM Deleted)
    BEGIN
        SET @Operacion = 'INSERT';

        DECLARE curInsert CURSOR FOR
        SELECT 
            i.Id AS IdRegistro,
            i.IdAdministrador AS IdUsuario,
            NULL AS DatosAnteriores,
            CONCAT(
                'Descripcion: ', QUOTENAME(i.Descripcion, '"'),
                ', IdEstadoPago: ', QUOTENAME(CAST(i.IdEstadoPago AS NVARCHAR), '"'),
                ', MultaRetrazo: ', QUOTENAME(CAST(i.MultaRetrazo AS NVARCHAR), '"'),
                ', PorcentajeDescuento: ', QUOTENAME(CAST(i.PorcentajeDescuento AS NVARCHAR), '"')
            ) AS DatosNuevos
        FROM Inserted i;

        OPEN curInsert;
        FETCH NEXT FROM curInsert INTO @IdRegistro, @IdUsuario, @DatosAnteriores, @DatosNuevos;
        WHILE @@FETCH_STATUS = 0
        BEGIN
            INSERT INTO AuditLog (FechaHora, IdUsuario, Tabla, Operacion, IdRegistro, DatosAnteriores, DatosNuevos)
            VALUES (GETDATE(), @IdUsuario, @Tabla, @Operacion, @IdRegistro, @DatosAnteriores, @DatosNuevos);

            FETCH NEXT FROM curInsert INTO @IdRegistro, @IdUsuario, @DatosAnteriores, @DatosNuevos;
        END;
        CLOSE curInsert;
        DEALLOCATE curInsert;
    END

    -- Auditoría para UPDATE
    IF EXISTS (SELECT * FROM Inserted) AND EXISTS (SELECT * FROM Deleted)
    BEGIN
        SET @Operacion = 'UPDATE';

        DECLARE curUpdate CURSOR FOR
        SELECT 
            i.Id AS IdRegistro,
            i.IdAdministrador AS IdUsuario,
            CONCAT(
                'Descripcion: ', QUOTENAME(d.Descripcion, '"'),
                ', IdEstadoPago: ', QUOTENAME(CAST(d.IdEstadoPago AS NVARCHAR), '"'),
                ', MultaRetrazo: ', QUOTENAME(CAST(d.MultaRetrazo AS NVARCHAR), '"'),
                ', PorcentajeDescuento: ', QUOTENAME(CAST(d.PorcentajeDescuento AS NVARCHAR), '"')
            ) AS DatosAnteriores,
            CONCAT(
                'Descripcion: ', QUOTENAME(i.Descripcion, '"'),
                ', IdEstadoPago: ', QUOTENAME(CAST(i.IdEstadoPago AS NVARCHAR), '"'),
                ', MultaRetrazo: ', QUOTENAME(CAST(i.MultaRetrazo AS NVARCHAR), '"'),
                ', PorcentajeDescuento: ', QUOTENAME(CAST(i.PorcentajeDescuento AS NVARCHAR), '"')
            ) AS DatosNuevos
        FROM Inserted i
        INNER JOIN Deleted d ON i.Id = d.Id
        WHERE 
            (ISNULL(i.Descripcion, '') <> ISNULL(d.Descripcion, ''))
            OR (ISNULL(i.IdEstadoPago, 0) <> ISNULL(d.IdEstadoPago, 0))
            OR (ISNULL(i.MultaRetrazo, 0) <> ISNULL(d.MultaRetrazo, 0))
            OR (ISNULL(i.PorcentajeDescuento, 0) <> ISNULL(d.PorcentajeDescuento, 0));

        OPEN curUpdate;
        FETCH NEXT FROM curUpdate INTO @IdRegistro, @IdUsuario, @DatosAnteriores, @DatosNuevos;
        WHILE @@FETCH_STATUS = 0
        BEGIN
            INSERT INTO AuditLog (FechaHora, IdUsuario, Tabla, Operacion, IdRegistro, DatosAnteriores, DatosNuevos)
            VALUES (GETDATE(), @IdUsuario, @Tabla, @Operacion, @IdRegistro, @DatosAnteriores, @DatosNuevos);

            FETCH NEXT FROM curUpdate INTO @IdRegistro, @IdUsuario, @DatosAnteriores, @DatosNuevos;
        END;
        CLOSE curUpdate;
        DEALLOCATE curUpdate;
    END

    -- Auditoría para DELETE
    IF NOT EXISTS (SELECT * FROM Inserted) AND EXISTS (SELECT * FROM Deleted)
    BEGIN
        SET @Operacion = 'DELETE';

        DECLARE curDelete CURSOR FOR
        SELECT 
            d.Id AS IdRegistro,
            d.IdAdministrador AS IdUsuario,
            CONCAT(
                'Descripcion: ', QUOTENAME(d.Descripcion, '"'),
                ', IdEstadoPago: ', QUOTENAME(CAST(d.IdEstadoPago AS NVARCHAR), '"'),
                ', MultaRetrazo: ', QUOTENAME(CAST(d.MultaRetrazo AS NVARCHAR), '"'),
                ', PorcentajeDescuento: ', QUOTENAME(CAST(d.PorcentajeDescuento AS NVARCHAR), '"')
            ) AS DatosAnteriores,
            NULL AS DatosNuevos
        FROM Deleted d;

        OPEN curDelete;
        FETCH NEXT FROM curDelete INTO @IdRegistro, @IdUsuario, @DatosAnteriores, @DatosNuevos;
        WHILE @@FETCH_STATUS = 0
        BEGIN
            INSERT INTO AuditLog (FechaHora, IdUsuario, Tabla, Operacion, IdRegistro, DatosAnteriores, DatosNuevos)
            VALUES (GETDATE(), @IdUsuario, @Tabla, @Operacion, @IdRegistro, @DatosAnteriores, @DatosNuevos);

            FETCH NEXT FROM curDelete INTO @IdRegistro, @IdUsuario, @DatosAnteriores, @DatosNuevos;
        END;
        CLOSE curDelete;
        DEALLOCATE curDelete;
    END
END;
GO
