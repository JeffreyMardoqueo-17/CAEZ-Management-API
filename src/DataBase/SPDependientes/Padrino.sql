CREATE PROCEDURE SPPadrinoCreate
    @Nombre NVARCHAR(50),
    @Apellido NVARCHAR(50),
    @Telefono NVARCHAR(15),
    @Correo NVARCHAR(50),
    @IdRole INT,
    @IdAdministrador INT
AS
BEGIN
    SET NOCOUNT ON;
    
    -- Inserta un nuevo registro en la tabla Padrino
    INSERT INTO Padrino (Nombre, Apellido, Telefono, Correo, IdRole, IdAdministrador, RegistrationDate)
    VALUES (@Nombre, @Apellido, @Telefono, @Correo, @IdRole, @IdAdministrador, GETDATE());

    -- Devuelve el Id del registro recién insertado
    SELECT SCOPE_IDENTITY() AS Id;
END;
GO
CREATE PROCEDURE SPPadrinoGetAll
AS
BEGIN
    SET NOCOUNT ON;
    
    -- Devuelve todos los registros de Padrino con detalles de Role y Administrador
    SELECT 
        P.Id,
        P.Nombre,
        P.Apellido,
        P.Telefono,
        P.Correo,
        R.[Name] AS RoleName,
        U.[Name] AS AdminName,
        U.LastName AS AdminLastName,
        P.RegistrationDate
    FROM 
        Padrino P
    INNER JOIN 
        [Role] R ON P.IdRole = R.Id
    INNER JOIN 
        [User] U ON P.IdAdministrador = U.Id;
END;
GO
CREATE PROCEDURE SPPadrinoGetById
    @Id INT
AS
BEGIN
    SET NOCOUNT ON;
    
    -- Devuelve el registro de Padrino con el Id especificado y detalles de Role y Administrador
    SELECT 
        P.Id,
        P.Nombre,
        P.Apellido,
        P.Telefono,
        P.Correo,
        R.[Name] AS RoleName,
        U.[Name] AS AdminName,
        U.LastName AS AdminLastName,
        P.RegistrationDate
    FROM 
        Padrino P
    INNER JOIN 
        [Role] R ON P.IdRole = R.Id
    INNER JOIN 
        [User] U ON P.IdAdministrador = U.Id
    WHERE 
        P.Id = @Id;
END;
GO
CREATE PROCEDURE SPPadrinoUpdate
    @Id INT,
    @Nombre NVARCHAR(50),
    @Apellido NVARCHAR(50),
    @Telefono NVARCHAR(15),
    @Correo NVARCHAR(50),
    @IdRole INT,
    @IdAdministrador INT
AS
BEGIN
    SET NOCOUNT ON;
    
    -- Actualiza el registro de Padrino con el Id especificado
    UPDATE Padrino
    SET 
        Nombre = @Nombre,
        Apellido = @Apellido,
        Telefono = @Telefono,
        Correo = @Correo,
        IdRole = @IdRole,
        IdAdministrador = @IdAdministrador
    WHERE 
        Id = @Id;
    
    -- Devuelve el registro actualizado con detalles de Role y Administrador
    SELECT 
        P.Id,
        P.Nombre,
        P.Apellido,
        P.Telefono,
        P.Correo,
        R.[Name] AS RoleName,
        U.[Name] AS AdminName,
        U.LastName AS AdminLastName,
        P.RegistrationDate
    FROM 
        Padrino P
    INNER JOIN 
        [Role] R ON P.IdRole = R.Id
    INNER JOIN 
        [User] U ON P.IdAdministrador = U.Id
    WHERE 
        P.Id = @Id;
END;
GO
CREATE PROCEDURE SPPadrinoDelete
    @Id INT
AS
BEGIN
    SET NOCOUNT ON;
    
    -- Elimina el registro de Padrino con el Id especificado
    DELETE FROM Padrino
    WHERE Id = @Id;
END;
GO
