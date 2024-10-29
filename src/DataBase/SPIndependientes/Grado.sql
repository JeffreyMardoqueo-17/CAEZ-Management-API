-- -------------------------
-- -- TABLA Grado
-- -- TABLA Grado
-- CREATE TABLE Grado(
--     Id INT NOT NULL PRIMARY KEY IDENTITY (1,1),
--     Nombre VARCHAR(50) NOT NULL,
--     Colegiatura DECIMAL(10, 2) NOT NULL DEFAULT 0
-- );
-- GO
-- -------------------------

-- Stored Procedure para Crear Grado
CREATE PROCEDURE SPGradosCreate
    @Nombre VARCHAR(50),
AS
BEGIN
    -- Inserta un nuevo grado
    INSERT INTO Grado (Nombre)
    VALUES (@Nombre);

    -- Devuelve el Id del registro recién insertado
    SELECT SCOPE_IDENTITY() AS Id;
END;
GO

-- Stored Procedure para Traer Todos los Grados o un Grado por ID
CREATE PROCEDURE SPGradosGet
    @Id INT = NULL -- Si @Id es NULL, devolverá todos los grados
AS
BEGIN
    IF @Id IS NULL
    BEGIN
        -- Devuelve todos los grados
        SELECT * FROM Grado;
    END
    ELSE
    BEGIN
        -- Devuelve el grado con el Id especificado
        SELECT * FROM Grado WHERE Id = @Id;
    END
END;
GO

-- Stored Procedure para Traer Grado por ID
CREATE PROCEDURE SPGetGradosPorId
    @Id INT
AS
BEGIN
    -- Devuelve el grado con el Id especificado
    SELECT * FROM Grado
    WHERE Id = @Id;
END;
GO

-- Stored Procedure para Actualizar Grado
CREATE PROCEDURE SPGradosUpdate
    @Id INT,
    @Nombre VARCHAR(50),
AS
BEGIN
    -- Actualiza el grado con el Id especificado
    UPDATE Grado
    SET Nombre = @Nombre,
    WHERE Id = @Id;
    
    -- Devuelve el registro actualizado
    SELECT * FROM Grado WHERE Id = @Id;
END;
GO

-- Stored Procedure para Eliminar Grado
CREATE PROCEDURE SPGradosDelete
    @Id INT
AS
BEGIN
    -- Elimina el grado con el Id especificado
    DELETE FROM Grado
    WHERE Id = @Id;
END;
GO
