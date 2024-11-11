CREATE PROCEDURE SPAuditoriaEncargadoGetAll
AS
BEGIN
    SET NOCOUNT ON;
    
    SELECT 
        AE.Id,
        AE.FechaHora,
        AE.IdUsuario,
        U.[Name] AS UsuarioNombre,
        AE.Operacion,
        AE.IdRegistro,
        AE.Detalles,
        ISNULL(D.Nombre, 'Sin Dirección') AS DireccionNombre,
        ISNULL(R.[Name], 'Sin Rol') AS RoleNombre,
        ISNULL(P.Nombre, 'Sin Parentezco') AS ParentezcoNombre,
        ISNULL(TD.Nombre, 'Sin Tipo Documento') AS TipoDocumentoNombre
    FROM AuditoriaEncargado AE
    INNER JOIN [User] U ON AE.IdUsuario = U.Id
    LEFT JOIN Encargado E ON AE.IdRegistro = E.Id
    LEFT JOIN Direccion D ON E.IdDireccion = D.Id
    LEFT JOIN [Role] R ON E.IdRole = R.Id
    LEFT JOIN Parentezco P ON E.IdParentezco = P.Id
    LEFT JOIN TipoDocumento TD ON E.IdTipoDocumento = TD.Id
    ORDER BY AE.FechaHora DESC;
END;
GO
CREATE PROCEDURE SPAuditoriaEncargadoGetByDateRange
    @StartDate DATETIME,
    @EndDate DATETIME
AS
BEGIN
    SET NOCOUNT ON;
    
    SELECT 
        AE.Id,
        AE.FechaHora,
        AE.IdUsuario,
        U.[Name] AS UsuarioNombre,
        AE.Operacion,
        AE.IdRegistro,
        AE.Detalles,
        ISNULL(D.Nombre, 'Sin Dirección') AS DireccionNombre,
        ISNULL(R.[Name], 'Sin Rol') AS RoleNombre,
        ISNULL(P.Nombre, 'Sin Parentezco') AS ParentezcoNombre,
        ISNULL(TD.Nombre, 'Sin Tipo Documento') AS TipoDocumentoNombre
    FROM AuditoriaEncargado AE
    INNER JOIN [User] U ON AE.IdUsuario = U.Id
    LEFT JOIN Encargado E ON AE.IdRegistro = E.Id
    LEFT JOIN Direccion D ON E.IdDireccion = D.Id
    LEFT JOIN [Role] R ON E.IdRole = R.Id
    LEFT JOIN Parentezco P ON E.IdParentezco = P.Id
    LEFT JOIN TipoDocumento TD ON E.IdTipoDocumento = TD.Id
    WHERE AE.FechaHora BETWEEN @StartDate AND @EndDate
    ORDER BY AE.FechaHora DESC;
END;
GO
CREATE PROCEDURE SPAuditoriaEncargadoGetBySpecificDate
    @SpecificDate DATETIME
AS
BEGIN
    SET NOCOUNT ON;
    
    SELECT 
        AE.Id,
        AE.FechaHora,
        AE.IdUsuario,
        U.[Name] AS UsuarioNombre,
        AE.Operacion,
        AE.IdRegistro,
        AE.Detalles,
        ISNULL(D.Nombre, 'Sin Dirección') AS DireccionNombre,
        ISNULL(R.[Name], 'Sin Rol') AS RoleNombre,
        ISNULL(P.Nombre, 'Sin Parentezco') AS ParentezcoNombre,
        ISNULL(TD.Nombre, 'Sin Tipo Documento') AS TipoDocumentoNombre
    FROM AuditoriaEncargado AE
    INNER JOIN [User] U ON AE.IdUsuario = U.Id
    LEFT JOIN Encargado E ON AE.IdRegistro = E.Id
    LEFT JOIN Direccion D ON E.IdDireccion = D.Id
    LEFT JOIN [Role] R ON E.IdRole = R.Id
    LEFT JOIN Parentezco P ON E.IdParentezco = P.Id
    LEFT JOIN TipoDocumento TD ON E.IdTipoDocumento = TD.Id
    WHERE CONVERT(DATE, AE.FechaHora) = CONVERT(DATE, @SpecificDate)
    ORDER BY AE.FechaHora DESC;
END;
GO
