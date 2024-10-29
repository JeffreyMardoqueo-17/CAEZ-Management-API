-- -------------------------
-- TABLA TipoDocumento
-- -- TABLA TipoDocumento
-- CREATE TABLE TipoDocumento(
--     Id INT NOT NULL PRIMARY KEY IDENTITY (1,1),
--     Nombre VARCHAR(50) NOT NULL
-- );
-- GO
-- -------------------------

-- Stored Procedure para Crear TipoDocumento
CREATE PROCEDURE SPTipoDocumentosCreate
    @Nombre VARCHAR(50)
AS
BEGIN
    -- Inserta un nuevo tipo de documento
    INSERT INTO TipoDocumento (Nombre)
    VALUES (@Nombre);

    -- Devuelve el Id del registro recién insertado
    SELECT SCOPE_IDENTITY() AS Id;
END;
GO

-- Stored Procedure para Traer Todos los TipoDocumentos o un TipoDocumento por ID
CREATE PROCEDURE SPTipoDocumentosGet
    @Id INT = NULL -- Si @Id es NULL, devolverá todos los tipos de documentos
AS
BEGIN
    IF @Id IS NULL
    BEGIN
        -- Devuelve todos los tipos de documentos
        SELECT * FROM TipoDocumento;
    END
    ELSE
    BEGIN
        -- Devuelve el tipo de documento con el Id especificado
        SELECT * FROM TipoDocumento WHERE Id = @Id;
    END
END;
GO

-- Stored Procedure para Traer TipoDocumento por ID
CREATE PROCEDURE SPGetTipoDocumentosPorId
    @Id INT
AS
BEGIN
    -- Devuelve el tipo de documento con el Id especificado
    SELECT * FROM TipoDocumento
    WHERE Id = @Id;
END;
GO

-- Stored Procedure para Actualizar TipoDocumento
CREATE PROCEDURE SPTipoDocumentosUpdate
    @Id INT,
    @Nombre VARCHAR(50)
AS
BEGIN
    -- Actualiza el tipo de documento con el Id especificado
    UPDATE TipoDocumento
    SET Nombre = @Nombre
    WHERE Id = @Id;
    
    -- Devuelve el registro actualizado
    SELECT * FROM TipoDocumento WHERE Id = @Id;
END;
GO

-- Stored Procedure para Eliminar TipoDocumento
CREATE PROCEDURE SPTipoDocumentosDelete
    @Id INT
AS
BEGIN
    -- Elimina el tipo de documento con el Id especificado
    DELETE FROM TipoDocumento
    WHERE Id = @Id;
END;
GO
