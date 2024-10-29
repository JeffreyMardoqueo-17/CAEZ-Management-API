-- -------------------------
-- TABLA Parentezco
-- CREATE TABLE Parentezco(
--     Id INT NOT NULL PRIMARY KEY IDENTITY (1,1),
--     Nombre VARCHAR(50) NOT NULL
-- );
-- GO
-- -------------------------

-- Stored Procedure para Crear Parentezco
CREATE PROCEDURE SPParentezcoCreate
    @Nombre VARCHAR(50)
AS
BEGIN
    -- Inserta un nuevo registro en la tabla Parentezco
    INSERT INTO Parentezco (Nombre)
    VALUES (@Nombre);

    -- Devuelve el Id del registro recién insertado
    SELECT SCOPE_IDENTITY() AS Id;
END;
GO

-- Stored Procedure para Traer Todos los Parentescos o un Parentezco por ID
CREATE PROCEDURE SPParentezcoGet
    @Id INT = NULL -- Si @Id es NULL, devolverá todos los parentescos
AS
BEGIN
    IF @Id IS NULL
    BEGIN
        -- Devuelve todos los registros de Parentezco
        SELECT * FROM Parentezco;
    END
    ELSE
    BEGIN
        -- Devuelve el registro de Parentezco con el Id especificado
        SELECT * FROM Parentezco WHERE Id = @Id;
    END
END;
GO

-- Stored Procedure para Traer Parentezco por ID
CREATE PROCEDURE SPGetParentezcoPorId
    @Id INT
AS
BEGIN
    -- Devuelve el registro de Parentezco con el Id especificado
    SELECT * FROM Parentezco
    WHERE Id = @Id;
END;
GO

-- Stored Procedure para Actualizar Parentezco
CREATE PROCEDURE SPParentezcoUpdate
    @Id INT,
    @Nombre VARCHAR(50)
AS
BEGIN
    -- Actualiza el registro de Parentezco con el Id especificado
    UPDATE Parentezco
    SET Nombre = @Nombre
    WHERE Id = @Id;
    
    -- Devuelve el registro actualizado
    SELECT * FROM Parentezco WHERE Id = @Id;
END;
GO

-- Stored Procedure para Eliminar Parentezco
CREATE PROCEDURE SPParentezcoDelete
    @Id INT
AS
BEGIN
    -- Elimina el registro de Parentezco con el Id especificado
    DELETE FROM Parentezco
    WHERE Id = @Id;
END;
GO
