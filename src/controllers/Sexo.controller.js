import { executeQuery } from '../helpers/dbHelper';
import sql from 'mssql';

/**
 * Controlador para gestionar operaciones relacionadas con la tabla `Sexo`.
 */
const SexoController = {
    /**
     * Obtiene todos los sexos disponibles.
     * 
     * @param {object} req - La solicitud HTTP.
     * @param {object} res - La respuesta HTTP.
     */
    async getTodosSexos(req, res) {
        try {
            // Ejecuta el procedimiento almacenado para obtener todos los sexos.
            const result = await executeQuery('EXEC ObtenerTodosSexos');
            res.status(200).json(result.recordset);
        } catch (error) {
            console.error(`Error al obtener los sexos: ${error}`);
            res.status(500).json({ msg: 'Error al obtener los sexos' });
        }
    },

    /**
     * Obtiene un sexo específico por su ID.
     * 
     * @param {object} req - La solicitud HTTP.
     * @param {object} res - La respuesta HTTP.
     * @param {number} req.params.id - El ID del sexo a obtener.
     */
    async getSexoById(req, res) {
        const { id } = req.params;
        try {
            // Ejecuta el procedimiento almacenado para obtener un sexo por su ID.
            const result = await executeQuery('EXEC ObtenerSexoPorID @Id', [
                { name: 'Id', type: sql.Int, value: id }
            ]);

            if (result.recordset.length > 0) {
                res.status(200).json(result.recordset[0]);
            } else {
                res.status(404).json({ msg: 'Sexo no encontrado' });
            }
        } catch (error) {
            if (error.message.includes('Sexo con el ID proporcionado no existe')) {
                res.status(404).json({ msg: 'Sexo no encontrado' });
            } else {
                console.error(`Error al obtener el sexo: ${error}`);
                res.status(500).json({ msg: 'Error al obtener el sexo' });
            }
        }
    },
};

export default SexoController;
