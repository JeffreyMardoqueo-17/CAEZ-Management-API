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
---------auditoria para Encargado
CREATE TABLE AuditoriaEncargado (
    Id INT NOT NULL PRIMARY KEY IDENTITY(1,1),
    FechaHora DATETIME NOT NULL DEFAULT GETDATE(), -- Fecha y hora de la operación
    IdUsuario INT NOT NULL,                        -- ID del usuario que hizo la acción
    Operacion NVARCHAR(10) NOT NULL,               -- Operación: INSERT, UPDATE, DELETE
    IdRegistro INT,                                -- ID del registro en la tabla Encargado afectado
    Detalles NVARCHAR(MAX)                         -- Detalles de la operación (campos antiguos y nuevos)
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

CREATE TABLE AuditoriaAlumno (
    Id INT NOT NULL PRIMARY KEY IDENTITY(1,1),
    FechaHora DATETIME NOT NULL DEFAULT GETDATE(),   -- Fecha y hora de la operación
    IdUsuario INT NOT NULL,                          -- ID del usuario que hizo la acción
    Operacion NVARCHAR(10) NOT NULL,                 -- Operación: INSERT, UPDATE, DELETE
    IdRegistro INT,                                  -- ID del registro en la tabla Alumno afectado
    Detalles NVARCHAR(MAX)                           -- Detalles de la operación (campos antiguos y nuevos)
);
GO

-- Tabla principal para registrar un pago global
CREATE TABLE Pago (
    Id INT NOT NULL PRIMARY KEY IDENTITY(1,1), -- Identificador único del pago
    IdAlumno INT NOT NULL FOREIGN KEY REFERENCES Alumno(Id), -- Alumno que realiza el pago
    FechaPago DATETIME NOT NULL, -- Fecha en que se realiza el pago
    TotalPagar DECIMAL(10,2) NOT NULL, -- Total calculado del pago realizado
    IdAdministrador INT NOT NULL FOREIGN KEY REFERENCES [User](Id), -- Administrador que registró el pago
    Descripcion VARCHAR(200) NOT NULL, -- Descripción general del pago (Ej.: "Pago de matrícula y 2 mensualidades")
    IdEstadoPago INT NOT NULL DEFAULT 1 FOREIGN KEY REFERENCES EstadoPago(Id), -- Estado del pago global (Pendiente, Pagado, etc.)
    EsAnulado BIT NOT NULL DEFAULT 0, -- Indica si el pago fue anulado
    FechaAnulacion DATETIME NULL -- Fecha de anulación, en caso de que el pago sea cancelado
);
GO

-- Tabla que detalla los componentes individuales de un pago global
CREATE TABLE PagoDetalle (
    Id INT NOT NULL PRIMARY KEY IDENTITY(1,1), -- Identificador único del detalle de pago
    IdPago INT NOT NULL FOREIGN KEY REFERENCES Pago(Id), -- Relación con el pago global
    IdTipoPago INT NOT NULL FOREIGN KEY REFERENCES TipoPago(Id), -- Tipo de pago (Matrícula, Mensualidad, etc.)
    IdMes INT NULL FOREIGN KEY REFERENCES Mes(Id), -- Mes al que corresponde el pago (NULL si es matrícula)
    Anio INT NULL, -- Año del mes relacionado (NULL si no aplica)
    CantidadBase DECIMAL(10,2) NOT NULL, -- Monto base antes de aplicar descuentos o multas
    PorcentajeDescuento DECIMAL(5,2) NOT NULL DEFAULT 0, -- Porcentaje de descuento aplicado
    MultaRetrazo DECIMAL(10,2) NOT NULL DEFAULT 0, -- Multa aplicada por retraso
    -- Nota: CantidadFinal ya no es una columna calculada
    Descripcion VARCHAR(200) NOT NULL -- Detalle adicional del pago (Ej.: "Pago correspondiente a Enero 2024")
);
GO

-- Tabla que registra la relación entre meses y pagos realizados
CREATE TABLE PagoMes (
    Id INT NOT NULL PRIMARY KEY IDENTITY(1,1), -- Identificador único del registro
    IdPagoDetalle INT NOT NULL FOREIGN KEY REFERENCES PagoDetalle(Id), -- Relación con el detalle del pago
    IdMes INT NOT NULL FOREIGN KEY REFERENCES Mes(Id), -- Mes relacionado al pago
    Anio INT NOT NULL, -- Año relacionado al pago
    IdEstadoPago INT NOT NULL DEFAULT 1 FOREIGN KEY REFERENCES EstadoPago(Id) -- Estado del mes pagado (Pendiente, Pagado, Retrasado)
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

