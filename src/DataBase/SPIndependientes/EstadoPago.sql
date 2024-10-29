CREATE PROCEDURE SPGetEstadoPago
AS
BEGIN
    SELECT Id, Nombre
    FROM EstadoPago;
END;
GO
CREATE PROCEDURE SPGetByIdEstadoPago
    @Id INT
AS
BEGIN
    -- Verificar si el registro existe antes de intentar seleccionarlo
    IF EXISTS (SELECT 1 FROM EstadoPago WHERE Id = @Id)
    BEGIN
        SELECT Id, Nombre
        FROM EstadoPago
        WHERE Id = @Id;
    END
    ELSE
    BEGIN
        -- Si no existe el registro, retornar un mensaje de error o un código
        RAISERROR('Estado Pago con el ID proporcionado no existe.', 16, 1);
    END
END;
GO
