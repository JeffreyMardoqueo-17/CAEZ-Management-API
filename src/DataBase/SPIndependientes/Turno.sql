-- -- TABLA Turno
-- CREATE TABLE Turno(
--     Id INT NOT NULL PRIMARY KEY IDENTITY (1,1),
--     Nombre VARCHAR(80) NOT NULL
-- );
-- GO

-- Stored Procedure para Crear Turnos
CREATE PROCEDURE SPTurnosCreate
    @Nombre VARCHAR(80)
AS
BEGIN
    -- Inserta un nuevo turno
    INSERT INTO Turno (Nombre)
    VALUES (@Nombre);

    -- Devuelve el Id del registro recién insertado
    SELECT SCOPE_IDENTITY() AS Id;
END;
GO

-- Stored Procedure para Traer Todos los Turnos o un Turno por ID
CREATE PROCEDURE SPTurnosGet
    @Id INT = NULL -- Si @Id es NULL, devolverá todos los turnos
AS
BEGIN
    IF @Id IS NULL
    BEGIN
        -- Devuelve todos los turnos
        SELECT * FROM Turno;
    END
    ELSE
    BEGIN
        -- Devuelve el turno con el Id especificado
        SELECT * FROM Turno WHERE Id = @Id;
    END
END;
GO

-- Stored Procedure para Traer Turno por ID
CREATE PROCEDURE SPGetTurnosPorId
    @Id INT
AS
BEGIN
    -- Devuelve el turno con el Id especificado
    SELECT * FROM Turno
    WHERE Id = @Id;
END;
GO

-- Stored Procedure para Actualizar Turnos
CREATE PROCEDURE SPTurnosUpdate
    @Id INT,
    @Nombre VARCHAR(80)
AS
BEGIN
    -- Actualiza el turno con el Id especificado
    UPDATE Turno
    SET Nombre = @Nombre
    WHERE Id = @Id;
    
    -- Devuelve el registro actualizado
    SELECT * FROM Turno WHERE Id = @Id;
END;
GO

-- Stored Procedure para Eliminar Turnos
CREATE PROCEDURE SPTurnosDelete
    @Id INT
AS
BEGIN
    -- Elimina el turno con el Id especificado
    DELETE FROM Turno
    WHERE Id = @Id;
END;
GO