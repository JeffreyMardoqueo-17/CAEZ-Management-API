CREATE PROCEDURE SPEncargadoCreate
    @Nombre NVARCHAR(50),
    @Apellido NVARCHAR(50),
    @Telefono NVARCHAR(15),
    @Correo NVARCHAR(50),
    @IdDireccion INT,
    @IdRole INT,
    @IdParentezco INT,
    @IdTipoDocumento INT,
    @NumDocumento NVARCHAR(50),
    @IdAdministrador INT
AS
BEGIN
    SET NOCOUNT ON;
    
    -- Inserta un nuevo registro en la tabla Encargado
    INSERT INTO Encargado (Nombre, Apellido, Telefono, Correo, IdDireccion, IdRole, IdParentezco, IdTipoDocumento, NumDocumento, IdAdministrador, RegistrationDate)
    VALUES (@Nombre, @Apellido, @Telefono, @Correo, @IdDireccion, @IdRole, @IdParentezco, @IdTipoDocumento, @NumDocumento, @IdAdministrador, GETDATE());

    -- Devuelve el Id del registro recién insertado
    SELECT SCOPE_IDENTITY() AS Id;
END;
GO
CREATE PROCEDURE SPEncargadoGetAll
AS
BEGIN
    SET NOCOUNT ON;
    
    -- Devuelve todos los registros de Encargado con detalles de Direccion, Role, Parentezco, TipoDocumento y Administrador
    SELECT 
        E.Id,
        E.Nombre,
        E.Apellido,
        E.Telefono,
        E.Correo,
        D.Nombre AS Direccion,
        R.[Name] AS RoleName,
        P.Nombre AS Parentezco,
        T.Nombre AS TipoDocumento,
        E.NumDocumento,
        U.[Name] AS AdminName,
        U.LastName AS AdminLastName,
        E.RegistrationDate
    FROM 
        Encargado E
    INNER JOIN 
        Direccion D ON E.IdDireccion = D.Id
    INNER JOIN 
        [Role] R ON E.IdRole = R.Id
    INNER JOIN 
        Parentezco P ON E.IdParentezco = P.Id
    INNER JOIN 
        TipoDocumento T ON E.IdTipoDocumento = T.Id
    INNER JOIN 
        [User] U ON E.IdAdministrador = U.Id;
END;
GO
CREATE PROCEDURE SPEncargadoGetById
    @Id INT
AS
BEGIN
    SET NOCOUNT ON;
    
    -- Devuelve el registro de Encargado con el Id especificado y detalles de Direccion, Role, Parentezco, TipoDocumento y Administrador
    SELECT 
        E.Id,
        E.Nombre,
        E.Apellido,
        E.Telefono,
        E.Correo,
        D.Nombre AS Direccion,
        R.[Name] AS RoleName,
        P.Nombre AS Parentezco,
        T.Nombre AS TipoDocumento,
        E.NumDocumento,
        U.[Name] AS AdminName,
        U.LastName AS AdminLastName,
        E.RegistrationDate
    FROM 
        Encargado E
    INNER JOIN 
        Direccion D ON E.IdDireccion = D.Id
    INNER JOIN 
        [Role] R ON E.IdRole = R.Id
    INNER JOIN 
        Parentezco P ON E.IdParentezco = P.Id
    INNER JOIN 
        TipoDocumento T ON E.IdTipoDocumento = T.Id
    INNER JOIN 
        [User] U ON E.IdAdministrador = U.Id
    WHERE 
        E.Id = @Id;
END;
GO
CREATE PROCEDURE SPEncargadoUpdate
    @Id INT,
    @Nombre NVARCHAR(50),
    @Apellido NVARCHAR(50),
    @Telefono NVARCHAR(15),
    @Correo NVARCHAR(50),
    @IdDireccion INT,
    @IdRole INT,
    @IdParentezco INT,
    @IdTipoDocumento INT,
    @NumDocumento NVARCHAR(50),
    @IdAdministrador INT
AS
BEGIN
    SET NOCOUNT ON;
    
    -- Actualiza el registro de Encargado con el Id especificado
    UPDATE Encargado
    SET 
        Nombre = @Nombre,
        Apellido = @Apellido,
        Telefono = @Telefono,
        Correo = @Correo,
        IdDireccion = @IdDireccion,
        IdRole = @IdRole,
        IdParentezco = @IdParentezco,
        IdTipoDocumento = @IdTipoDocumento,
        NumDocumento = @NumDocumento,
        IdAdministrador = @IdAdministrador
    WHERE 
        Id = @Id;
    
    -- Devuelve el registro actualizado con detalles de Direccion, Role, Parentezco, TipoDocumento y Administrador
    SELECT 
        E.Id,
        E.Nombre,
        E.Apellido,
        E.Telefono,
        E.Correo,
        D.Nombre AS Direccion,
        R.[Name] AS RoleName,
        P.Nombre AS Parentezco,
        T.Nombre AS TipoDocumento,
        E.NumDocumento,
        U.[Name] AS AdminName,
        U.LastName AS AdminLastName,
        E.RegistrationDate
    FROM 
        Encargado E
    INNER JOIN 
        Direccion D ON E.IdDireccion = D.Id
    INNER JOIN 
        [Role] R ON E.IdRole = R.Id
    INNER JOIN 
        Parentezco P ON E.IdParentezco = P.Id
    INNER JOIN 
        TipoDocumento T ON E.IdTipoDocumento = T.Id
    INNER JOIN 
        [User] U ON E.IdAdministrador = U.Id
    WHERE 
        E.Id = @Id;
END;
GO
CREATE PROCEDURE SPEncargadoDelete
    @Id INT
AS
BEGIN
    SET NOCOUNT ON;
    
    -- Elimina el registro de Encargado con el Id especificado
    DELETE FROM Encargado
    WHERE Id = @Id;
END;
GO
