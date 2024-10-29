-- -------------------------
-- TABLA Role
-- CREATE TABLE [Role](
--     Id INT NOT NULL PRIMARY KEY IDENTITY(1,1),
--     [Name] VARCHAR(30) NOT NULL
-- );
-- GO
-- -------------------------

-- Stored Procedure para Crear Role
CREATE PROCEDURE SPRoleCreate
    @Name VARCHAR(30)
AS
BEGIN
    -- Inserta un nuevo registro en la tabla Role
    INSERT INTO [Role] ([Name])
    VALUES (@Name);

    -- Devuelve el Id del registro recién insertado
    SELECT SCOPE_IDENTITY() AS Id;
END;
GO

-- Stored Procedure para Traer Todos los Roles o un Role por ID
CREATE PROCEDURE SPRoleGet
    @Id INT = NULL -- Si @Id es NULL, devolverá todos los roles
AS
BEGIN
    IF @Id IS NULL
    BEGIN
        -- Devuelve todos los registros de Role
        SELECT * FROM [Role];
    END
    ELSE
    BEGIN
        -- Devuelve el registro de Role con el Id especificado
        SELECT * FROM [Role] WHERE Id = @Id;
    END
END;
GO

-- Stored Procedure para Traer Role por ID
CREATE PROCEDURE SPGetRolePorId
    @Id INT
AS
BEGIN
    -- Devuelve el registro de Role con el Id especificado
    SELECT * FROM [Role]
    WHERE Id = @Id;
END;
GO

-- Stored Procedure para Actualizar Role
CREATE PROCEDURE SPRoleUpdate
    @Id INT,
    @Name VARCHAR(30)
AS
BEGIN
    -- Actualiza el registro de Role con el Id especificado
    UPDATE [Role]
    SET [Name] = @Name
    WHERE Id = @Id;
    
    -- Devuelve el registro actualizado
    SELECT * FROM [Role] WHERE Id = @Id;
END;
GO

-- Stored Procedure para Eliminar Role
CREATE PROCEDURE SPRoleDelete
    @Id INT
AS
BEGIN
    -- Elimina el registro de Role con el Id especificado
    DELETE FROM [Role]
    WHERE Id = @Id;
END;
GO
