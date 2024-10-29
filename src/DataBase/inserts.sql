INSERT INTO
    EstadoPago (Nombre)
VALUES
    ('Pendiente');

INSERT INTO
    EstadoPago (Nombre)
VALUES
    ('Pagado');

INSERT INTO
    EstadoPago (Nombre)
VALUES
    ('Retrasado');

INSERT INTO
    EstadoPago (Nombre)
VALUES
    ('Anulado');

GO
INSERT INTO
    Mes (Nombre)
VALUES
    ('Enero');

INSERT INTO
    Mes (Nombre)
VALUES
    ('Febrero');

INSERT INTO
    Mes (Nombre)
VALUES
    ('Marzo');

INSERT INTO
    Mes (Nombre)
VALUES
    ('Abril');

INSERT INTO
    Mes (Nombre)
VALUES
    ('Mayo');

INSERT INTO
    Mes (Nombre)
VALUES
    ('Junio');

INSERT INTO
    Mes (Nombre)
VALUES
    ('Julio');

INSERT INTO
    Mes (Nombre)
VALUES
    ('Agosto');

INSERT INTO
    Mes (Nombre)
VALUES
    ('Septiembre');

INSERT INTO
    Mes (Nombre)
VALUES
    ('Octubre');

INSERT INTO
    Mes (Nombre)
VALUES
    ('Noviembre');

INSERT INTO
    Mes (Nombre)
VALUES
    ('Diciembre');

GO
INSERT INTO
    Parentezco (Nombre)
VALUES
    ('Papá');

INSERT INTO
    Parentezco (Nombre)
VALUES
    ('Mamá');

INSERT INTO
    Parentezco (Nombre)
VALUES
    ('Hermano');

INSERT INTO
    Parentezco (Nombre)
VALUES
    ('Hermana');

INSERT INTO
    Parentezco (Nombre)
VALUES
    ('Tío');

INSERT INTO
    Parentezco (Nombre)
VALUES
    ('Tía');

INSERT INTO
    Parentezco (Nombre)
VALUES
    ('Abuelo');

INSERT INTO
    Parentezco (Nombre)
VALUES
    ('Abuela');

INSERT INTO
    Parentezco (Nombre)
VALUES
    ('Primo');

INSERT INTO
    Parentezco (Nombre)
VALUES
    ('Prima');

GO
INSERT INTO
    Sexo (Nombre)
VALUES
    ('Femenino');

INSERT INTO
    Sexo (Nombre)
VALUES
    ('Masculino');

GO
INSERT INTO
    Turno (Nombre)
VALUES
    ('Mañana');

INSERT INTO
    Turno (Nombre)
VALUES
    ('Tarde');

GO
INSERT INTO
    TipoDocumento (Nombre)
VALUES
    ('DUI');

INSERT INTO
    TipoDocumento (Nombre)
VALUES
    ('NIE');

INSERT INTO
    TipoDocumento (Nombre)
VALUES
    ('NIT');

INSERT INTO
    TipoDocumento (Nombre)
VALUES
    ('Pasaporte');

INSERT INTO
    TipoDocumento (Nombre)
VALUES
    ('Carnet de Identidad');

GO
INSERT INTO
    TipoPago (Nombre)
VALUES
    ('Colegiatura');

INSERT INTO
    TipoPago (Nombre)
VALUES
    ('Matrícula');

INSERT INTO
    TipoPago (Nombre)
VALUES
    ('Examen');

INSERT INTO
    TipoPago (Nombre)
VALUES
    ('Materiales');

GO
INSERT INTO
    TipoPago (Nombre)
VALUES
    ('Colegiatura');

INSERT INTO
    TipoPago (Nombre)
VALUES
    ('Matrícula');

GO
-- Seleccionar todos los registros de EstadoPago
SELECT
    *
FROM
    EstadoPago;

-- Seleccionar todos los registros de Mes
SELECT
    *
FROM
    Mes;

-- Seleccionar todos los registros de Parentezco
SELECT
    *
FROM
    Parentezco;

-- Seleccionar todos los registros de Sexo
SELECT
    *
FROM
    Sexo;

-- Seleccionar todos los registros de Turno
SELECT
    *
FROM
    Turno;

-- Seleccionar todos los registros de TipoDocumento
SELECT
    *
FROM
    TipoDocumento;

-- Seleccionar todos los registros de TipoPago
SELECT
    *
FROM
    TipoPago;