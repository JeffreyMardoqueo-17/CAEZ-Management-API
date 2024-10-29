-- CREATE TABLE Direccion(
--     Id INT NOT NULL PRIMARY KEY IDENTITY (1,1),
--     Nombre VARCHAR(200) NOT NULL
-- );
-- GO
---------------------------------CREAR DIRECCION 
CREATE PROCEDURE SPDireccionesCreate
    @Nombre VARCHAR(200)
AS
BEGIN
    INSERT INTO Direccion (Nombre)
    VALUES (@Nombre);

    SELECT SCOPE_IDENTITY() AS Id; -- Devuelve el Id del registro recién insertado
END;
GO
----------------------------- TRAER TODAS LAS DIRECCIONES
CREATE PROCEDURE SPDireccionesGet
    @Id INT = NULL -- Si @Id es NULL, devolverá todas las direcciones
AS
BEGIN
    IF @Id IS NULL
    BEGIN
        SELECT * FROM Direccion;
    END
    ELSE
    BEGIN
        SELECT * FROM Direccion WHERE Id = @Id;
    END
END;
GO
---------------------------------TRAER DIRECCION POR ID
CREATE PROCEDURE SPGetDireccionesPorId
    @Id TINYINT
AS
BEGIN
    SELECT * FROM Direccion
    WHERE Id = @Id;
END;
GO

----------------------------------------Actualizar Direcciones
CREATE PROCEDURE SPDireccionesUpdate
    @Id INT,
    @Nombre VARCHAR(200)
AS
BEGIN
    UPDATE Direccion
    SET Nombre = @Nombre
    WHERE Id = @Id;
    
    SELECT * FROM Direccion WHERE Id = @Id; -- Devuelve el registro actualizado
END;
GO
-------------------------------------------Eliminar Direcciones
CREATE PROCEDURE SPDireccionesDelete
    @Id INT
AS
BEGIN
    DELETE FROM Direccion
    WHERE Id = @Id;
END;
GO
