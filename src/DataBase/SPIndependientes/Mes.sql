-- -------------------------
-- TABLA Mes
-- TABLA Mes
-- CREATE TABLE Mes(
--     Id INT NOT NULL PRIMARY KEY IDENTITY (1,1),
--     Nombre VARCHAR(50) NOT NULL
-- );
-- GO
-- -------------------------

-- Stored Procedure para Crear Mes
CREATE PROCEDURE SPMesCreate
    @Nombre VARCHAR(50)
AS
BEGIN
    -- Inserta un nuevo registro en la tabla Mes
    INSERT INTO Mes (Nombre)
    VALUES (@Nombre);

    -- Devuelve el Id del registro recién insertado
    SELECT SCOPE_IDENTITY() AS Id;
END;
GO

-- Stored Procedure para Traer Todos los Meses o un Mes por ID
CREATE PROCEDURE SPMesGet
    @Id INT = NULL -- Si @Id es NULL, devolverá todos los meses
AS
BEGIN
    IF @Id IS NULL
    BEGIN
        -- Devuelve todos los registros de Mes
        SELECT * FROM Mes;
    END
    ELSE
    BEGIN
        -- Devuelve el registro de Mes con el Id especificado
        SELECT * FROM Mes WHERE Id = @Id;
    END
END;
GO

-- Stored Procedure para Traer Mes por ID
CREATE PROCEDURE SPGetMesPorId
    @Id INT
AS
BEGIN
    -- Devuelve el registro de Mes con el Id especificado
    SELECT * FROM Mes
    WHERE Id = @Id;
END;
GO

-- Stored Procedure para Actualizar Mes
CREATE PROCEDURE SPMesUpdate
    @Id INT,
    @Nombre VARCHAR(50)
AS
BEGIN
    -- Actualiza el registro de Mes con el Id especificado
    UPDATE Mes
    SET Nombre = @Nombre
    WHERE Id = @Id;
    
    -- Devuelve el registro actualizado
    SELECT * FROM Mes WHERE Id = @Id;
END;
GO

-- Stored Procedure para Eliminar Mes
CREATE PROCEDURE SPMesDelete
    @Id INT
AS
BEGIN
    -- Elimina el registro de Mes con el Id especificado
    DELETE FROM Mes
    WHERE Id = @Id;
END;
GO
