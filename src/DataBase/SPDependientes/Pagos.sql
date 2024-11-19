-- Tipo de tabla para manejar detalles de Pago
CREATE TYPE PagoDetalleType AS TABLE (
    IdTipoPago INT,
    IdMes INT NULL,
    Anio INT NULL,
    CantidadBase DECIMAL(10,2),
    PorcentajeDescuento DECIMAL(5,2),
    MultaRetrazo DECIMAL(10,2),
    Descripcion VARCHAR(200)
);
GO
CREATE PROCEDURE CrearPago
    @IdAlumno INT,
    @FechaPago DATETIME,
    @TotalPagar DECIMAL(10,2),
    @IdAdministrador INT,
    @Descripcion VARCHAR(200),
    @DetallesPago PagoDetalleType READONLY
AS
BEGIN
    BEGIN TRANSACTION;
    BEGIN TRY
        -- Validar datos de entrada
        IF NOT EXISTS (SELECT 1 FROM Alumno WHERE Id = @IdAlumno)
        BEGIN
            THROW 51000, 'El alumno especificado no existe.', 1;
        END;

        -- Validar que la tabla de detalles no esté vacía
        IF NOT EXISTS (SELECT 1 FROM @DetallesPago)
        BEGIN
            THROW 51001, 'La tabla de detalles de pago está vacía.', 1;
        END;

        -- Insertar en la tabla Pago
        DECLARE @IdPago INT;
        INSERT INTO Pago (IdAlumno, FechaPago, TotalPagar, IdAdministrador, Descripcion, IdEstadoPago)
        VALUES (@IdAlumno, @FechaPago, @TotalPagar, @IdAdministrador, @Descripcion, 1); -- Estado inicial Pendiente
        SET @IdPago = SCOPE_IDENTITY();

        -- Insertar detalles en PagoDetalle
        INSERT INTO PagoDetalle (IdPago, IdTipoPago, IdMes, Anio, CantidadBase, PorcentajeDescuento, MultaRetrazo, Descripcion)
        SELECT 
            @IdPago, 
            IdTipoPago, 
            IdMes, 
            Anio, 
            CantidadBase, 
            PorcentajeDescuento, 
            MultaRetrazo, 
            Descripcion
        FROM @DetallesPago;

        -- Insertar en PagoMes cuando IdMes y Anio están definidos
        INSERT INTO PagoMes (IdPagoDetalle, IdMes, Anio, IdEstadoPago)
        SELECT 
            PD.Id AS IdPagoDetalle,
            PD.IdMes,
            PD.Anio,
            1 -- Estado inicial Pendiente
        FROM PagoDetalle PD
        WHERE PD.IdPago = @IdPago AND PD.IdMes IS NOT NULL AND PD.Anio IS NOT NULL;

        -- Validar que los detalles se hayan insertado correctamente
        IF NOT EXISTS (SELECT 1 FROM PagoDetalle WHERE IdPago = @IdPago)
        BEGIN
            THROW 51002, 'No se insertaron detalles de pago.', 1;
        END;

        -- Retornar el identificador del pago creado
        COMMIT TRANSACTION;
        SELECT @IdPago AS Id;
    END TRY
    BEGIN CATCH
        -- Manejo de errores: hacer rollback y devolver el error
        ROLLBACK TRANSACTION;
        DECLARE @ErrorMessage NVARCHAR(4000) = ERROR_MESSAGE();
        DECLARE @ErrorSeverity INT = ERROR_SEVERITY();
        DECLARE @ErrorState INT = ERROR_STATE();
        RAISERROR (@ErrorMessage, @ErrorSeverity, @ErrorState);
    END CATCH
END;

GO
CREATE PROCEDURE ConsultarPagos
AS
BEGIN
    SELECT 
        P.Id AS IdPago,
        P.FechaPago,
        P.TotalPagar,
        P.Descripcion AS DescripcionPago,
        EP.Nombre AS EstadoPago,
        A.Nombre AS AlumnoNombre,
        A.Apellido AS AlumnoApellido,
        CASE 
            WHEN A.EsBecado = 1 THEN 'Sí'
            ELSE 'No'
        END AS EsBecado,
        PA.Nombre AS PadrinoNombre,
        PA.Apellido AS PadrinoApellido,
        PD.Id AS IdPagoDetalle,
        TP.Nombre AS TipoPago,
        PD.CantidadBase,
        PD.PorcentajeDescuento,
        PD.MultaRetrazo,
        (PD.CantidadBase + PD.MultaRetrazo - (PD.CantidadBase * PD.PorcentajeDescuento / 100)) AS CantidadFinal,
        -- Manejo adecuado de los datos relacionados con meses
        ISNULL(PM.IdMes, NULL) AS IdMes,
        ISNULL(M.Nombre, 'Sin mes asociado') AS NombreMes,
        ISNULL(PM.Anio, NULL) AS Anio,
        ISNULL(EPM.Nombre, 'Sin estado de mes') AS EstadoMes
    FROM 
        Pago P
    JOIN 
        Alumno A ON P.IdAlumno = A.Id
    LEFT JOIN 
        Padrino PA ON A.IdPadrino = PA.Id
    JOIN 
        EstadoPago EP ON P.IdEstadoPago = EP.Id
    JOIN 
        PagoDetalle PD ON P.Id = PD.IdPago
    LEFT JOIN 
        TipoPago TP ON PD.IdTipoPago = TP.Id
    -- Relacionar detalles de meses cuando existen
    LEFT JOIN 
        PagoMes PM ON PD.Id = PM.IdPagoDetalle
    LEFT JOIN 
        Mes M ON PM.IdMes = M.Id
    LEFT JOIN 
        EstadoPago EPM ON PM.IdEstadoPago = EPM.Id
    ORDER BY 
        P.FechaPago DESC, PM.Anio, PM.IdMes;
END;
GO

CREATE PROCEDURE ActualizarPago
    @IdPago INT,
    @FechaPago DATETIME,
    @TotalPagar DECIMAL(10,2),
    @Descripcion VARCHAR(200),
    @DetallesPago PagoDetalleType READONLY
AS
BEGIN
    BEGIN TRANSACTION;
    BEGIN TRY
        -- Actualizar información general del pago
        UPDATE Pago
        SET FechaPago = @FechaPago,
            TotalPagar = @TotalPagar,
            Descripcion = @Descripcion
        WHERE Id = @IdPago;

        -- Actualizar detalles del pago
        DELETE FROM PagoDetalle WHERE IdPago = @IdPago; -- Eliminar detalles previos
        INSERT INTO PagoDetalle (IdPago, IdTipoPago, IdMes, Anio, CantidadBase, PorcentajeDescuento, MultaRetrazo, Descripcion)
        SELECT @IdPago, IdTipoPago, IdMes, Anio, CantidadBase, PorcentajeDescuento, MultaRetrazo, Descripcion
        FROM @DetallesPago;

        COMMIT TRANSACTION;
    END TRY
    BEGIN CATCH
        ROLLBACK TRANSACTION;
        THROW;
    END CATCH
END;
GO

CREATE PROCEDURE AnularPago
    @IdPago INT
AS
BEGIN
    BEGIN TRANSACTION;
    BEGIN TRY
        -- Actualizar el estado del pago a anulado
        UPDATE Pago
        SET EsAnulado = 1,
            FechaAnulacion = GETDATE(),
            IdEstadoPago = 4 -- Suponiendo que 4 es "Anulado"
        WHERE Id = @IdPago;

        -- Actualizar los meses relacionados
        UPDATE PM
        SET IdEstadoPago = 4 -- Estado "Anulado"
        FROM PagoMes PM
        JOIN PagoDetalle PD ON PM.IdPagoDetalle = PD.Id
        WHERE PD.IdPago = @IdPago;

        COMMIT TRANSACTION;
    END TRY
    BEGIN CATCH
        ROLLBACK TRANSACTION;
        THROW;
    END CATCH
END;
GO



---------------PARA LOS ALUMNOS 
CREATE PROCEDURE ObtenerPagosPorNumDocumento
    @NumDocumento NVARCHAR(50)
AS
BEGIN
    SET NOCOUNT ON;

    -- Verificar que el alumno exista
    IF NOT EXISTS (SELECT 1 FROM Alumno WHERE NumDocumento = @NumDocumento)
    BEGIN
        THROW 51000, 'No se encontró un alumno con el número de documento proporcionado.', 1;
    END

    SELECT 
        P.Id AS IdPago,
        P.FechaPago,
        P.TotalPagar,
        P.Descripcion AS DescripcionPago,
        EP.Nombre AS EstadoPago,
        A.Nombre AS AlumnoNombre,
        A.Apellido AS AlumnoApellido,
        CASE 
            WHEN A.EsBecado = 1 THEN 'Sí'
            ELSE 'No'
        END AS EsBecado,
        PA.Nombre AS PadrinoNombre,
        PA.Apellido AS PadrinoApellido,
        PD.Id AS IdPagoDetalle,
        TP.Nombre AS TipoPago,
        PD.CantidadBase,
        PD.PorcentajeDescuento,
        PD.MultaRetrazo,
        (PD.CantidadBase + PD.MultaRetrazo - (PD.CantidadBase * PD.PorcentajeDescuento / 100)) AS CantidadFinal,
        -- Manejo adecuado de los datos relacionados con meses
        ISNULL(PM.IdMes, NULL) AS IdMes,
        ISNULL(M.Nombre, 'Sin mes asociado') AS NombreMes,
        ISNULL(PM.Anio, NULL) AS Anio,
        ISNULL(EPM.Nombre, 'Sin estado de mes') AS EstadoMes
    FROM 
        Pago P
    JOIN 
        Alumno A ON P.IdAlumno = A.Id
    LEFT JOIN 
        Padrino PA ON A.IdPadrino = PA.Id
    JOIN 
        EstadoPago EP ON P.IdEstadoPago = EP.Id
    JOIN 
        PagoDetalle PD ON P.Id = PD.IdPago
    LEFT JOIN 
        TipoPago TP ON PD.IdTipoPago = TP.Id
    -- Relacionar detalles de meses cuando existen
    LEFT JOIN 
        PagoMes PM ON PD.Id = PM.IdPagoDetalle
    LEFT JOIN 
        Mes M ON PM.IdMes = M.Id
    LEFT JOIN 
        EstadoPago EPM ON PM.IdEstadoPago = EPM.Id
    WHERE 
        A.NumDocumento = @NumDocumento
    ORDER BY 
        P.FechaPago DESC, PM.Anio, PM.IdMes;
END;
GO
