-- -------------------------
-- TABLA TipoPago
-- -- TABLA TipoPago
-- CREATE TABLE TipoPago(
--     Id INT NOT NULL PRIMARY KEY IDENTITY (1,1),
--     Nombre VARCHAR(80) NOT NULL
-- );
-- GO
-- -------------------------

-- Stored Procedure para Crear TipoPago
CREATE PROCEDURE SPTipoPagosCreate
    @Nombre VARCHAR(80)
AS
BEGIN
    -- Inserta un nuevo tipo de pago
    INSERT INTO TipoPago (Nombre)
    VALUES (@Nombre);

    -- Devuelve el Id del registro recién insertado
    SELECT SCOPE_IDENTITY() AS Id;
END;
GO

-- Stored Procedure para Traer Todos los TipoPagos o un TipoPago por ID
CREATE PROCEDURE SPTipoPagosGet
    @Id INT = NULL -- Si @Id es NULL, devolverá todos los tipos de pagos
AS
BEGIN
    IF @Id IS NULL
    BEGIN
        -- Devuelve todos los tipos de pagos
        SELECT * FROM TipoPago;
    END
    ELSE
    BEGIN
        -- Devuelve el tipo de pago con el Id especificado
        SELECT * FROM TipoPago WHERE Id = @Id;
    END
END;
GO

-- Stored Procedure para Traer TipoPago por ID
CREATE PROCEDURE SPGetTipoPagosPorId
    @Id INT
AS
BEGIN
    -- Devuelve el tipo de pago con el Id especificado
    SELECT * FROM TipoPago
    WHERE Id = @Id;
END;
GO

-- Stored Procedure para Actualizar TipoPago
CREATE PROCEDURE SPTipoPagosUpdate
    @Id INT,
    @Nombre VARCHAR(80)
AS
BEGIN
    -- Actualiza el tipo de pago con el Id especificado
    UPDATE TipoPago
    SET Nombre = @Nombre
    WHERE Id = @Id;
    
    -- Devuelve el registro actualizado
    SELECT * FROM TipoPago WHERE Id = @Id;
END;
GO

-- Stored Procedure para Eliminar TipoPago
CREATE PROCEDURE SPTipoPagosDelete
    @Id INT
AS
BEGIN
    -- Elimina el tipo de pago con el Id especificado
    DELETE FROM TipoPago
    WHERE Id = @Id;
END;
GO
