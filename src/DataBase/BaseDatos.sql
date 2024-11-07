CREATE DATABASE CAEZBaseDatos;
USE CAEZBaseDatos;

-- TABLA Direccion
CREATE TABLE Direccion (
    Id INT NOT NULL PRIMARY KEY IDENTITY (1, 1),
    Nombre VARCHAR(200) NOT NULL
);
GO

-- TABLA Turno
CREATE TABLE Turno (
    Id INT NOT NULL PRIMARY KEY IDENTITY (1, 1),
    Nombre VARCHAR(80) NOT NULL
);
GO

-- TABLA Grado
CREATE TABLE Grado (
    Id INT NOT NULL PRIMARY KEY IDENTITY (1, 1),
    Nombre VARCHAR(50) NOT NULL
);
GO

-- TABLA TipoDocumento
CREATE TABLE TipoDocumento (
    Id INT NOT NULL PRIMARY KEY IDENTITY (1,1),
    Nombre VARCHAR(50) NOT NULL
);
GO

-- TABLA TipoPago
CREATE TABLE TipoPago (
    Id INT NOT NULL PRIMARY KEY IDENTITY (1,1),
    Nombre VARCHAR(80) NOT NULL
);
GO

-- TABLA Sexo
CREATE TABLE Sexo (
    Id INT NOT NULL PRIMARY KEY IDENTITY(1, 1),
    Nombre VARCHAR(10) NOT NULL
);
GO

-- TABLA Parentezco
CREATE TABLE Parentezco (
    Id INT NOT NULL PRIMARY KEY IDENTITY (1,1),
    Nombre VARCHAR(50) NOT NULL
);
GO

-- TABLA Mes (Catálogo de Meses)
CREATE TABLE Mes (
    Id INT NOT NULL PRIMARY KEY IDENTITY(1,1),
    Nombre VARCHAR(20) NOT NULL -- Ejemplo: 'Enero', 'Febrero', etc.
);
GO

-- TABLA EstadoPago
CREATE TABLE EstadoPago (
    Id INT NOT NULL PRIMARY KEY IDENTITY(1,1),
    Nombre VARCHAR(20) NOT NULL -- Ejemplos: 'Pendiente', 'Pagado', 'Retrasado', 'Anulado'
);
GO

-- TABLA Role
CREATE TABLE [Role] (
    Id INT NOT NULL PRIMARY KEY IDENTITY(1,1),
    [Name] VARCHAR(30) NOT NULL
);
GO

-- TABLA User
CREATE TABLE [User] (
    Id INT NOT NULL PRIMARY KEY IDENTITY(1,1),
    [Name] NVARCHAR(30) NOT NULL,
    LastName NVARCHAR(30) NOT NULL,
    [Login] NVARCHAR(100),
    [Password] NVARCHAR(MAX) NOT NULL,
    [Status] TINYINT NOT NULL,
    RegistrationDate DATETIME NOT NULL,
    IdRole INT NOT NULL FOREIGN KEY REFERENCES [Role](Id)
);
GO
GO
--------Tbla para almacenar las sesiones
CREATE TABLE [Session] (
    Id INT NOT NULL PRIMARY KEY IDENTITY(1, 1),
    UserId INT NOT NULL FOREIGN KEY REFERENCES [User](Id),
    Token NVARCHAR(MAX) NOT NULL,
    CreatedAt DATETIME NOT NULL DEFAULT GETDATE(),
    ExpiresAt DATETIME NOT NULL,
    IsActive BIT NOT NULL DEFAULT 1
);
GO


-- TABLA Padrino
CREATE TABLE Padrino (
    Id INT NOT NULL PRIMARY KEY IDENTITY(1,1),
    Nombre VARCHAR(50) NOT NULL,
    Apellido VARCHAR(50) NOT NULL,
    Telefono VARCHAR(15) NOT NULL,
    Correo VARCHAR(50) NOT NULL,
    IdRole INT NOT NULL FOREIGN KEY REFERENCES [Role](Id),
    IdAdministrador INT NOT NULL FOREIGN KEY REFERENCES [User](Id),
    RegistrationDate DATETIME NOT NULL
);
GO

-- TABLA Encargado
CREATE TABLE Encargado (
    Id INT NOT NULL PRIMARY KEY IDENTITY(1,1),
    Nombre VARCHAR(50) NOT NULL,
    Apellido VARCHAR(50) NOT NULL,
    Telefono VARCHAR(15) NOT NULL,
    Correo VARCHAR(50) NOT NULL,
    IdDireccion INT NOT NULL FOREIGN KEY REFERENCES Direccion(Id),
    IdRole INT NOT NULL FOREIGN KEY REFERENCES [Role](Id),
    IdParentezco INT NOT NULL FOREIGN KEY REFERENCES Parentezco(Id),
    IdTipoDocumento INT NOT NULL FOREIGN KEY REFERENCES TipoDocumento(Id),
    NumDocumento VARCHAR(50) NOT NULL,
    IdAdministrador INT NOT NULL FOREIGN KEY REFERENCES [User](Id),
    RegistrationDate DATETIME NOT NULL
);
GO

CREATE TABLE Alumno (
    Id INT NOT NULL PRIMARY KEY IDENTITY(1,1),
    Nombre VARCHAR(50) NOT NULL,
    Apellido VARCHAR(50) NOT NULL,
    FechaNacimiento DATETIME NOT NULL,
    IdSexo INT NOT NULL FOREIGN KEY REFERENCES Sexo(Id),
    IdRole INT NOT NULL FOREIGN KEY REFERENCES [Role](Id),
    IdGrado INT NOT NULL FOREIGN KEY REFERENCES Grado(Id),
    IdTurno INT NOT NULL FOREIGN KEY REFERENCES Turno(Id),
    IdEncargado INT NOT NULL FOREIGN KEY REFERENCES Encargado(Id),
    IdTipoDocumento INT NOT NULL FOREIGN KEY REFERENCES TipoDocumento(Id),
    NumDocumento VARCHAR(50) NOT NULL UNIQUE, 
    EsBecado BIT NOT NULL DEFAULT 0,
    IdPadrino INT NULL FOREIGN KEY REFERENCES Padrino(Id),
    IdAdministrador INT NOT NULL FOREIGN KEY REFERENCES [User](Id),
    RegistrationDate DATETIME NOT NULL
);
GO


-- TABLA Pago
CREATE TABLE Pago (
    Id INT NOT NULL PRIMARY KEY IDENTITY(1,1),
    IdAlumno INT NOT NULL FOREIGN KEY REFERENCES Alumno(Id),
    FechaPago DATETIME NOT NULL,
    IdTipoPago INT NOT NULL FOREIGN KEY REFERENCES TipoPago(Id),
    Cantidad DECIMAL(10,2) NOT NULL,
    MultaRetrazo DECIMAL(10,2) NOT NULL DEFAULT 0,
    PorcentajeDescuento DECIMAL(5,2) NOT NULL DEFAULT 0,
    TotalPagar AS (Cantidad + MultaRetrazo - (Cantidad * (PorcentajeDescuento / 100))),
    IdAdministrador INT NOT NULL FOREIGN KEY REFERENCES [User](Id),
    Descripcion VARCHAR(200) NOT NULL,
    IdEstadoPago INT NOT NULL DEFAULT 1 FOREIGN KEY REFERENCES EstadoPago(Id) -- Estado de pago general
);
GO

-- TABLA PagoMes (Relación entre Pago y Mes, con estado)
CREATE TABLE PagoMes (
    Id INT NOT NULL PRIMARY KEY IDENTITY(1,1),
    IdPago INT NOT NULL FOREIGN KEY REFERENCES Pago(Id),
    IdMes INT NOT NULL FOREIGN KEY REFERENCES Mes(Id),
    Anio INT NOT NULL,
    IdEstadoPago INT NOT NULL DEFAULT 1 FOREIGN KEY REFERENCES EstadoPago(Id) -- Estado específico del mes, por ejemplo, 'Pendiente' o 'Pagado'
);
GO

-- TABLA AuditLog
CREATE TABLE AuditLog (
    Id INT NOT NULL PRIMARY KEY IDENTITY(1,1),
    FechaHora DATETIME NOT NULL DEFAULT GETDATE(),
    IdUsuario INT NULL FOREIGN KEY REFERENCES [User](Id),
    Tabla VARCHAR(50) NOT NULL,
    Operacion VARCHAR(10) NOT NULL, 
    IdRegistro INT NOT NULL, 
    DatosAnteriores NVARCHAR(MAX), 
    DatosNuevos NVARCHAR(MAX) 
);
GO

