import { executeQuery } from '../helpers/dbHelper';
import sql from '../DataBase/contection/Conexion';

const AlumnoController = {
    async getAllAlumnos(req, res) {
        try {
            const result = await executeQuery('EXEC SPAlumnoGetAll');
            res.status(200).json(result.recordset);
        } catch (error) {
            console.error(`Error al obtener los alumnos: ${error}`);
            res.status(500).json({ msg: 'Error al obtener los alumnos' });
        }
    },

    async getAlumnoById(req, res) {
        const { id } = req.params;
        try {
            const result = await executeQuery('EXEC SPAlumnoGetById @Id = @Id', [
                { name: 'Id', type: sql.Int, value: id }
            ]);
            result.recordset.length > 0
                ? res.status(200).json(result.recordset[0])
                : res.status(404).json({ msg: 'Alumno no encontrado' });
        } catch (error) {
            console.error(`Error al obtener el alumno: ${error}`);
            res.status(500).json({ msg: 'Error al obtener el alumno' });
        }
    },

    async createAlumno(req, res) {
        const {
            Nombre, Apellido, FechaNacimiento, IdSexo, IdRole,
            IdGrado, IdTurno, IdEncargado, IdTipoDocumento,
            NumDocumento, EsBecado, IdPadrino
        } = req.body;

        try {
            const duplicateCheck = await executeQuery(
                'SELECT Id FROM Alumno WHERE NumDocumento = @NumDocumento',
                [{ name: 'NumDocumento', type: sql.NVarChar(50), value: NumDocumento }]
            );

            if (duplicateCheck.recordset.length > 0) {
                return res.status(400).json({ msg: 'Ya existe un alumno con el mismo número de documento' });
            }

            const IdAdministrador = req.user.id;

            // Configurar IdPadrino como NULL si el alumno no es becado
            const parameters = [
                { name: 'Nombre', type: sql.NVarChar(50), value: Nombre },
                { name: 'Apellido', type: sql.NVarChar(50), value: Apellido },
                { name: 'FechaNacimiento', type: sql.DateTime, value: FechaNacimiento },
                { name: 'IdSexo', type: sql.Int, value: IdSexo },
                { name: 'IdRole', type: sql.Int, value: IdRole },
                { name: 'IdGrado', type: sql.Int, value: IdGrado },
                { name: 'IdTurno', type: sql.Int, value: IdTurno },
                { name: 'IdEncargado', type: sql.Int, value: IdEncargado },
                { name: 'IdTipoDocumento', type: sql.Int, value: IdTipoDocumento },
                { name: 'NumDocumento', type: sql.NVarChar(50), value: NumDocumento },
                { name: 'EsBecado', type: sql.Bit, value: EsBecado },
                { name: 'IdPadrino', type: sql.Int, value: EsBecado ? IdPadrino : null },
                { name: 'IdAdministrador', type: sql.Int, value: IdAdministrador }
            ];

            const result = await executeQuery(
                'EXEC SPAlumnoCreate @Nombre = @Nombre, @Apellido = @Apellido, @FechaNacimiento = @FechaNacimiento, @IdSexo = @IdSexo, @IdRole = @IdRole, @IdGrado = @IdGrado, @IdTurno = @IdTurno, @IdEncargado = @IdEncargado, @IdTipoDocumento = @IdTipoDocumento, @NumDocumento = @NumDocumento, @EsBecado = @EsBecado, @IdPadrino = @IdPadrino, @IdAdministrador = @IdAdministrador',
                parameters
            );
            res.status(201).json({ msg: 'Alumno creado exitosamente', alumnoId: result.recordset[0].Id });
        } catch (error) {
            console.error(`Error al crear el alumno: ${error}`);
            res.status(500).json({ msg: 'Error al crear el alumno', error: error.message });
        }
    },
    async updateAlumno(req, res) {
        const { id } = req.params;
        const {
            Nombre, Apellido, FechaNacimiento, IdSexo, IdRole,
            IdGrado, IdTurno, IdEncargado, IdTipoDocumento,
            NumDocumento, EsBecado, IdPadrino
        } = req.body;

        try {
            // Primero, obtén el registro actual del alumno para verificar su NumDocumento
            const currentAlumno = await executeQuery(
                'SELECT NumDocumento FROM Alumno WHERE Id = @Id',
                [{ name: 'Id', type: sql.Int, value: id }]
            );

            if (currentAlumno.recordset.length === 0) {
                return res.status(404).json({ msg: 'Alumno no encontrado' });
            }

            const currentNumDocumento = currentAlumno.recordset[0].NumDocumento;

            // Solo verifica duplicados si el nuevo NumDocumento es diferente al actual
            if (NumDocumento !== currentNumDocumento) {
                const duplicateCheck = await executeQuery(
                    'SELECT Id FROM Alumno WHERE NumDocumento = @NumDocumento AND Id <> @Id',
                    [
                        { name: 'NumDocumento', type: sql.NVarChar(50), value: NumDocumento },
                        { name: 'Id', type: sql.Int, value: id }
                    ]
                );

                // Si se encuentra un registro con el mismo NumDocumento y diferente Id, devolver error
                if (duplicateCheck.recordset.length > 0) {
                    return res.status(400).json({ msg: 'Ya existe otro alumno con el mismo número de documento' });
                }
            }

            const IdAdministrador = req.user.id;

            // Configuración de los parámetros para la actualización
            const parameters = [
                { name: 'Id', type: sql.Int, value: id },
                { name: 'Nombre', type: sql.NVarChar(50), value: Nombre },
                { name: 'Apellido', type: sql.NVarChar(50), value: Apellido },
                { name: 'FechaNacimiento', type: sql.DateTime, value: FechaNacimiento },
                { name: 'IdSexo', type: sql.Int, value: IdSexo },
                { name: 'IdRole', type: sql.Int, value: IdRole },
                { name: 'IdGrado', type: sql.Int, value: IdGrado },
                { name: 'IdTurno', type: sql.Int, value: IdTurno },
                { name: 'IdEncargado', type: sql.Int, value: IdEncargado },
                { name: 'IdTipoDocumento', type: sql.Int, value: IdTipoDocumento },
                { name: 'NumDocumento', type: sql.NVarChar(50), value: NumDocumento },
                { name: 'EsBecado', type: sql.Bit, value: EsBecado },
                { name: 'IdPadrino', type: sql.Int, value: EsBecado ? IdPadrino : null }, // Si no es becado, dejar IdPadrino en null
                { name: 'IdAdministrador', type: sql.Int, value: IdAdministrador }
            ];

            const result = await executeQuery(
                'EXEC SPAlumnoUpdate @Id = @Id, @Nombre = @Nombre, @Apellido = @Apellido, @FechaNacimiento = @FechaNacimiento, @IdSexo = @IdSexo, @IdRole = @IdRole, @IdGrado = @IdGrado, @IdTurno = @IdTurno, @IdEncargado = @IdEncargado, @IdTipoDocumento = @IdTipoDocumento, @NumDocumento = @NumDocumento, @EsBecado = @EsBecado, @IdPadrino = @IdPadrino, @IdAdministrador = @IdAdministrador',
                parameters
            );

            res.status(200).json({ msg: 'Alumno actualizado exitosamente' });
        } catch (error) {
            console.error(`Error al actualizar el alumno: ${error}`);
            res.status(500).json({ msg: 'Error al actualizar el alumno', error: error.message });
        }
    },
    async deleteAlumno(req, res) {
        const { id } = req.params;
        const numericId = Number(id); // Convertir a número para evitar errores de tipo

        if (isNaN(numericId)) {
            return res.status(400).json({ msg: "ID inválido. Debe ser un número." });
        }

        try {
            await executeQuery('EXEC SPAlumnoDelete @Id = @Id', [
                { name: 'Id', type: sql.Int, value: numericId } // Asegurarse de que 'value' es numérico
            ]);
            res.status(200).json({ msg: 'Alumno eliminado exitosamente' });
        } catch (error) {
            console.error(`Error al eliminar el alumno: ${error}`);
            res.status(500).json({ msg: 'Error al eliminar el alumno', error: error.message });
        }
    },
    async getAlumnoByNumDocumento(req, res) {
        const { numDocumento } = req.params;
        try {
            const result = await executeQuery('EXEC SPAlumnoGetByNumDocumento @NumDocumento = @NumDocumento', [
                { name: 'NumDocumento', type: sql.NVarChar(50), value: numDocumento }
            ]);
            result.recordset.length > 0
                ? res.status(200).json(result.recordset[0])
                : res.status(404).json({ msg: 'Alumno no encontrado' });
        } catch (error) {
            console.error(`Error al obtener el alumno por número de documento: ${error}`);
            res.status(500).json({ msg: 'Error al obtener el alumno' });
        }
    }, async massUpdateAlumnos(req, res) {
        const { updates } = req.body; // "updates" es un arreglo de objetos { Id, IdGrado, IdTurno }
        const IdUsuario = req.user?.id; // Usuario que realiza la acción

        // Validación inicial
        if (!updates || !Array.isArray(updates) || updates.length === 0) {
            return res.status(400).json({ msg: 'No se proporcionaron actualizaciones válidas.' });
        }

        try {
            // Validar y convertir las entradas
            const validatedUpdates = updates.map(update => ({
                Id: parseInt(update.Id, 10),
                IdGrado: update.IdGrado ? parseInt(update.IdGrado, 10) : null,
                IdTurno: update.IdTurno ? parseInt(update.IdTurno, 10) : null,
            }));

            // Validar si algún `Id` no es válido
            const invalidEntries = validatedUpdates.filter(update => isNaN(update.Id));
            if (invalidEntries.length > 0) {
                console.error('Entradas inválidas:', invalidEntries);
                return res.status(400).json({
                    msg: 'Algunos registros tienen Ids no válidos.',
                    invalidEntries,
                });
            }

            // Crear la tabla tipo `AlumnoUpdateType`
            const updatesTable = new sql.Table('AlumnoUpdateType');
            updatesTable.columns.add('Id', sql.Int, { nullable: false });
            updatesTable.columns.add('IdGrado', sql.Int, { nullable: true });
            updatesTable.columns.add('IdTurno', sql.Int, { nullable: true });

            // Insertar datos validados en la tabla tipo
            validatedUpdates.forEach(update => {
                updatesTable.rows.add(update.Id, update.IdGrado, update.IdTurno);
            });

            // Logs para depuración
            console.log('Tabla enviada al SP:', updatesTable);

            // Ejecutar el procedimiento almacenado
            const request = new sql.Request();
            request.input('Updates', updatesTable); // Enviar la tabla al SP
            request.input('IdUsuario', sql.Int, IdUsuario); // ID del usuario que realiza la acción

            const result = await request.execute('SPAlumnoMassUpdate'); // Llamar al SP

            // Respuesta con los registros actualizados
            res.status(200).json({
                msg: 'Actualización masiva completada exitosamente.',
                updatedRecords: result.recordset, // Registros actualizados
            });
        } catch (error) {
            console.error('Error en la actualización masiva de alumnos:', error);
            res.status(500).json({
                msg: 'Ocurrió un error durante la actualización masiva.',
                error: error.message,
            });
        }
    },
}
export default AlumnoController;
