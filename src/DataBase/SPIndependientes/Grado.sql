-- Stored Procedure para Crear un Grado
CREATE PROCEDURE SPGradosCreate
    @Nombre VARCHAR(50)
AS
BEGIN
    SET NOCOUNT ON;

    -- Inserta un nuevo grado
    INSERT INTO Grado (Nombre)
    VALUES (@Nombre);

    -- Devuelve el Id del registro recién insertado
    SELECT SCOPE_IDENTITY() AS Id;
END;
GO

-- Stored Procedure para Obtener Todos los Grados o un Grado por ID
CREATE PROCEDURE SPGradosGet
    @Id INT = NULL -- Si @Id es NULL, devuelve todos los grados
AS
BEGIN
    SET NOCOUNT ON;

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

-- Stored Procedure para Actualizar un Grado
CREATE PROCEDURE SPGradosUpdate
    @Id INT,
    @Nombre VARCHAR(50)
AS
BEGIN
    SET NOCOUNT ON;

    -- Actualiza el grado con el Id especificado
    UPDATE Grado
    SET Nombre = @Nombre
    WHERE Id = @Id;

    -- Devuelve el registro actualizado
    SELECT * FROM Grado WHERE Id = @Id;
END;
GO

-- Stored Procedure para Eliminar un Grado
CREATE PROCEDURE SPGradosDelete
    @Id INT
AS
BEGIN
    SET NOCOUNT ON;

    -- Elimina el grado con el Id especificado
    DELETE FROM Grado
    WHERE Id = @Id;
END;
GO
