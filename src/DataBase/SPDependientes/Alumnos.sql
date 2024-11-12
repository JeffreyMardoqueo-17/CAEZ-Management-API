CREATE PROCEDURE SPAlumnoCreate
    @Nombre NVARCHAR(50),
    @Apellido NVARCHAR(50),
    @FechaNacimiento DATETIME,
    @IdSexo INT,
    @IdRole INT,
    @IdGrado INT,
    @IdTurno INT,
    @IdEncargado INT,
    @IdTipoDocumento INT,
    @NumDocumento NVARCHAR(50),
    @EsBecado BIT,
    @IdPadrino INT = NULL, -- Permite null por defecto
    @IdAdministrador INT
AS
BEGIN
    SET NOCOUNT ON;
    
    -- Inserta un nuevo registro en la tabla Alumno
    INSERT INTO Alumno (Nombre, Apellido, FechaNacimiento, IdSexo, IdRole, IdGrado, IdTurno, IdEncargado, IdTipoDocumento, NumDocumento, EsBecado, IdPadrino, IdAdministrador, RegistrationDate)
    VALUES (@Nombre, @Apellido, @FechaNacimiento, @IdSexo, @IdRole, @IdGrado, @IdTurno, @IdEncargado, @IdTipoDocumento, @NumDocumento, @EsBecado, @IdPadrino, @IdAdministrador, GETDATE());

    -- Devuelve el Id del registro recién insertado
    SELECT SCOPE_IDENTITY() AS Id;
END;
GO

CREATE PROCEDURE SPAlumnoGetAll
AS
BEGIN
    SET NOCOUNT ON;
    
    -- Devuelve todos los registros de Alumno con detalles de Sexo, Role, Grado, Turno, Encargado, TipoDocumento y Padrino
    SELECT 
        A.Id,
        A.Nombre,
        A.Apellido,
        A.FechaNacimiento,
        S.Nombre AS Sexo,
        R.[Name] AS RoleName,
        G.Nombre AS Grado,
        T.Nombre AS Turno,
        E.Nombre AS EncargadoNombre,
        E.Apellido AS EncargadoApellido,
        TD.Nombre AS TipoDocumento,
        A.NumDocumento,
        A.EsBecado,
        P.Nombre AS PadrinoNombre,
        P.Apellido AS PadrinoApellido,
        U.[Name] AS AdminName,
        U.LastName AS AdminLastName,
        A.RegistrationDate
    FROM 
        Alumno A
    INNER JOIN 
        Sexo S ON A.IdSexo = S.Id
    INNER JOIN 
        [Role] R ON A.IdRole = R.Id
    INNER JOIN 
        Grado G ON A.IdGrado = G.Id
    INNER JOIN 
        Turno T ON A.IdTurno = T.Id
    INNER JOIN 
        Encargado E ON A.IdEncargado = E.Id
    INNER JOIN 
        TipoDocumento TD ON A.IdTipoDocumento = TD.Id
    LEFT JOIN 
        Padrino P ON A.IdPadrino = P.Id
    INNER JOIN 
        [User] U ON A.IdAdministrador = U.Id;
END;
GO
CREATE PROCEDURE SPAlumnoGetById
    @Id INT
AS
BEGIN
    SET NOCOUNT ON;
    
    -- Devuelve el registro de Alumno con el Id especificado y detalles de Sexo, Role, Grado, Turno, Encargado, TipoDocumento y Padrino
    SELECT 
        A.Id,
        A.Nombre,
        A.Apellido,
        A.FechaNacimiento,
        S.Nombre AS Sexo,
        R.[Name] AS RoleName,
        G.Nombre AS Grado,
        T.Nombre AS Turno,
        E.Nombre AS EncargadoNombre,
        E.Apellido AS EncargadoApellido,
        TD.Nombre AS TipoDocumento,
        A.NumDocumento,
        A.EsBecado,
        P.Nombre AS PadrinoNombre,
        P.Apellido AS PadrinoApellido,
        U.[Name] AS AdminName,
        U.LastName AS AdminLastName,
        A.RegistrationDate
    FROM 
        Alumno A
    INNER JOIN 
        Sexo S ON A.IdSexo = S.Id
    INNER JOIN 
        [Role] R ON A.IdRole = R.Id
    INNER JOIN 
        Grado G ON A.IdGrado = G.Id
    INNER JOIN 
        Turno T ON A.IdTurno = T.Id
    INNER JOIN 
        Encargado E ON A.IdEncargado = E.Id
    INNER JOIN 
        TipoDocumento TD ON A.IdTipoDocumento = TD.Id
    LEFT JOIN 
        Padrino P ON A.IdPadrino = P.Id
    INNER JOIN 
        [User] U ON A.IdAdministrador = U.Id
    WHERE 
        A.Id = @Id;
END;
GO
CREATE PROCEDURE SPAlumnoUpdate
    @Id INT,
    @Nombre NVARCHAR(50),
    @Apellido NVARCHAR(50),
    @FechaNacimiento DATETIME,
    @IdSexo INT,
    @IdRole INT,
    @IdGrado INT,
    @IdTurno INT,
    @IdEncargado INT,
    @IdTipoDocumento INT,
    @NumDocumento NVARCHAR(50),
    @EsBecado BIT,
    @IdPadrino INT = NULL, -- Permite null por defecto
    @IdAdministrador INT
AS
BEGIN
    SET NOCOUNT ON;
    
    -- Actualiza el registro de Alumno con el Id especificado
    UPDATE Alumno
    SET 
        Nombre = @Nombre,
        Apellido = @Apellido,
        FechaNacimiento = @FechaNacimiento,
        IdSexo = @IdSexo,
        IdRole = @IdRole,
        IdGrado = @IdGrado,
        IdTurno = @IdTurno,
        IdEncargado = @IdEncargado,
        IdTipoDocumento = @IdTipoDocumento,
        NumDocumento = @NumDocumento,
        EsBecado = @EsBecado,
        IdPadrino = @IdPadrino,
        IdAdministrador = @IdAdministrador
    WHERE 
        Id = @Id;
    
    -- Devuelve el registro actualizado
    SELECT * FROM Alumno WHERE Id = @Id;
END;
GO

CREATE PROCEDURE SPAlumnoDelete
    @Id INT
AS
BEGIN
    SET NOCOUNT ON;
    
    -- Elimina el registro de Alumno con el Id especificado
    DELETE FROM Alumno
    WHERE Id = @Id;
END;
GO
CREATE PROCEDURE SPAlumnoGetByNumDocumento
    @NumDocumento NVARCHAR(50)
AS
BEGIN
    SET NOCOUNT ON;
    
    -- Busca al Alumno usando el NumDocumento
    SELECT 
        A.Id,
        A.Nombre,
        A.Apellido,
        A.FechaNacimiento,
        S.Nombre AS Sexo,
        R.[Name] AS RoleName,
        G.Nombre AS Grado,
        T.Nombre AS Turno,
        E.Nombre AS EncargadoNombre,
        E.Apellido AS EncargadoApellido,
        TD.Nombre AS TipoDocumento,
        A.NumDocumento,
        A.EsBecado,
        P.Nombre AS PadrinoNombre,
        P.Apellido AS PadrinoApellido,
        U.[Name] AS AdminName,
        U.LastName AS AdminLastName,
        A.RegistrationDate
    FROM 
        Alumno A
    INNER JOIN 
        Sexo S ON A.IdSexo = S.Id
    INNER JOIN 
        [Role] R ON A.IdRole = R.Id
    INNER JOIN 
        Grado G ON A.IdGrado = G.Id
    INNER JOIN 
        Turno T ON A.IdTurno = T.Id
    INNER JOIN 
        Encargado E ON A.IdEncargado = E.Id
    INNER JOIN 
        TipoDocumento TD ON A.IdTipoDocumento = TD.Id
    LEFT JOIN 
        Padrino P ON A.IdPadrino = P.Id
    INNER JOIN 
        [User] U ON A.IdAdministrador = U.Id
    WHERE 
        A.NumDocumento = @NumDocumento;
END;
GO

------------------------SP PARA VER SUS PAGOS
CREATE PROCEDURE SPGetAlumnoPagos
    @IdAlumno INT
AS
BEGIN
    SET NOCOUNT ON;
    
    -- Consulta de pagos de matrícula y mensualidades
    SELECT 
        P.Id AS PagoId,
        TP.Nombre AS TipoPago,           -- Tipo de pago: Matrícula o Mensualidad
        PM.Anio,
        M.Nombre AS Mes,                 -- Mes (si es un pago mensual)
        P.FechaPago,
        P.Cantidad,
        P.MultaRetrazo,
        P.PorcentajeDescuento,
        P.TotalPagar,
        EP.Nombre AS EstadoPago          -- Estado del pago (Pendiente, Pagado, etc.)
    FROM 
        Pago P
    INNER JOIN 
        TipoPago TP ON P.IdTipoPago = TP.Id
    INNER JOIN 
        PagoMes PM ON P.Id = PM.IdPago
    INNER JOIN 
        Mes M ON PM.IdMes = M.Id
    INNER JOIN 
        EstadoPago EP ON PM.IdEstadoPago = EP.Id
    WHERE 
        P.IdAlumno = @IdAlumno;
END;
GO
