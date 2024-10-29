CREATE PROCEDURE ObtenerTodosSexos
AS
BEGIN
    SELECT Id, Nombre
    FROM Sexo;
END;
GO
CREATE PROCEDURE ObtenerSexoPorID
    @Id INT
AS
BEGIN
    -- Verificar si el registro existe antes de intentar seleccionarlo
    IF EXISTS (SELECT 1 FROM Sexo WHERE Id = @Id)
    BEGIN
        SELECT Id, Nombre
        FROM Sexo
        WHERE Id = @Id;
    END
    ELSE
    BEGIN
        -- Si no existe el registro, retornar un mensaje de error o un código
        RAISERROR('Sexo con el ID proporcionado no existe.', 16, 1);
    END
END;
GO
