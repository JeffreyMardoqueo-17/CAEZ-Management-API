CREATE PROCEDURE SPUserCreate
    @Name NVARCHAR(30),
    @LastName NVARCHAR(30),
    @Login NVARCHAR(100),
    @Password NVARCHAR(100),  -- Debe ser el hash de la contraseña
    @Status TINYINT,
    @IdRole INT
AS
BEGIN
    SET NOCOUNT ON;
    
    -- Inserta un nuevo usuario en la tabla User
    INSERT INTO [User] ([Name], LastName, [Login], [Password], [Status], RegistrationDate, IdRole)
    VALUES (@Name, @LastName, @Login, @Password, @Status, GETDATE(), @IdRole);

    -- Devuelve el Id del registro recién insertado
    SELECT SCOPE_IDENTITY() AS Id;
END;
GO

CREATE PROCEDURE SPUserGet
AS
BEGIN
    SET NOCOUNT ON;
    
    -- Devuelve todos los registros de User con los detalles del Role
    SELECT 
        U.Id,
        U.[Name],
        U.LastName,
        U.[Login],
        U.[Status],
        U.RegistrationDate,
        R.[Name] AS RoleName
    FROM 
        [User] U
    INNER JOIN 
        [Role] R ON U.IdRole = R.Id;
END;
GO
CREATE PROCEDURE SPUserGetById
    @Id INT
AS
BEGIN
    SET NOCOUNT ON;

    -- Devuelve el usuario con el Id especificado y los detalles del Role
    SELECT 
        U.Id,
        U.[Name],
        U.LastName,
        U.[Login],
        U.[Status],
        U.RegistrationDate,
        R.[Name] AS RoleName
    FROM 
        [User] U
    INNER JOIN 
        [Role] R ON U.IdRole = R.Id
    WHERE 
        U.Id = @Id;
END;
GO
CREATE PROCEDURE SPUserUpdate
    @Id INT,
    @Name NVARCHAR(30),
    @LastName NVARCHAR(30),
    @Login NVARCHAR(100),
    @Password NVARCHAR(100),  -- Hash de la contraseña
    @Status TINYINT,
    @IdRole INT
AS
BEGIN
    SET NOCOUNT ON;
    
    -- Actualiza el usuario con el Id especificado
    UPDATE [User]
    SET 
        [Name] = @Name,
        LastName = @LastName,
        [Login] = @Login,
        [Password] = @Password,
        [Status] = @Status,
        IdRole = @IdRole
    WHERE 
        Id = @Id;
    
    -- Devuelve el registro actualizado con los detalles del Role
    SELECT 
        U.Id,
        U.[Name],
        U.LastName,
        U.[Login],
        U.[Status],
        U.RegistrationDate,
        R.[Name] AS RoleName
    FROM 
        [User] U
    INNER JOIN 
        [Role] R ON U.IdRole = R.Id
    WHERE 
        U.Id = @Id;
END;
GO
CREATE PROCEDURE SPUserDelete
    @Id INT
AS
BEGIN
    SET NOCOUNT ON;
    
    -- Elimina el usuario con el Id especificado
    DELETE FROM [User]
    WHERE Id = @Id;
END;
GO
CREATE PROCEDURE SPUserLogin
    @Login NVARCHAR(100),
    @Password NVARCHAR(100)  -- Contraseña en forma de hash
AS
BEGIN
    SET NOCOUNT ON;
    BEGIN TRY
        BEGIN TRANSACTION;
        
        DECLARE @UserId INT;
        
        -- Verifica si el usuario y la contraseña son correctos y si el usuario está activo
        SELECT 
            @UserId = Id
        FROM 
            [User]
        WHERE 
            [Login] = @Login 
            AND [Password] = @Password
            AND [Status] = 1;  -- Solo permite usuarios activos

        -- Si las credenciales son correctas, devuelve la información del usuario
        IF @UserId IS NOT NULL
        BEGIN
            SELECT 
                Id,
                [Name],
                LastName,
                [Login],
                [Status],
                RegistrationDate,
                IdRole
            FROM 
                [User]
            WHERE 
                Id = @UserId;
        END
        ELSE
        BEGIN
            -- Mensaje de error genérico si las credenciales no son correctas
            SELECT 'Credenciales incorrectas' AS ErrorMessage;
        END

        COMMIT TRANSACTION;
    END TRY
    BEGIN CATCH
        ROLLBACK TRANSACTION;
        -- Manejo de errores, devuelve el mensaje de error de SQL Server
        SELECT ERROR_MESSAGE() AS ErrorMessage;
    END CATCH
END;
GO

-- ESTE POR SI LUEGO IMPLEMENTO LO DE RECUPERACCION DE CUENTA
CREATE PROCEDURE SPUserGetByLogin
    @Login NVARCHAR(100)
AS
BEGIN
    SET NOCOUNT ON;

    -- Selecciona el usuario con el Login proporcionado
    SELECT 
        Id,
        [Name],
        LastName,
        [Login],
        [Status],
        RegistrationDate,
        IdRole
    FROM 
        [User]
    WHERE 
        [Login] = @Login;
END;
GO
