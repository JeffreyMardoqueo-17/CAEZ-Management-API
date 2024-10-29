CREATE PROCEDURE SPPagoCreate
    @IdAlumno INT,
    @IdTipoPago INT,
    @Cantidad DECIMAL(10,2),
    @MultaRetrazo DECIMAL(10,2) = 0,
    @PorcentajeDescuento DECIMAL(5,2) = 0,
    @IdAdministrador INT,
    @Descripcion NVARCHAR(200),
    @IdEstadoPago INT = 1 -- Estado inicial: Pendiente
AS
BEGIN
    SET NOCOUNT ON;

    -- Inserta el pago en la tabla Pago
    INSERT INTO Pago (IdAlumno, FechaPago, IdTipoPago, Cantidad, MultaRetrazo, PorcentajeDescuento, IdAdministrador, Descripcion, IdEstadoPago)
    VALUES (@IdAlumno, GETDATE(), @IdTipoPago, @Cantidad, @MultaRetrazo, @PorcentajeDescuento, @IdAdministrador, @Descripcion, @IdEstadoPago);

    -- Devuelve el Id del pago recién insertado
    SELECT SCOPE_IDENTITY() AS IdPago;
END;
GO
CREATE PROCEDURE SPGetPagosAlumno
    @IdAlumno INT
AS
BEGIN
    SET NOCOUNT ON;

    -- Obtén todos los pagos del alumno con el desglose del tipo de pago, meses y estado
    SELECT 
        P.Id AS PagoId,
        TP.Nombre AS TipoPago,
        PM.Anio,
        M.Nombre AS Mes,
        P.FechaPago,
        P.Cantidad,
        P.MultaRetrazo,
        P.PorcentajeDescuento,
        P.TotalPagar,
        EP.Nombre AS EstadoPago
    FROM 
        Pago P
    INNER JOIN 
        TipoPago TP ON P.IdTipoPago = TP.Id
    LEFT JOIN 
        PagoMes PM ON P.Id = PM.IdPago
    LEFT JOIN 
        Mes M ON PM.IdMes = M.Id
    INNER JOIN 
        EstadoPago EP ON P.IdEstadoPago = EP.Id
    WHERE 
        P.IdAlumno = @IdAlumno;
END;
GO
CREATE PROCEDURE SPUpdatePagoRestriccion
    @IdPago INT,
    @Descripcion NVARCHAR(200) = NULL,
    @IdEstadoPago INT = NULL,
    @MultaRetrazo DECIMAL(10,2) = NULL,
    @PorcentajeDescuento DECIMAL(5,2) = NULL,
    @IdAdministrador INT = NULL
AS
BEGIN
    SET NOCOUNT ON;

    -- Comprueba si el pago existe
    IF EXISTS (SELECT 1 FROM Pago WHERE Id = @IdPago)
    BEGIN
        -- Actualiza solo los campos permitidos
        UPDATE Pago
        SET 
            Descripcion = COALESCE(@Descripcion, Descripcion),
            IdEstadoPago = COALESCE(@IdEstadoPago, IdEstadoPago),
            MultaRetrazo = COALESCE(@MultaRetrazo, MultaRetrazo),
            PorcentajeDescuento = COALESCE(@PorcentajeDescuento, PorcentajeDescuento),
            IdAdministrador = COALESCE(@IdAdministrador, IdAdministrador)
        WHERE 
            Id = @IdPago;

        -- Devuelve el registro actualizado
        SELECT * FROM Pago WHERE Id = @IdPago;
    END
    ELSE
    BEGIN
        -- Si el IdPago no existe, devuelve un mensaje de error
        RAISERROR('El pago con el Id especificado no existe.', 16, 1);
    END
END;
GO
CREATE PROCEDURE SPPagoDelete
    @IdPago INT
AS
BEGIN
    SET NOCOUNT ON;

    -- Elimina los registros de PagoMes relacionados
    DELETE FROM PagoMes WHERE IdPago = @IdPago;

    -- Elimina el registro de Pago
    DELETE FROM Pago WHERE Id = @IdPago;
END;
GO
